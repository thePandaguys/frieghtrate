import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import ScreenShell, { Card, SectionHeader } from '../../components/ScreenShell';
import { MultiLine } from '../../components/ChartsPro';
import { useTheme } from '../../constants/theme';
import { useAsync, fmtPct } from '../../hooks/useApi';
import { getAnalytics, getMarketHistory, getSnapshot, type AnalyticsSummary, type Snapshot } from '../../services/api';

export default function Stats() {
  const { colors } = useTheme();
  const analytics = useAsync<AnalyticsSummary>(() => getAnalytics(), []);
  const snap = useAsync<Snapshot>(() => getSnapshot(), []);
  const hist = useAsync(() => getMarketHistory('gladstone', 'paradip', 'Panamax', 'Coal', 1825), []);

  return (
    <ScreenShell title="Statistics & Model Audit" subtitle="Live market series (5-yr) and the honest prediction audit trail" badge="AUDIT" badgeColor={colors.primary}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
        {[
          ['Predictions stored', analytics.data?.predictions_stored, 'in SQLite (audited)'],
          ['Forecast runs', analytics.data?.forecast_history_count, 'last 100 window'],
          ['Risk scorings', analytics.data?.risk_history_count, 'last 100 window'],
          ['Idle predictions', analytics.data?.vessel_history_count, 'last 100 window'],
          ['Avg predicted idle', analytics.data?.avg_idle_hours, 'hours (stored runs)'],
          ['Benchmark vol.', snap.data?.benchmark_route.annualized_volatility_pct, '% annualised'],
        ].map(([label, value, sub]) => (
          <View key={String(label)} style={[styles.kpi, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={{ color: colors.textMuted, fontSize: 10, fontWeight: '800', letterSpacing: 1 }}>{String(label).toUpperCase()}</Text>
            <Text style={{ color: colors.text, fontSize: 24, fontWeight: '900', marginVertical: 4 }}>{value === null || value === undefined ? '—' : String(value)}</Text>
            <Text style={{ color: colors.textMuted, fontSize: 11 }}>{sub}</Text>
          </View>
        ))}
      </View>
      {analytics.loading ? <Card><ActivityIndicator color={colors.deepAccent} /></Card> : null}
      {analytics.data ? <Text style={{ color: colors.textMuted, fontSize: 11, marginTop: 8 }}>📌 {analytics.data.note}</Text> : null}

      <SectionHeader eyebrow="GLADSTONE → PARADIP · PANAMAX" title="5-year route rate & BDI (downsampled server-side for <2s render)" right={hist.data ? `${hist.data.elapsed_ms} ms · ${hist.data.count_raw}→${hist.data.count_downsampled} pts` : ''} />
      <Card>
        {hist.data ? (
          <MultiLine
            series={[{ name: 'Rate $/t', values: hist.data.rates }, { name: 'BDI (÷100)', values: hist.data.bdi.map((b) => b / 100) }]}
            labels={hist.data.dates}
            height={250}
          />
        ) : hist.error ? <Text style={{ color: colors.danger }}>API unavailable: {hist.error}</Text> : <ActivityIndicator color={colors.deepAccent} style={{ margin: 30 }} />}
        <Text style={{ color: colors.textMuted, fontSize: 11, marginTop: 10 }}>
          Provenance: {hist.data?.provenance ?? '…'} · WoW benchmark {snap.data ? fmtPct(snap.data.benchmark_route.wow_pct) : '…'}
        </Text>
      </Card>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  kpi: { flex: 1, minWidth: 170, borderWidth: 1, borderRadius: 14, padding: 14 },
});
