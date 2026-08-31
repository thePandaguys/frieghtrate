import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import ScreenShell, { Card, PrimaryButton, SectionHeader } from '../../components/ScreenShell';
import { ForecastBandChart } from '../../components/ChartsPro';
import { useTheme } from '../../constants/theme';
import { useAsync, fmtPct } from '../../hooks/useApi';
import { getMeta, postTiming, postForecastSeries, type Meta, type Timing, type ForecastSeries } from '../../services/api';

const VERDICT_STYLE: Record<string, { bg: string; fg: string }> = {
  'BUY-WINDOW': { bg: 'rgba(52,211,153,0.14)', fg: '#34D399' },
  'BUY NOW': { bg: 'rgba(248,113,113,0.14)', fg: '#F87171' },
  'HOLD': { bg: 'rgba(251,191,36,0.14)', fg: '#FBBF24' },
  'HOLD / MONITOR': { bg: 'rgba(251,191,36,0.14)', fg: '#FBBF24' },
};

export default function MarketEntry() {
  const { colors } = useTheme();
  const meta = useAsync<Meta>(() => getMeta(), []);
  const [origin, setOrigin] = useState('gladstone');
  const [destination, setDestination] = useState('paradip');
  const [vessel, setVessel] = useState('Panamax');
  const [weeks, setWeeks] = useState(8);
  const [result, setResult] = useState<Timing | null>(null);
  const [fc, setFc] = useState<ForecastSeries | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const origins = meta.data?.origins ?? [];
  const destinations = meta.data?.destinations ?? [];
  const vessels = meta.data?.vessel_classes.map((v) => v.name) ?? [];

  const analyze = async () => {
    setBusy(true); setError(null); setResult(null); setFc(null);
    try {
      const t = await postTiming({ origin, destination, vessel_type: vessel, horizon_weeks: weeks });
      const f = await postForecastSeries({ origin, destination, vessel_type: vessel, cargo_type: 'Coal', horizon_days: Math.min(90, weeks * 7), include_history_days: 40 });
      setResult(t); setFc(f);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  };

  const vs = result ? (VERDICT_STYLE[result.verdict] ?? VERDICT_STYLE['HOLD']) : null;

  return (
    <ScreenShell title="Optimal Market Entry & Charter Timing" subtitle="Rule-based BUY-WINDOW / HOLD / AVOID advice with the exact rule that fired (FR-07)" badge="ADVISOR" badgeColor={colors.primary}>
      <Card>
        <View style={styles.controls}>
          <View style={styles.control}>
            <Text style={[styles.label, { color: colors.textMuted }]}>ROUTE</Text>
            <Text style={{ color: colors.text, fontWeight: '700', fontSize: 14 }}>
              {(origins.find((o) => o.id === origin)?.name ?? origin).split(' (')[0]} → {(destinations.find((d) => d.id === destination)?.name ?? destination).split(' (')[0]}
            </Text>
            <View style={{ flexDirection: 'row', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
              {origins.slice(0, 5).map((o) => (
                <Text key={o.id} onPress={() => setOrigin(o.id)} style={[styles.chip, origin === o.id && { backgroundColor: colors.deepAccent, color: '#FFF' }]}>{o.name.split(' (')[0]}</Text>
              ))}
            </View>
            <View style={{ flexDirection: 'row', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
              {destinations.map((d) => (
                <Text key={d.id} onPress={() => setDestination(d.id)} style={[styles.chip, destination === d.id && { backgroundColor: colors.deepAccent, color: '#FFF' }]}>{d.name.split(' (')[0]}</Text>
              ))}
            </View>
          </View>
          <View style={styles.control}>
            <Text style={[styles.label, { color: colors.textMuted }]}>VESSEL & HORIZON</Text>
            <View style={{ flexDirection: 'row', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
              {vessels.map((v) => (
                <Text key={v} onPress={() => setVessel(v)} style={[styles.chip, vessel === v && { backgroundColor: colors.deepAccent, color: '#FFF' }]}>{v}</Text>
              ))}
            </View>
            <View style={{ flexDirection: 'row', gap: 6, marginTop: 8 }}>
              {[4, 8, 12].map((w) => (
                <Text key={w} onPress={() => setWeeks(w)} style={[styles.chip, weeks === w && { backgroundColor: colors.deepAccent, color: '#FFF' }]}>{w} weeks</Text>
              ))}
            </View>
            <View style={{ marginTop: 14 }}>
              <PrimaryButton label={busy ? 'Running rule engine…' : 'Get timing advice'} onPress={analyze} loading={busy} />
            </View>
          </View>
        </View>
      </Card>

      {error ? <Card><Text style={{ color: colors.danger }}>API unavailable: {error}</Text></Card> : null}
      {busy ? <Card><View style={{ alignItems: 'center', padding: 24 }}><ActivityIndicator color={colors.deepAccent} /><Text style={{ color: colors.textMuted, marginTop: 8 }}>Evaluating forecast, volatility & congestion rules…</Text></View></Card> : null}

      {result && vs ? (
        <>
          <SectionHeader eyebrow="CHARTER TIMING VERDICT" title="Recommendation" right={`AS OF ${result.as_of}`} />
          <Card>
            <View style={[styles.verdictBox, { backgroundColor: vs.bg, borderColor: vs.fg }]}>
              <Text style={{ fontSize: 42 }}>{result.icon}</Text>
              <View style={{ flex: 1, marginLeft: 14 }}>
                <Text style={{ color: vs.fg, fontSize: 26, fontWeight: '900', letterSpacing: 0.5 }}>{result.verdict}</Text>
                <Text style={{ color: colors.textSecondary, fontSize: 12, marginTop: 4, lineHeight: 18 }}>{result.rationale}</Text>
              </View>
              {result.expected_saving_usd_per_75kt > 0 ? (
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={{ color: vs.fg, fontWeight: '900', fontSize: 18 }}>≈ ${result.expected_saving_usd_per_75kt.toLocaleString()}</Text>
                  <Text style={{ color: colors.textMuted, fontSize: 10 }}>est. saving / 75kt parcel</Text>
                </View>
              ) : null}
            </View>

            <View style={styles.ruleGrid}>
              <View style={[styles.ruleCard, { backgroundColor: colors.cardAlt, borderColor: colors.border }]}>
                <Text style={[styles.label, { color: colors.textMuted }]}>RULES FIRED (each advice cites its rule)</Text>
                {result.rule_details.map((r) => (
                  <Text key={r} style={{ color: colors.text, fontSize: 12, marginTop: 6, fontFamily: 'monospace' }}>▸ {r}</Text>
                ))}
                {result.suggested_window ? (
                  <Text style={{ color: colors.text, fontSize: 12, marginTop: 8 }}>
                    📅 Suggested window: <Text style={{ fontWeight: '800' }}>{result.suggested_window[0]} → {result.suggested_window[1]}</Text>
                  </Text>
                ) : null}
              </View>
              <View style={[styles.ruleCard, { backgroundColor: colors.cardAlt, borderColor: colors.border }]}>
                <Text style={[styles.label, { color: colors.textMuted }]}>MARKET INPUTS</Text>
                <View style={styles.metaRow}><Text style={{ color: colors.textSecondary, fontSize: 12 }}>Spot</Text><Text style={{ color: colors.text, fontWeight: '700', fontSize: 12 }}>${result.forecast.spot.toFixed(2)}/t</Text></View>
                <View style={styles.metaRow}><Text style={{ color: colors.textSecondary, fontSize: 12 }}>{result.horizon_weeks}-wk forecast</Text><Text style={{ color: colors.text, fontWeight: '700', fontSize: 12 }}>${result.forecast.at_horizon.toFixed(2)} ({fmtPct(result.forecast.change_pct)})</Text></View>
                <View style={styles.metaRow}><Text style={{ color: colors.textSecondary, fontSize: 12 }}>80% CI</Text><Text style={{ color: colors.text, fontWeight: '700', fontSize: 12 }}>${result.forecast.ci_low.toFixed(1)}–${result.forecast.ci_high.toFixed(1)}</Text></View>
                <View style={styles.metaRow}><Text style={{ color: colors.textSecondary, fontSize: 12 }}>Volatility (ann.)</Text><Text style={{ color: colors.text, fontWeight: '700', fontSize: 12 }}>{result.volatility_annualised_pct}%</Text></View>
                <View style={styles.metaRow}><Text style={{ color: colors.textSecondary, fontSize: 12 }}>Dest. congestion</Text><Text style={{ color: colors.text, fontWeight: '700', fontSize: 12 }}>{result.destination_congestion}/100</Text></View>
                <View style={styles.metaRow}><Text style={{ color: colors.textSecondary, fontSize: 12 }}>Walk-fwd MAPE 30d</Text><Text style={{ color: colors.text, fontWeight: '700', fontSize: 12 }}>{result.walk_forward_mape_30d}%</Text></View>
                <View style={styles.metaRow}><Text style={{ color: colors.textSecondary, fontSize: 12 }}>Engine</Text><Text style={{ color: colors.text, fontWeight: '700', fontSize: 11 }}>{result.forecast.engine}</Text></View>
              </View>
            </View>
          </Card>

          {fc ? (
            <>
              <SectionHeader eyebrow="UNDERLYING FORECAST" title={`${vessel} rate path — ${weeks * 7 > 90 ? 90 : weeks * 7}d horizon`} />
              <Card>
                <ForecastBandChart history={fc.history} dates={fc.dates} forecast={fc.forecast} ciLow={fc.ci_low_80} ciHigh={fc.ci_high_80} height={210} />
              </Card>
            </>
          ) : null}
        </>
      ) : null}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  controls: { flexDirection: 'row', gap: 18, flexWrap: 'wrap' },
  control: { flex: 1, minWidth: 280 },
  label: { fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  chip: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, backgroundColor: 'rgba(127,127,127,0.12)', color: 'inherit', fontSize: 11, fontWeight: '700', overflow: 'hidden' },
  verdictBox: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderRadius: 16, padding: 16 },
  ruleGrid: { flexDirection: 'row', gap: 12, marginTop: 14, flexWrap: 'wrap' },
  ruleCard: { flex: 1, minWidth: 260, borderWidth: 1, borderRadius: 12, padding: 12 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 7 },
});
