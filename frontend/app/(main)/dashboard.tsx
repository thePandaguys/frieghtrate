import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import Sidebar from '../../components/Sidebar';
import { ForecastBandChart, Spark, RankedBars } from '../../components/ChartsPro';
import { PrimaryButton } from '../../components/ScreenShell';
import { useTheme } from '../../constants/theme';
import { useAsync, fmtPct } from '../../hooks/useApi';
import { getAlerts, getAnalytics, getMeta, getSnapshot, postForecastSeries, postOptimize, type Alert, type AnalyticsSummary, type Snapshot, type ForecastSeries, type OptimizeResult } from '../../services/api';

const roleOptions = ['Logistics Manager', 'Chartering Manager', 'Risk Analyst', 'Administrator'] as const;

export default function DashboardScreen() {
  const { width } = useWindowDimensions();
  const { colors } = useTheme();
  const isMobile = width < 900;
  const [role, setRole] = useState<(typeof roleOptions)[number]>('Logistics Manager');
  const [origin, setOrigin] = useState('gladstone');
  const [destination, setDestination] = useState('paradip');
  const [tonnes, setTonnes] = useState('75000');
  const [vessel, setVessel] = useState('Panamax');
  const [priority, setPriority] = useState<'cost' | 'time'>('cost');
  const [optResult, setOptResult] = useState<OptimizeResult | null>(null);
  const [optimizing, setOptimizing] = useState(false);

  const meta = useAsync(() => getMeta(), []);
  const snap = useAsync<Snapshot>(() => getSnapshot(), []);
  const alerts = useAsync<{ alerts: Alert[] }>(() => getAlerts(), []);
  const analytics = useAsync<AnalyticsSummary>(() => getAnalytics(), []);
  const fc = useAsync<ForecastSeries>(() => postForecastSeries({ origin: 'gladstone', destination: 'paradip', vessel_type: 'Panamax', cargo_type: 'Coal', horizon_days: 30, include_history_days: 90 }), []);

  const kpis = useMemo(() => {
    const s = snap.data;
    if (!s) return [];
    return [
      { label: 'BDI', value: Math.round(s.bdi.value).toLocaleString(), delta: fmtPct(s.bdi.wow_pct), spark: null as number[] | null, good: s.bdi.wow_pct <= 0 },
      { label: 'Coal $/t', value: `$${s.coal_price.value.toFixed(1)}`, delta: fmtPct(s.coal_price.wow_pct), spark: null as number[] | null, good: s.coal_price.wow_pct <= 0 },
      { label: 'USD/INR', value: `₹${s.usd_inr.value.toFixed(2)}`, delta: fmtPct(s.usd_inr.wow_pct), spark: null as number[] | null, good: s.usd_inr.wow_pct <= 0 },
      { label: `Benchmark ${s.benchmark_route.vessel} $/t`, value: `$${s.benchmark_route.rate_usd_t.toFixed(2)}`, delta: fmtPct(s.benchmark_route.wow_pct), spark: null as number[] | null, good: s.benchmark_route.wow_pct <= 0 },
      { label: 'Volatility ann.', value: `${s.benchmark_route.annualized_volatility_pct.toFixed(0)}%`, delta: '30d', spark: null as number[] | null, good: s.benchmark_route.annualized_volatility_pct < 35 },
    ];
  }, [snap.data]);

  const runOptimize = async () => {
    setOptimizing(true);
    setOptResult(null);
    try {
      const result = await postOptimize({ origin, destination, tonnes: Number(tonnes) || 75000, vessel_type: undefined as never, cargo_type: 'Coal', priority } as never);
      setOptResult(result);
    } catch {
      setOptResult(null);
    } finally {
      setOptimizing(false);
    }
  };

  if (isMobile) {
    return (
      <ScreenShellLite colors={colors}>
        <Text style={{ color: colors.text, fontSize: 22, fontWeight: '800' }}>Command Center</Text>
        <View style={{ gap: 8, marginTop: 12 }}>
          {kpis.map((k) => (
            <View key={k.label} style={[styles.kpiMobile, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={{ color: colors.textMuted, fontSize: 11, fontWeight: '700' }}>{k.label}</Text>
              <Text style={{ color: colors.text, fontSize: 20, fontWeight: '800' }}>{k.value}</Text>
              <Text style={{ color: k.good ? colors.success : colors.danger, fontSize: 12, fontWeight: '700' }}>{k.delta}</Text>
            </View>
          ))}
        </View>
        <Text style={{ color: colors.textMuted, marginTop: 16 }}>Open on a desktop display for the full command-center experience.</Text>
      </ScreenShellLite>
    );
  }

  return (
    <View style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={styles.shell}>
        <Sidebar />
        <View style={styles.mainArea}>
          {/* Top bar */}
          <View style={[styles.topBar, { backgroundColor: colors.topBar, borderBottomColor: colors.topBarBorder }]}>
            <View>
              <Text style={[styles.eyebrow, { color: colors.primary }]}>FREYNA Freight Intelligence & Analytics</Text>
              <Text style={[styles.title, { color: colors.text }]}>Command Center</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              {roleOptions.map((r) => (
                <Pressable key={r} onPress={() => setRole(r)} style={[styles.roleChip, role === r && { backgroundColor: colors.deepAccent }]}>
                  <Text style={{ color: role === r ? '#FFF' : colors.textSecondary, fontSize: 11, fontWeight: '700' }}>{r}</Text>
                </Pressable>
              ))}
              <View style={[styles.statusChip, { borderColor: colors.border, backgroundColor: colors.cardAlt }]}>
                <View style={[styles.liveDot, { backgroundColor: snap.loading ? colors.warning : colors.success }]} />
                <Text style={{ color: colors.textSecondary, fontSize: 11, fontWeight: '700' }}>
                  {snap.data ? `SYNCED ${snap.data.as_of}` : 'SYNCING…'}
                </Text>
              </View>
            </View>
          </View>

          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            {/* KPI strip */}
            <View style={styles.kpiRow}>
              {kpis.map((k) => (
                <View key={k.label} style={[styles.kpi, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <Text style={[styles.kpiLabel, { color: colors.textMuted }]}>{k.label}</Text>
                  <Text style={[styles.kpiValue, { color: colors.text }]}>{k.value}</Text>
                  <Text style={{ color: k.good ? colors.success : colors.danger, fontSize: 12, fontWeight: '700' }}>{k.delta}</Text>
                </View>
              ))}
              <View style={[styles.kpi, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Text style={[styles.kpiLabel, { color: colors.textMuted }]}>Predictions stored</Text>
                <Text style={[styles.kpiValue, { color: colors.text }]}>{analytics.data?.predictions_stored ?? '—'}</Text>
                <Text style={{ color: colors.textMuted, fontSize: 11 }}>audited in DB</Text>
              </View>
            </View>

            {/* Forecast chart + alerts */}
            <View style={styles.gridRow}>
              <View style={[styles.card, styles.cardWide, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={styles.cardHead}>
                  <View>
                    <Text style={[styles.cardEyebrow, { color: colors.primary }]}>AI FREIGHT FORECAST · GLADSTONE → PARADIP (PANAMAX, COAL)</Text>
                    <Text style={[styles.cardTitle, { color: colors.text }]}>30-Day Rate Path with 80% Confidence Band</Text>
                  </View>
                  <Pressable onPress={() => router.push('/(main)/forecast')}>
                    <Text style={{ color: colors.primary, fontSize: 12, fontWeight: '700' }}>Open forecast →</Text>
                  </Pressable>
                </View>
                {fc.data ? (
                  <ForecastBandChart history={fc.data.history} dates={fc.data.dates} forecast={fc.data.forecast} ciLow={fc.data.ci_low_80} ciHigh={fc.data.ci_high_80} height={230} />
                ) : (
                  <View style={{ padding: 40, alignItems: 'center' }}><ActivityIndicator color={colors.deepAccent} /></View>
                )}
              </View>

              <View style={[styles.card, styles.cardNarrow, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={styles.cardHead}>
                  <Text style={[styles.cardEyebrow, { color: colors.primary }]}>RISK ALERT FEED (FR-09)</Text>
                  <View style={[styles.liveDot, { backgroundColor: colors.success }]} />
                </View>
                <ScrollView style={{ maxHeight: 262 }} showsVerticalScrollIndicator={false}>
                  {(alerts.data?.alerts ?? []).slice(0, 8).map((a) => (
                    <View key={a.id} style={[styles.alertCard, { backgroundColor: colors.cardAlt, borderColor: colors.border }]}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ color: colors.primary, fontSize: 10, fontWeight: '800', letterSpacing: 0.5 }}>{a.category}</Text>
                        <Text style={{ color: a.severity === 'HIGH' ? colors.danger : colors.warning, fontSize: 10, fontWeight: '800' }}>{a.severity}</Text>
                      </View>
                      <Text style={{ color: colors.text, fontSize: 13, fontWeight: '700', marginTop: 3 }}>{a.title}</Text>
                      <Text style={{ color: colors.textMuted, fontSize: 11, marginTop: 2 }} numberOfLines={2}>{a.detail}</Text>
                      <Text style={{ color: colors.textMuted, fontSize: 10, marginTop: 3, opacity: 0.7 }}>{a.source} · {a.timestamp}</Text>
                    </View>
                  ))}
                  {!alerts.data && !alerts.error ? <ActivityIndicator color={colors.deepAccent} style={{ marginTop: 20 }} /> : null}
                  {alerts.error ? <Text style={{ color: colors.danger, padding: 12 }}>API unavailable: {alerts.error}</Text> : null}
                </ScrollView>
              </View>
            </View>

            {/* Congestion + optimizer */}
            <View style={styles.gridRow}>
              <View style={[styles.card, styles.cardWide, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={styles.cardHead}>
                  <Text style={[styles.cardEyebrow, { color: colors.primary }]}>PORT CONGESTION — INDIA EAST COAST</Text>
                  <Text style={{ color: colors.textMuted, fontSize: 11 }}>index / 100 · waiting hours</Text>
                </View>
                <View style={{ gap: 12, marginTop: 8 }}>
                  {(snap.data?.port_congestion ?? []).filter((p) => p.role === 'destination').slice(0, 6).map((p) => (
                    <View key={p.port_id}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                        <Text style={{ color: colors.text, fontSize: 12, fontWeight: '600' }}>{p.name}</Text>
                        <Text style={{ color: colors.textSecondary, fontSize: 12 }}>{p.congestion_index.toFixed(0)}/100 · ~{p.waiting_hours.toFixed(0)}h</Text>
                      </View>
                      <View style={{ height: 7, borderRadius: 4, backgroundColor: colors.cardAlt }}>
                        <View style={{ height: 7, width: `${Math.min(p.congestion_index, 100)}%`, borderRadius: 4, backgroundColor: p.congestion_index > 60 ? colors.danger : p.congestion_index > 40 ? colors.warning : colors.success }} />
                      </View>
                    </View>
                  ))}
                  {snap.error ? <Text style={{ color: colors.danger }}>API unavailable: {snap.error}</Text> : null}
                </View>
              </View>

              <View style={[styles.card, styles.cardNarrow, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Text style={[styles.cardEyebrow, { color: colors.primary }]}>VOYAGE OPTIMIZER (FR-06)</Text>
                <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
                  <View style={[styles.field, { backgroundColor: colors.cardAlt, borderColor: colors.border }]}>
                    <Text style={styles.fieldLabel}>ORIGIN</Text>
                    <Text style={{ color: colors.text, fontWeight: '700', fontSize: 13 }}>
                      {meta.data?.origins.find((o) => o.id === origin)?.name.split(' (')[0] ?? origin}
                    </Text>
                  </View>
                  <Pressable onPress={() => { const o = origin; setOrigin(destination); setDestination(o); }} style={styles.swapBtn}><Feather name="repeat" size={14} color={colors.primary} /></Pressable>
                </View>
                <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
                  <View style={[styles.field, { flex: 1, backgroundColor: colors.cardAlt, borderColor: colors.border }]}>
                    <Text style={styles.fieldLabel}>DISCHARGE</Text>
                    <Text style={{ color: colors.text, fontWeight: '700', fontSize: 13 }}>
                      {meta.data?.destinations.find((d) => d.id === destination)?.name.split(' (')[0] ?? destination}
                    </Text>
                  </View>
                  <Pressable onPress={() => setDestination(meta.data?.destinations[(meta.data.destinations.findIndex((d) => d.id === destination) + 1) % (meta.data?.destinations.length ?? 1)]?.id ?? destination)}
                    style={[styles.field, { backgroundColor: colors.cardAlt, borderColor: colors.border }]}>
                    <Text style={styles.fieldLabel}>CHANGE</Text>
                    <Feather name="chevron-right" size={13} color={colors.text} />
                  </Pressable>
                </View>
                <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
                  <Pressable onPress={() => setVessel(meta.data?.vessel_classes[(meta.data.vessel_classes.findIndex((v) => v.name === vessel) + 1) % (meta.data?.vessel_classes.length ?? 1)]?.name ?? vessel)}
                    style={[styles.field, { flex: 1, backgroundColor: colors.cardAlt, borderColor: colors.border }]}>
                    <Text style={styles.fieldLabel}>VESSEL</Text>
                    <Text style={{ color: colors.text, fontWeight: '700', fontSize: 13 }}>{vessel}</Text>
                  </Pressable>
                  <View style={[styles.field, { backgroundColor: colors.cardAlt, borderColor: colors.border }]}>
                    <Text style={styles.fieldLabel}>TONNES</Text>
                    <Text style={{ color: colors.text, fontWeight: '700', fontSize: 13 }}>{Number(tonnes).toLocaleString()}</Text>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
                  {(['cost', 'time'] as const).map((p) => (
                    <Pressable key={p} onPress={() => setPriority(p)} style={[styles.prioChip, priority === p && { backgroundColor: colors.deepAccent }]}>
                      <Text style={{ color: priority === p ? '#FFF' : colors.textSecondary, fontSize: 11, fontWeight: '700' }}>Priority: {p.toUpperCase()}</Text>
                    </Pressable>
                  ))}
                </View>
                <View style={{ marginTop: 12 }}>
                  <PrimaryButton label={optimizing ? 'Optimizing…' : 'Run optimization'} onPress={runOptimize} loading={optimizing} />
                </View>
                {optResult ? (
                  <View style={{ marginTop: 12 }}>
                    {optResult.options.slice(0, 3).map((o) => (
                      <View key={o.vessel_class} style={[styles.alertCard, { backgroundColor: colors.cardAlt, borderColor: colors.border }]}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                          <Text style={{ color: colors.text, fontWeight: '800', fontSize: 13 }}>{o.icon} #{o.rank} {o.vessel_class}</Text>
                          <Text style={{ color: colors.text, fontWeight: '800', fontSize: 13 }}>${o.cost_per_t_usd}/t</Text>
                        </View>
                        <Text style={{ color: colors.textMuted, fontSize: 11, marginTop: 2 }}>
                          {o.loadable_t.toLocaleString()} t · {o.total_voyage_days}d · TCE ${o.tce_usd_day.toLocaleString()}/d · ₹{o.cost_per_t_inr.toLocaleString()}/t
                        </Text>
                      </View>
                    ))}
                    <Pressable onPress={() => router.push('/(main)/optimizer')}>
                      <Text style={{ color: colors.primary, fontSize: 12, fontWeight: '700', marginTop: 6 }}>Full ranked analysis →</Text>
                    </Pressable>
                  </View>
                ) : null}
              </View>
            </View>

            {/* Ranked cost bars */}
            {optResult && optResult.options.length ? (
              <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, marginTop: 14 }]}>
                <Text style={[styles.cardEyebrow, { color: colors.primary }]}>DELIVERED COST RANKING — {optResult.options[0].loadable_t.toLocaleString()} T COAL</Text>
                <View style={{ marginTop: 12 }}>
                  <RankedBars
                    items={optResult.options.map((o) => ({
                      label: `${o.vessel_class} via ${optResult.destination.name.split(' (')[0]}`,
                      value: o.cost_per_t_usd,
                      sub: `${o.total_voyage_days}d · util ${o.utilisation_pct}%`,
                      best: o.rank === 1,
                      color: o.rank === 1 ? PALETTE_GOOD : undefined,
                    }))}
                  />
                </View>
              </View>
            ) : null}

            <Text style={[styles.footer, { color: colors.textMuted }]}>
              Data: calibrated reference curves + trained XGBoost artefacts · figures audited in SQLite · {analytics.data?.note ?? ''}
            </Text>
          </ScrollView>
        </View>
      </View>
    </View>
  );
}

const PALETTE_GOOD = '#34D399';

function ScreenShellLite({ colors, children }: { colors: { background: string; text: string; textMuted: string }; children: React.ReactNode }) {
  const { width } = useWindowDimensions();
  return (
    <View style={{ flex: 1, backgroundColor: colors.background, padding: width < 500 ? 14 : 24 }}>
      <ScrollView showsVerticalScrollIndicator={false}>{children}</ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  shell: { flex: 1, flexDirection: 'row' },
  mainArea: { flex: 1 },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 22, paddingVertical: 14, borderBottomWidth: 1 },
  eyebrow: { fontSize: 10, fontWeight: '800', letterSpacing: 1.6 },
  title: { fontSize: 20, fontWeight: '800', marginTop: 2 },
  roleChip: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, backgroundColor: 'rgba(127,127,127,0.12)' },
  statusChip: { flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6 },
  liveDot: { width: 7, height: 7, borderRadius: 4 },
  content: { padding: 20, gap: 2 },
  kpiRow: { flexDirection: 'row', gap: 12, flexWrap: 'wrap', marginBottom: 14 },
  kpi: { flex: 1, minWidth: 150, borderWidth: 1, borderRadius: 14, padding: 14 },
  kpiLabel: { fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  kpiValue: { fontSize: 21, fontWeight: '800', marginVertical: 4 },
  kpiMobile: { borderWidth: 1, borderRadius: 14, padding: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  gridRow: { flexDirection: 'row', gap: 14, marginTop: 2 },
  card: { borderWidth: 1, borderRadius: 16, padding: 16 },
  cardWide: { flex: 1.6, minWidth: 460 },
  cardNarrow: { flex: 1, minWidth: 300 },
  cardHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  cardEyebrow: { fontSize: 10, fontWeight: '800', letterSpacing: 1.2 },
  cardTitle: { fontSize: 15, fontWeight: '800', marginTop: 3 },
  alertCard: { borderWidth: 1, borderRadius: 10, padding: 10, marginBottom: 8 },
  field: { borderWidth: 1, borderRadius: 9, paddingHorizontal: 10, paddingVertical: 7 },
  fieldLabel: { fontSize: 9, fontWeight: '800', letterSpacing: 1, color: 'rgba(127,127,127,0.9)', marginBottom: 2 },
  swapBtn: { justifyContent: 'center', paddingHorizontal: 10, borderRadius: 9, backgroundColor: 'rgba(127,127,127,0.12)' },
  prioChip: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, backgroundColor: 'rgba(127,127,127,0.12)' },
  footer: { fontSize: 11, marginTop: 18, marginBottom: 6 },
});
