import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, View } from 'react-native';
import ScreenShell, { Card, PrimaryButton, SectionHeader } from '../../components/ScreenShell';
import { useTheme } from '../../constants/theme';
import { useAsync } from '../../hooks/useApi';
import { getMeta, postTCE, type Meta, type TCE } from '../../services/api';

/** TCE / Voyage Cost Calculator (FR-11) — replaces the off-topic 'waste' page. */
export default function TCECalculator() {
  const { colors } = useTheme();
  const meta = useAsync<Meta>(() => getMeta(), []);
  const origins = meta.data?.origins ?? [];
  const destinations = meta.data?.destinations ?? [];
  const vessels = meta.data?.vessel_classes.map((v) => v.name) ?? ['Panamax'];

  const [origin, setOrigin] = useState('richards_bay');
  const [destination, setDestination] = useState('visakhapatnam');
  const [vessel, setVessel] = useState('Capesize');
  const [tonnes, setTonnes] = useState('170000');
  const [rate, setRate] = useState('');
  const [useForecast, setUseForecast] = useState(true);
  const [result, setResult] = useState<TCE | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const compute = async () => {
    setBusy(true); setError(null);
    try {
      setResult(await postTCE({
        origin, destination, vessel_type: vessel, cargo_type: 'Coal',
        tonnes: Number(tonnes) || 75000,
        rate_usd_t: rate ? Number(rate) : null,
        use_forecast: useForecast || !rate,
      }));
    } catch (e) { setError(e instanceof Error ? e.message : String(e)); } finally { setBusy(false); }
  };

  return (
    <ScreenShell title="TCE / Voyage Cost Calculator" subtitle="What-if economics with documented, reproducible formulas (FR-11)" badge="CALCULATOR" badgeColor={colors.primary}>
      <Card>
        <View style={styles.row}>
          <View style={{ flex: 1, minWidth: 250 }}>
            <Text style={[styles.label, { color: colors.textMuted }]}>ROUTE</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
              {origins.slice(0, 8).map((o) => (
                <Text key={o.id} onPress={() => setOrigin(o.id)} style={[styles.chip, origin === o.id && { backgroundColor: colors.deepAccent, color: '#FFF' }]}>{o.name.split(' (')[0]}</Text>
              ))}
            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
              {destinations.map((d) => (
                <Text key={d.id} onPress={() => setDestination(d.id)} style={[styles.chip, destination === d.id && { backgroundColor: colors.deepAccent, color: '#FFF' }]}>{d.name.split(' (')[0]}</Text>
              ))}
            </View>
          </View>
          <View style={{ minWidth: 260 }}>
            <Text style={[styles.label, { color: colors.textMuted }]}>VESSEL</Text>
            <View style={{ flexDirection: 'row', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
              {vessels.map((v) => (
                <Text key={v} onPress={() => setVessel(v)} style={[styles.chip, vessel === v && { backgroundColor: colors.deepAccent, color: '#FFF' }]}>{v}</Text>
              ))}
            </View>
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.label, { color: colors.textMuted }]}>TONNES</Text>
                <TextInput value={tonnes} onChangeText={setTonnes} keyboardType="numeric"
                  style={[styles.input, { backgroundColor: colors.cardAlt, borderColor: colors.border, color: colors.text }]} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.label, { color: colors.textMuted }]}>RATE $/t (blank = forecast)</Text>
                <TextInput value={rate} onChangeText={setRate} keyboardType="decimal-pad" placeholder="auto"
                  placeholderTextColor={colors.placeholder}
                  style={[styles.input, { backgroundColor: colors.cardAlt, borderColor: colors.border, color: colors.text }]} />
              </View>
            </View>
            <Text onPress={() => setUseForecast(!useForecast)} style={{ color: useForecast ? colors.success : colors.textMuted, fontSize: 12, marginTop: 8, fontWeight: '700' }}>
              {useForecast ? '☑' : '☐'} use 30-day forecast rate
            </Text>
            <View style={{ marginTop: 12 }}>
              <PrimaryButton label={busy ? 'Computing…' : 'Compute voyage economics'} onPress={compute} loading={busy} />
            </View>
          </View>
        </View>
      </Card>

      {error ? <Card><Text style={{ color: colors.danger }}>API unavailable: {error}</Text></Card> : null}
      {busy ? <Card><View style={{ alignItems: 'center', padding: 24 }}><ActivityIndicator color={colors.deepAccent} /></View></Card> : null}

      {result ? (
        <>
          <SectionHeader eyebrow="RESULTS" title="Voyage economics" right={`AS OF ${result.as_of} · FX ₹${result.fx_used}`} />
          <Card>
            <View style={styles.bigRow}>
              <View style={styles.bigCell}>
                <Text style={{ color: colors.textMuted, fontSize: 10, fontWeight: '800' }}>COST / TONNE</Text>
                <Text style={{ color: colors.text, fontSize: 26, fontWeight: '900' }}>${result.cost_per_t_usd}</Text>
                <Text style={{ color: colors.textMuted, fontSize: 12 }}>₹{result.cost_per_t_inr.toLocaleString()}/t</Text>
              </View>
              <View style={styles.bigCell}>
                <Text style={{ color: colors.textMuted, fontSize: 10, fontWeight: '800' }}>TOTAL DELIVERED COST</Text>
                <Text style={{ color: colors.text, fontSize: 26, fontWeight: '900' }}>${result.total_delivered_cost_usd.toLocaleString()}</Text>
                <Text style={{ color: colors.textMuted, fontSize: 12 }}>₹{result.total_inr_cr.toLocaleString()} Cr</Text>
              </View>
              <View style={styles.bigCell}>
                <Text style={{ color: colors.textMuted, fontSize: 10, fontWeight: '800' }}>TCE</Text>
                <Text style={{ color: colors.text, fontSize: 26, fontWeight: '900' }}>${result.tce_usd_day.toLocaleString()}</Text>
                <Text style={{ color: colors.textMuted, fontSize: 12 }}>per day</Text>
              </View>
            </View>
            <View style={[styles.breakdown, { borderTopColor: colors.border }]}>
              {[
                ['Distance', `${result.distance_nm.toLocaleString()} nm`],
                ['Sea days', `${result.sea_days}`],
                ['Port days', `${result.port_days}`],
                ['Total voyage', `${result.total_voyage_days} d`],
                ['Rate used', `$${result.rate_used_usd_t}/t (${result.rate_mode})`],
                ['Freight', `$${result.freight_usd.toLocaleString()}`],
                ['Canal toll', `$${result.canal_toll_usd.toLocaleString()}`],
                ['Bunker', `$${result.fuel_usd.toLocaleString()} @ $${result.fuel_price_used_usd_t}/t`],
                ['Port costs', `$${result.port_costs_usd.toLocaleString()}`],
                ['Demurrage provision', `$${result.demurrage_risk_usd.toLocaleString()}`],
              ].map(([k, v]) => (
                <View key={k} style={styles.line}>
                  <Text style={{ color: colors.textSecondary, fontSize: 12 }}>{k}</Text>
                  <Text style={{ color: colors.text, fontSize: 12, fontWeight: '700' }}>{v}</Text>
                </View>
              ))}
            </View>
            <Text style={{ color: colors.textMuted, fontSize: 11, marginTop: 10, lineHeight: 16 }}>📐 {result.formula}</Text>
          </Card>
        </>
      ) : null}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 18, flexWrap: 'wrap' },
  label: { fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  chip: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, backgroundColor: 'rgba(127,127,127,0.12)', fontSize: 11, fontWeight: '700', overflow: 'hidden' },
  input: { borderWidth: 1, borderRadius: 9, paddingHorizontal: 10, paddingVertical: 8, fontSize: 14, fontWeight: '700', width: '100%' },
  bigRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  bigCell: { flex: 1, minWidth: 170, backgroundColor: 'rgba(127,127,127,0.06)', borderRadius: 12, padding: 14 },
  breakdown: { borderTopWidth: 1, marginTop: 14, paddingTop: 10 },
  line: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
});
