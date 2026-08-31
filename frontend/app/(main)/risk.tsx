import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import ScreenShell, { Card, PrimaryButton, SectionHeader } from '../../components/ScreenShell';
import { ProbBar, DonutGauge } from '../../components/ChartsPro';
import { useTheme } from '../../constants/theme';
import { useAsync } from '../../hooks/useApi';
import { getAlerts, getSnapshot, getRiskPredict, type Alert, type Snapshot } from '../../services/api';

export default function Risk() {
  const { colors } = useTheme();
  const snap = useAsync<Snapshot>(() => getSnapshot(), []);
  const alerts = useAsync<{ alerts: Alert[] }>(() => getAlerts(), []);
  const [risk, setRisk] = useState<{ prediction: string; probabilities: Record<string, number>; confidence: number | null } | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runModel = async () => {
    const s = snap.data;
    if (!s) return;
    setBusy(true); setError(null);
    try {
      setRisk(await getRiskPredict({
        freight_rate: s.benchmark_route.rate_usd_t,
        freight_rate_change_pct: s.benchmark_route.wow_pct,
        freight_volatility: s.benchmark_route.annualized_volatility_pct,
        bdi: Math.round(s.bdi.value),
        coal_price_change_pct: s.coal_price.wow_pct,
        crude_oil_price: s.crude_oil_price.value,
        port_congestion_index: (s.port_congestion.find((p) => p.role === 'destination')?.congestion_index ?? 45),
        demand_supply_ratio: 1 + s.demand_index.wow_pct / 100,
        weather_risk_index: s.port_congestion.filter((p) => p.role === 'destination').some((p) => p.congestion_index > 60) ? 55 : 25,
      }));
    } catch (e) { setError(e instanceof Error ? e.message : String(e)); } finally { setBusy(false); }
  };

  useEffect(() => { if (snap.data && !risk) void runModel(); /* eslint-disable-line */ }, [snap.data]);

  const sevColor = (s: string) => (s === 'HIGH' ? colors.danger : s === 'MEDIUM' ? colors.warning : colors.success);

  return (
    <ScreenShell title="Voyage Risk Assessment" subtitle="Trained risk classifier + live rule-triggered alert registry (FR-09)" badge={risk ? `MODEL: ${risk.prediction}` : 'SCANNING'} badgeColor={risk?.prediction === 'HIGH' ? colors.danger : risk ? colors.success : colors.warning}>
      <View style={{ flexDirection: 'row', gap: 14, flexWrap: 'wrap' }}>
        <Card style={{ flex: 1, minWidth: 300 }}>
          <Text style={[styles.eyebrow, { color: colors.primary }]}>ML RISK CLASSIFICATION</Text>
          {busy || (!risk && !error) ? (
            <View style={{ alignItems: 'center', padding: 30 }}><ActivityIndicator color={colors.deepAccent} /><Text style={{ color: colors.textMuted, marginTop: 8 }}>Scoring market state…</Text></View>
          ) : error ? (
            <View style={{ padding: 20 }}>
              <Text style={{ color: colors.danger, fontWeight: '700' }}>API unavailable: {error}</Text>
              <View style={{ marginTop: 10 }}><PrimaryButton label="Retry" onPress={runModel} /></View>
            </View>
          ) : risk ? (
            <>
              <View style={{ alignItems: 'center', marginVertical: 12 }}>
                <DonutGauge value={(risk.confidence ?? 0) * 100} max={100} label={`confidence · ${risk.prediction}`} color={risk.prediction === 'HIGH' ? '#F87171' : risk.prediction === 'MEDIUM' ? '#FBBF24' : '#34D399'} />
              </View>
              <ProbBar probs={risk.probabilities} />
              <Text style={{ color: colors.textMuted, fontSize: 11, marginTop: 12, lineHeight: 16 }}>
                Inputs derived live from market snapshot (spot, WoW change, 30d volatility, BDI, coal, congestion). Classification stored in the audit DB with every run.
              </Text>
            </>
          ) : null}
        </Card>

        <Card style={{ flex: 1.4, minWidth: 320 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
            <Text style={[styles.eyebrow, { color: colors.primary }]}>RULE-TRIGGERED ALERT REGISTRY</Text>
            <Text style={{ color: colors.textMuted, fontSize: 10 }}>{alerts.data?.count ?? '…'} active</Text>
          </View>
          <View style={{ maxHeight: 380 }}>
            {(alerts.data?.alerts ?? []).map((a) => (
              <View key={a.id} style={[styles.alert, { backgroundColor: colors.cardAlt, borderColor: colors.border }]}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ color: colors.text, fontWeight: '800', fontSize: 13 }}>{a.title}</Text>
                  <View style={{ backgroundColor: sevColor(a.severity) + '22', borderRadius: 6, paddingHorizontal: 7, paddingVertical: 2 }}>
                    <Text style={{ color: sevColor(a.severity), fontSize: 10, fontWeight: '900' }}>{a.severity}</Text>
                  </View>
                </View>
                <Text style={{ color: colors.textMuted, fontSize: 12, marginTop: 3 }}>{a.detail}</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                  <Text style={{ color: colors.primary, fontSize: 10, fontWeight: '700' }}>{a.category}</Text>
                  <Text style={{ color: colors.textMuted, fontSize: 10 }}>{a.source} · {a.timestamp}</Text>
                </View>
              </View>
            ))}
            {alerts.loading ? <ActivityIndicator color={colors.deepAccent} style={{ marginTop: 16 }} /> : null}
          </View>
        </Card>
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  eyebrow: { fontSize: 10, fontWeight: '800', letterSpacing: 1.2 },
  alert: { borderWidth: 1, borderRadius: 10, padding: 11, marginBottom: 8 },
});
