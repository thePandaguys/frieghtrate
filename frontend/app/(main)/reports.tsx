import React, { useState } from 'react';
import { Linking, StyleSheet, Text, TextInput, View } from 'react-native';
import ScreenShell, { Card, PrimaryButton, SectionHeader } from '../../components/ScreenShell';
import { useTheme } from '../../constants/theme';
import { useAsync } from '../../hooks/useApi';
import { exportForecastCsvUrl, exportAlertsCsvUrl, exportOptimizationCsvUrl, getFixtures, postFixture, type Fixture } from '../../services/api';

export default function Reports() {
  const { colors } = useTheme();
  const fixtures = useAsync<{ fixtures: Fixture[]; count: number }>(() => getFixtures(), []);
  const [form, setForm] = useState({ vessel_name: 'MV Example', vessel_class: 'Panamax', origin: 'gladstone', destination: 'paradip', tonnes: '75000', rate_usd_t: '19.5', fixture_date: new Date().toISOString().slice(0, 10), broker: '' });
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const save = async () => {
    setMsg(null); setErr(null);
    try {
      await postFixture({
        vessel_name: form.vessel_name, vessel_class: form.vessel_class, origin: form.origin, destination: form.destination,
        cargo_type: 'Coal', tonnes: Number(form.tonnes), rate_usd_t: Number(form.rate_usd_t), fixture_date: form.fixture_date, broker: form.broker,
      });
      setMsg('Fixture saved ✓ (duplicates rejected by vessel+route+date rule)');
      void fixtures.reload();
    } catch (e) { setErr(e instanceof Error ? e.message : String(e)); }
  };

  const field = (key: keyof typeof form, label: string) => (
    <View style={{ flex: 1, minWidth: 140 }}>
      <Text style={{ color: colors.textMuted, fontSize: 9, fontWeight: '800', letterSpacing: 1, marginBottom: 4 }}>{label}</Text>
      <TextInput value={form[key]} onChangeText={(v) => setForm({ ...form, [key]: v })}
        style={{ backgroundColor: colors.cardAlt, borderColor: colors.border, borderWidth: 1, borderRadius: 9, paddingHorizontal: 10, paddingVertical: 8, color: colors.text, fontSize: 13, fontWeight: '600' }} />
    </View>
  );

  return (
    <ScreenShell title="Reports & Fixture Log" subtitle="CSV exports (FR-14) and fixture logging with duplicate detection (FR-08)" badge="EXPORTS" badgeColor={colors.primary}>
      <SectionHeader eyebrow="FR-14" title="Download current views" />
      <Card>
        <View style={{ flexDirection: 'row', gap: 10, flexWrap: 'wrap' }}>
          <PrimaryButton label="Forecast CSV (90d default)" onPress={() => Linking.openURL(exportForecastCsvUrl('gladstone', 'paradip', 'Panamax', 'Coal', 90))} />
          <PrimaryButton label="Optimization CSV" onPress={() => Linking.openURL(exportOptimizationCsvUrl('gladstone', 'paradip', 75000, 'Coal', 'cost'))} />
          <PrimaryButton label="Alerts CSV" onPress={() => Linking.openURL(exportAlertsCsvUrl())} />
        </View>
        <Text style={{ color: colors.textMuted, fontSize: 11, marginTop: 10 }}>All exports stream server-side rendered CSV — open directly in Excel.</Text>
      </Card>

      <SectionHeader eyebrow="FR-08 · CHARTERING CELL" title="Log a fixture" />
      <Card>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
          {field('vessel_name', 'VESSEL NAME')}
          {field('fixture_date', 'FIXTURE DATE (YYYY-MM-DD)')}
          {field('tonnes', 'TONNES')}
          {field('rate_usd_t', 'RATE $/T')}
          {field('broker', 'BROKER')}
        </View>
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
          {['gladstone', 'samarinda', 'richards_bay'].map((o) => (
            <Text key={o} onPress={() => setForm({ ...form, origin: o })} style={[styles.chip, form.origin === o && { backgroundColor: colors.deepAccent, color: '#FFF' }]}>{o}</Text>
          ))}
          <Text style={{ color: colors.textMuted }}>→</Text>
          {['paradip', 'visakhapatnam', 'haldia', 'dhamra'].map((d) => (
            <Text key={d} onPress={() => setForm({ ...form, destination: d })} style={[styles.chip, form.destination === d && { backgroundColor: colors.deepAccent, color: '#FFF' }]}>{d}</Text>
          ))}
        </View>
        <View style={{ marginTop: 14 }}>
          <PrimaryButton label="Save fixture" onPress={save} />
        </View>
        {msg ? <Text style={{ color: colors.success, marginTop: 10, fontWeight: '700' }}>{msg}</Text> : null}
        {err ? <Text style={{ color: colors.warning, marginTop: 10, fontWeight: '700' }}>⛔ {err}</Text> : null}
      </Card>

      <SectionHeader eyebrow="AUDIT" title={`Logged fixtures (${fixtures.data?.count ?? 0})`} />
      <Card>
        {(fixtures.data?.fixtures ?? []).slice().reverse().map((f) => (
          <View key={f.id} style={[styles.fixRow, { borderColor: colors.border }]}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.text, fontWeight: '800', fontSize: 13 }}>{f.vessel_name} · {f.vessel_class}</Text>
              <Text style={{ color: colors.textMuted, fontSize: 11 }}>{f.origin} → {f.destination} · {f.tonnes.toLocaleString()} t @ ${f.rate_usd_t}/t · {f.fixture_date}{f.broker ? ` · broker: ${f.broker}` : ''}</Text>
            </View>
            <Text style={{ color: colors.text, fontWeight: '800' }}>${f.total_usd.toLocaleString()}</Text>
          </View>
        ))}
        {!fixtures.data?.count ? <Text style={{ color: colors.textMuted, fontSize: 12 }}>No fixtures logged yet — save one above.</Text> : null}
      </Card>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  chip: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, backgroundColor: 'rgba(127,127,127,0.12)', fontSize: 11, fontWeight: '700', overflow: 'hidden' },
  fixRow: { flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, paddingVertical: 10, gap: 10 },
});
