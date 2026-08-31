import React, { useState } from 'react';
import { ActivityIndicator, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import ScreenShell, { Card, PrimaryButton, SectionHeader } from '../../components/ScreenShell';
import { ForecastBandChart } from '../../components/ChartsPro';
import { useTheme } from '../../constants/theme';
import { useAsync, fmtPct } from '../../hooks/useApi';
import { exportForecastCsvUrl, getMeta, postForecastSeries, type Meta, type ForecastSeries } from '../../services/api';

const HORIZONS = [7, 14, 30, 60, 90];

function Picker({ label, options, value, onChange }: { label: string; options: { value: string; label: string }[]; value: string; onChange: (v: string) => void }) {
  const { colors } = useTheme();
  return (
    <View style={{ flex: 1, minWidth: 150 }}>
      <Text style={[styles.pickLabel, { color: colors.textMuted }]}>{label}</Text>
      <View style={[styles.pickWrap, { backgroundColor: colors.cardAlt, borderColor: colors.border }]}>
        {options.map((o) => (
          <Pressable key={o.value} onPress={() => onChange(o.value)}
            style={[styles.pick, value === o.value && { backgroundColor: colors.deepAccent }]}>
            <Text style={{ color: value === o.value ? '#FFF' : colors.textSecondary, fontSize: 12, fontWeight: '600' }} numberOfLines={1}>{o.label}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

export default function Forecast() {
  const { colors } = useTheme();
  const meta = useAsync<Meta>(() => getMeta(), []);
  const origins = meta.data?.origins ?? [];
  const destinations = meta.data?.destinations ?? [];
  const vessels = meta.data?.vessel_classes.map((v) => v.name) ?? ['Handysize', 'Supramax', 'Panamax', 'Capesize'];

  const [origin, setOrigin] = useState('gladstone');
  const [destination, setDestination] = useState('paradip');
  const [vessel, setVessel] = useState('Panamax');
  const [cargo, setCargo] = useState('Coal');
  const [horizon, setHorizon] = useState(30);

  const fc = useAsync<ForecastSeries>(
    () => postForecastSeries({ origin, destination, vessel_type: vessel, cargo_type: cargo, horizon_days: horizon, include_history_days: 60 }),
    [origin, destination, vessel, cargo, horizon]);

  const trendColor = fc.data?.trend === 'rising' ? colors.danger : fc.data?.trend === 'falling' ? colors.success : colors.warning;

  return (
    <ScreenShell title="Freight Forecast" subtitle="Walk-forward ML / baseline ensemble forecasts with honest 80% confidence bands (FR-04)" badge="LIVE ENGINE" badgeColor={colors.success}>
      <Card>
        <View style={styles.controlsRow}>
          <Picker label="LOAD PORT" options={origins.map((o) => ({ value: o.id, label: o.name.split(' (')[0] }))} value={origin} onChange={setOrigin} />
          <Picker label="DISCHARGE PORT" options={destinations.map((d) => ({ value: d.id, label: d.name.split(' (')[0] }))} value={destination} onChange={setDestination} />
          <Picker label="VESSEL CLASS" options={vessels.map((v) => ({ value: v, label: v }))} value={vessel} onChange={setVessel} />
          <Picker label="CARGO" options={(meta.data?.cargo_types ?? ['Coal']).map((c) => ({ value: c, label: c }))} value={cargo} onChange={setCargo} />
        </View>
      </Card>

      <SectionHeader eyebrow="AI FREIGHT RATE FORECASTING" title="Rate Outlook — USD/MT" right={fc.data ? `ENGINE: ${fc.data.engine.split(':')[0].toUpperCase()} · ${fc.data.elapsed_ms ?? ''}ms` : 'COMPUTING'} />
      <Card>
        {fc.loading ? (
          <View style={styles.center}><ActivityIndicator color={colors.deepAccent} /><Text style={{ color: colors.textMuted, marginTop: 8 }}>Running walk-forward forecast…</Text></View>
        ) : fc.error ? (
          <View style={styles.center}>
            <Text style={{ color: colors.danger, fontWeight: '700' }}>API unavailable</Text>
            <Text style={{ color: colors.textMuted, marginTop: 4, textAlign: 'center' }}>{fc.error}</Text>
            <View style={{ marginTop: 12 }}><PrimaryButton label="Retry" onPress={fc.reload} /></View>
          </View>
        ) : fc.data ? (
          <>
            <View style={styles.statRow}>
              <View style={styles.stat}>
                <Text style={[styles.statLabel, { color: colors.textMuted }]}>SPOT</Text>
                <Text style={[styles.statValue, { color: colors.text }]}>${fc.data.spot.toFixed(2)}</Text>
              </View>
              <View style={styles.stat}>
                <Text style={[styles.statLabel, { color: colors.textMuted }]}>{horizon}D FORECAST</Text>
                <Text style={[styles.statValue, { color: trendColor }]}>${fc.data.forecast[fc.data.forecast.length - 1].toFixed(2)}</Text>
              </View>
              <View style={styles.stat}>
                <Text style={[styles.statLabel, { color: colors.textMuted }]}>TREND</Text>
                <Text style={[styles.statValue, { color: trendColor }]}>{fc.data.trend_label}</Text>
              </View>
              <View style={styles.stat}>
                <Text style={[styles.statLabel, { color: colors.textMuted }]}>{horizon}D Δ / 80% CI</Text>
                <Text style={[styles.statValue, { color: trendColor }]}>{fmtPct(fc.data.change_pct_at_horizon)}</Text>
                <Text style={{ color: colors.textMuted, fontSize: 11 }}>${fc.data.ci_low_80[fc.data.ci_low_80.length - 1].toFixed(1)}–${fc.data.ci_high_80[fc.data.ci_high_80.length - 1].toFixed(1)}</Text>
              </View>
            </View>
            <View style={styles.horizonRow}>
              {HORIZONS.map((h) => (
                <Pressable key={h} onPress={() => setHorizon(h)} style={[styles.hBtn, horizon === h && { backgroundColor: colors.deepAccent }]}>
                  <Text style={{ color: horizon === h ? '#FFF' : colors.textSecondary, fontSize: 12, fontWeight: '700' }}>{h}D</Text>
                </Pressable>
              ))}
            </View>
            <ForecastBandChart
              history={fc.data.history}
              dates={fc.data.dates}
              forecast={fc.data.forecast}
              ciLow={fc.data.ci_low_80}
              ciHigh={fc.data.ci_high_80}
            />
            <View style={[styles.metaBox, { borderColor: colors.border, backgroundColor: colors.cardAlt }]}>
              <Text style={{ color: colors.textMuted, fontSize: 11, lineHeight: 17 }}>
                <Text style={{ fontWeight: '800', color: colors.textSecondary }}>Model transparency · </Text>
                engine <Text style={{ fontWeight: '700' }}>{fc.data.engine}</Text>; walk-forward MAPE 7d {fc.data.accuracy.mape_7d?.toFixed(1) ?? '—'}% · 14d {fc.data.accuracy.mape_14d?.toFixed(1) ?? '—'}% · 30d {fc.data.accuracy.mape_30d?.toFixed(1) ?? '—'}%. {fc.data.ci_note} As-of {fc.data.as_of}.
              </Text>
            </View>
          </>
        ) : null}
      </Card>

      <SectionHeader eyebrow="Deliverables" title="Export & Audit" />
      <Card>
        <View style={{ flexDirection: 'row', gap: 10, flexWrap: 'wrap' }}>
          <PrimaryButton label="Export forecast CSV (FR-14)" onPress={() => fc.data && Linking.openURL(exportForecastCsvUrl(origin, destination, vessel, cargo, horizon))} />
          <PrimaryButton label="Recompute" variant="ghost" onPress={fc.reload} />
        </View>
      </Card>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  controlsRow: { flexDirection: 'row', gap: 12, flexWrap: 'wrap' },
  pickLabel: { fontSize: 10, fontWeight: '800', letterSpacing: 1, marginBottom: 6 },
  pickWrap: { flexDirection: 'row', flexWrap: 'wrap', borderWidth: 1, borderRadius: 10, padding: 4, gap: 4 },
  pick: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 7 },
  center: { alignItems: 'center', padding: 30 },
  statRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 14 },
  stat: { flex: 1, minWidth: 130, backgroundColor: 'rgba(127,127,127,0.06)', borderRadius: 12, padding: 12 },
  statLabel: { fontSize: 10, fontWeight: '800', letterSpacing: 0.8, marginBottom: 4 },
  statValue: { fontSize: 20, fontWeight: '800' },
  horizonRow: { flexDirection: 'row', gap: 6, marginVertical: 12 },
  hBtn: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 8, backgroundColor: 'rgba(127,127,127,0.12)' },
  metaBox: { marginTop: 12, borderWidth: 1, borderRadius: 10, padding: 10 },
});
