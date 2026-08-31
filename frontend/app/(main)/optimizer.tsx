import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import ScreenShell, { Card, PrimaryButton, SectionHeader } from '../../components/ScreenShell';
import { RankedBars } from '../../components/ChartsPro';
import { useTheme } from '../../constants/theme';
import { useAsync, fmtInrCr } from '../../hooks/useApi';
import { exportOptimizationCsvUrl, getMeta, postOptimize, type Meta, type OptimizeResult } from '../../services/api';

export default function Optimizer() {
  const { colors } = useTheme();
  const meta = useAsync<Meta>(() => getMeta(), []);
  const origins = meta.data?.origins ?? [];
  const destinations = meta.data?.destinations ?? [];
  const [origin, setOrigin] = useState('gladstone');
  const [destination, setDestination] = useState('paradip');
  const [tonnes, setTonnes] = useState('75000');
  const [priority, setPriority] = useState<'cost' | 'time' | 'balanced'>('cost');
  const [result, setResult] = useState<OptimizeResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = async () => {
    setBusy(true); setError(null);
    try {
      setResult(await postOptimize({ origin, destination, tonnes: Number(tonnes) || 75000, cargo_type: 'Coal', priority }));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally { setBusy(false); }
  };

  return (
    <ScreenShell title="Vessel & Route Optimizer" subtitle="Feasibility screen (draft/LOA/beam/gear) then ranked by delivered cost, time or balance (FR-05 + FR-06)" badge="ENGINE" badgeColor={colors.success}>
      <Card>
        <View style={styles.row}>
          <View style={{ flex: 1, minWidth: 240 }}>
            <Text style={[styles.label, { color: colors.textMuted }]}>LOAD PORT</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
              {origins.map((o) => (
                <Text key={o.id} onPress={() => setOrigin(o.id)} style={[styles.chip, origin === o.id && { backgroundColor: colors.deepAccent, color: '#FFF' }]}>{o.name.split(' (')[0]}</Text>
              ))}
            </View>
            <Text style={[styles.label, { color: colors.textMuted, marginTop: 12 }]}>DISCHARGE PORT (EAST COAST INDIA)</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
              {destinations.map((d) => (
                <Text key={d.id} onPress={() => setDestination(d.id)} style={[styles.chip, destination === d.id && { backgroundColor: colors.deepAccent, color: '#FFF' }]}>{d.name.split(' (')[0]}</Text>
              ))}
            </View>
          </View>
          <View style={{ minWidth: 240 }}>
            <Text style={[styles.label, { color: colors.textMuted }]}>CARGO (TONNES)</Text>
            <View style={{ flexDirection: 'row', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
              {[30000, 50000, 75000, 150000, 170000].map((t) => (
                <Text key={t} onPress={() => setTonnes(String(t))} style={[styles.chip, tonnes === String(t) && { backgroundColor: colors.deepAccent, color: '#FFF' }]}>{t / 1000}k</Text>
              ))}
            </View>
            <Text style={[styles.label, { color: colors.textMuted, marginTop: 12 }]}>PRIORITY</Text>
            <View style={{ flexDirection: 'row', gap: 6, marginTop: 6 }}>
              {(['cost', 'time', 'balanced'] as const).map((p) => (
                <Text key={p} onPress={() => setPriority(p)} style={[styles.chip, priority === p && { backgroundColor: colors.deepAccent, color: '#FFF' }]}>{p}</Text>
              ))}
            </View>
            <View style={{ marginTop: 14 }}>
              <PrimaryButton label={busy ? 'Screening classes…' : 'Optimize voyage'} onPress={run} loading={busy} />
            </View>
          </View>
        </View>
      </Card>

      {error ? <Card><Text style={{ color: colors.danger }}>API unavailable: {error}</Text></Card> : null}
      {busy ? <Card><View style={{ alignItems: 'center', padding: 24 }}><ActivityIndicator color={colors.deepAccent} /></View></Card> : null}

      {result && !result.error ? (
        <>
          <SectionHeader eyebrow="RANKED OPTIONS" title={`Optimal vessel for ${result.tonnes.toLocaleString()} t → ${result.destination.name.split(' (')[0]}`} right={`FX ₹${result.usd_inr} · ${result.as_of}`} />
          <View style={{ gap: 10 }}>
            {result.options.map((o) => (
              <Card key={o.vessel_class}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                  <View>
                    <Text style={{ color: colors.text, fontWeight: '900', fontSize: 17 }}>{o.icon} #{o.rank} {o.vessel_class}</Text>
                    <Text style={{ color: colors.primary, fontSize: 11, fontWeight: '700', marginTop: 2 }}>{o.recommendation}</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={{ color: colors.text, fontWeight: '900', fontSize: 20 }}>${o.cost_per_t_usd}/t</Text>
                    <Text style={{ color: colors.textMuted, fontSize: 11 }}>₹{o.cost_per_t_inr.toLocaleString()}/t · {fmtInrCr(o.total_inr_cr)}</Text>
                  </View>
                </View>
                <View style={[styles.metaGrid, { borderTopColor: colors.border }]}>
                  {[
                    ['Loadable', `${o.loadable_t.toLocaleString()} t (${o.utilisation_pct}%)`],
                    ['Voyage', `${o.total_voyage_days} d (sea ${o.sea_days} + port ${o.port_days})`],
                    ['ML idle pred.', `${o.predicted_idle_hours} h`],
                    ['Rate used', `$${o.rate_used_usd_t}/t`],
                    ['Freight', `$${o.freight_usd.toLocaleString()}`],
                    ['Fuel + canal', `$${(o.fuel_usd + o.canal_toll_usd).toLocaleString()}`],
                    ['Port costs', `$${o.port_costs_usd.toLocaleString()}`],
                    ['Demurrage risk', `$${o.demurrage_risk_usd.toLocaleString()}`],
                    ['TCE', `$${o.tce_usd_day.toLocaleString()}/d`],
                    ['vs best', `${o.vs_best_pct > 0 ? '+' : ''}${o.vs_best_pct}%`],
                  ].map(([k, v]) => (
                    <View key={k} style={styles.metaCell}>
                      <Text style={{ color: colors.textMuted, fontSize: 10, fontWeight: '700' }}>{k.toUpperCase()}</Text>
                      <Text style={{ color: colors.text, fontSize: 12, fontWeight: '700' }}>{v}</Text>
                    </View>
                  ))}
                </View>
                {o.warnings.length ? (
                  <View style={{ marginTop: 8 }}>
                    {o.warnings.map((w) => <Text key={w} style={{ color: colors.warning, fontSize: 11, marginTop: 2 }}>⚠ {w}</Text>)}
                  </View>
                ) : null}
              </Card>
            ))}
          </View>

          <SectionHeader eyebrow="DELIVERED COST" title="Cost per tonne ranking" />
          <Card>
            <RankedBars items={result.options.map((o) => ({ label: o.vessel_class, value: o.cost_per_t_usd, sub: `${o.total_voyage_days}d`, best: o.rank === 1 }))} />
            <Text style={{ color: colors.textMuted, fontSize: 11, marginTop: 12 }}>
              Includes freight (forecast), canal tolls, bunker, port disbursements and demurrage-risk provision. Destination constraints per {result.destination.source} (as-of {result.destination.as_of}).
            </Text>
          </Card>

          <SectionHeader eyebrow="INELIGIBLE CLASSES" title="Feasibility screen" />
          <Card>
            {result.feasibility.classes.filter((c) => c.status === 'fail').map((c) => (
              <View key={c.vessel_class} style={{ marginBottom: 10 }}>
                <Text style={{ color: colors.danger, fontWeight: '800', fontSize: 13 }}>{c.icon} {c.vessel_class}</Text>
                {c.reasons.map((r) => <Text key={r} style={{ color: colors.textMuted, fontSize: 12, marginTop: 2 }}>· {r}</Text>)}
              </View>
            ))}
            {result.feasibility.classes.every((c) => c.status !== 'fail') ? <Text style={{ color: colors.success, fontWeight: '700' }}>All four classes feasible ✓</Text> : null}
            <View style={{ marginTop: 12 }}>
              <PrimaryButton label="Export ranking CSV" variant="ghost" onPress={() => { if (typeof window !== 'undefined') window.open(exportOptimizationCsvUrl(origin, destination, Number(tonnes), 'Coal', priority), '_blank'); }} />
            </View>
          </Card>
        </>
      ) : null}
      {result?.error ? <Card><Text style={{ color: colors.warning, fontWeight: '700' }}>{result.error}</Text></Card> : null}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 18, flexWrap: 'wrap' },
  label: { fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  chip: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, backgroundColor: 'rgba(127,127,127,0.12)', fontSize: 11, fontWeight: '700', overflow: 'hidden' },
  metaGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 0, borderTopWidth: 1, marginTop: 12, paddingTop: 10 },
  metaCell: { width: '20%', minWidth: 110, marginBottom: 8 },
});
