import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ScreenShell, { Card, PrimaryButton, SectionHeader } from '../../components/ScreenShell';
import { useTheme } from '../../constants/theme';
import { postScenarios, type ScenarioRow } from '../../services/api';

const PRESETS = [
  { name: 'Aust. coal · Panamax', origin: 'gladstone', destination: 'paradip', vessel_type: 'Panamax', tonnes: 75000 },
  { name: 'Aust. coal · Cape part', origin: 'gladstone', destination: 'paradip', vessel_type: 'Capesize', tonnes: 75000 },
  { name: 'RSA coal · Cape', origin: 'richards_bay', destination: 'visakhapatnam', vessel_type: 'Capesize', tonnes: 170000 },
  { name: 'Indo coal · Supra', origin: 'samarinda', destination: 'haldia', vessel_type: 'Supramax', tonnes: 55000 },
];

export default function Simulator() {
  const { colors } = useTheme();
  const [selected, setSelected] = useState<string[]>([PRESETS[0].name, PRESETS[2].name]);
  const [rows, setRows] = useState<ScenarioRow[] | null>(null);
  const [fx, setFx] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggle = (name: string) => setSelected((s) => s.includes(name) ? s.filter((x) => x !== name) : s.length < 4 ? [...s, name] : s);

  const run = async () => {
    setBusy(true); setError(null);
    try {
      const scenarios = PRESETS.filter((p) => selected.includes(p.name)).map((p) => ({ ...p, cargo_type: 'Coal', use_forecast: true }));
      const res = await postScenarios(scenarios);
      setRows(res.scenarios); setFx(res.usd_inr);
    } catch (e) { setError(e instanceof Error ? e.message : String(e)); } finally { setBusy(false); }
  };

  const cols: [string, (r: ScenarioRow) => string][] = [
    ['Distance', (r) => `${r.distance_nm.toLocaleString()} nm`],
    ['Voyage days', (r) => `${r.total_voyage_days}`],
    ['Rate $/t', (r) => `$${r.rate_used_usd_t}`],
    ['Total cost', (r) => `$${r.total_delivered_cost_usd.toLocaleString()}`],
    ['$ / t', (r) => `$${r.cost_per_t_usd}`],
    ['₹ / t', (r) => `₹${r.cost_per_t_inr.toLocaleString()}`],
    ['TCE $/day', (r) => `$${r.tce_usd_day.toLocaleString()}`],
    ['Δ vs best', (r) => r.delta_vs_best_usd_t !== undefined ? `${r.delta_vs_best_usd_t > 0 ? '+' : ''}$${r.delta_vs_best_usd_t}/t` : '—'],
  ];

  return (
    <ScreenShell title="What-If Scenario Comparison" subtitle="Side-by-side voyage economics incl. ₹/$ conversion (FR-12)" badge="COMPARE" badgeColor={colors.primary}>
      <Card>
        <Text style={[styles.label, { color: colors.textMuted }]}>SELECT 2–4 SCENARIOS</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
          {PRESETS.map((p) => (
            <Text key={p.name} onPress={() => toggle(p.name)}
              style={[styles.chip, selected.includes(p.name) && { backgroundColor: colors.deepAccent, color: '#FFF' }]}>
              {selected.includes(p.name) ? '☑ ' : '☐ '}{p.name}
            </Text>
          ))}
        </View>
        <View style={{ marginTop: 14 }}>
          <PrimaryButton label={busy ? 'Computing…' : `Compare ${selected.length} scenarios`} onPress={run} loading={busy} />
        </View>
        {error ? <Text style={{ color: colors.danger, marginTop: 10 }}>API unavailable: {error}</Text> : null}
      </Card>

      {rows ? (
        <>
          <SectionHeader eyebrow="SIDE-BY-SIDE" title="Comparison table" right={`FX ₹${fx} · converted today`} />
          <Card>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ width: 170 }}>
                <Text style={[styles.th, { color: colors.textMuted }]}>Scenario</Text>
                {rows.map((r) => <Text key={r.scenario} style={[styles.td, { color: colors.text, fontWeight: '800' }]}>{r.scenario}</Text>)}
              </View>
              {cols.map(([name, fn], ci) => (
                <View key={name} style={{ flex: 1, minWidth: 92 }}>
                  <Text style={[styles.th, { color: colors.textMuted }]}>{name}</Text>
                  {rows.map((r) => (
                    <Text key={r.scenario} style={[styles.td, { color: ci === cols.length - 1 ? (Number(String(fn(r)).replace(/[^0-9.-]/g, '')) > 0 ? colors.danger : colors.success) : colors.text }]}>{fn(r)}</Text>
                  ))}
                </View>
              ))}
            </View>
            <Text style={{ color: colors.textMuted, fontSize: 11, marginTop: 12 }}>
              Every scenario runs the same documented formula set (see TCE Calculator). Best option highlighted in the Δ column — green = best.
            </Text>
          </Card>
        </>
      ) : null}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  chip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, backgroundColor: 'rgba(127,127,127,0.12)', fontSize: 12, fontWeight: '700', overflow: 'hidden' },
  th: { fontSize: 10, fontWeight: '800', letterSpacing: 0.6, marginBottom: 8 },
  td: { fontSize: 13, fontWeight: '600', paddingVertical: 7, borderTopWidth: 1, borderTopColor: 'rgba(127,127,127,0.15)' },
});
