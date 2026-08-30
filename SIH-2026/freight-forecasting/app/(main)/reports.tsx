import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import ScreenShell, { Card, PrimaryButton, SectionHeader } from '../../components/ScreenShell';
import { useTheme } from '../../constants/theme';

type ReportType = 'VOYAGE' | 'FORECAST' | 'RISK' | 'WASTE';
type Report = { id: string; title: string; type: ReportType; date: string; description: string; status: 'READY' | 'PROCESSING' };

const reports: Report[] = [
  { id: 'RPT-0842', title: 'Rotterdam → Singapore', type: 'VOYAGE', date: '26 AUG 2026', description: 'Voyage intelligence and charter recommendation', status: 'READY' },
  { id: 'RPT-0841', title: '40-Day Freight Outlook', type: 'FORECAST', date: '26 AUG 2026', description: 'Projected freight movement and market trend', status: 'READY' },
  { id: 'RPT-0840', title: 'Fleet Risk Assessment', type: 'RISK', date: '25 AUG 2026', description: 'Operational and market risk analysis', status: 'READY' },
  { id: 'RPT-0839', title: 'Environmental Waste Review', type: 'WASTE', date: '24 AUG 2026', description: 'Fleet waste monitoring and compliance summary', status: 'READY' },
];

const typeColors: Record<ReportType, string> = { VOYAGE: '#69D2E7', FORECAST: '#2ECC8A', RISK: '#FA6900', WASTE: '#A7DBD8' };

export default function Reports() {
  const { colors } = useTheme();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'ALL' | ReportType>('ALL');

  const filtered = useMemo(() => reports.filter(r => {
    const q = search.toLowerCase();
    return (r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q) || r.id.toLowerCase().includes(q)) && (filter === 'ALL' || r.type === filter);
  }), [search, filter]);

  return (
    <ScreenShell title="Reports" subtitle="Intelligence reports, voyage analysis and operational records">
      {/* Metrics */}
      <View style={styles.metricsRow}>
        {[{ l: 'TOTAL', v: '24' }, { l: 'THIS WEEK', v: '08' }, { l: 'READY', v: '21', positive: true }].map(m => (
          <Card key={m.l} style={styles.metricCard}>
            <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>{m.l}</Text>
            <Text style={[styles.metricValue, { color: m.positive ? colors.success : colors.text }]}>{m.v}</Text>
          </Card>
        ))}
      </View>

      {/* Search */}
      <View style={[styles.searchBox, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder }]}>
        <Text style={[styles.searchIcon, { color: colors.primary }]}>⌕</Text>
        <TextInput value={search} onChangeText={setSearch} placeholder="Search reports or report ID" placeholderTextColor={colors.placeholder} style={[styles.searchInput, { color: colors.inputText }]} />
      </View>

      {/* Filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
        {(['ALL', 'VOYAGE', 'FORECAST', 'RISK', 'WASTE'] as const).map(f => (
          <TouchableOpacity
            key={f}
            onPress={() => setFilter(f)}
            style={[styles.filterBtn, { backgroundColor: filter === f ? colors.primary : colors.cardAlt, borderColor: filter === f ? colors.primary : colors.border }]}
            activeOpacity={0.8}
          >
            <Text style={[styles.filterText, { color: filter === f ? '#FFFFFF' : colors.textSecondary }]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <SectionHeader eyebrow="Generated Intelligence" title="Recent Reports" right={`${filtered.length} RESULTS`} />

      {filtered.map(r => (
        <Card key={r.id} style={styles.reportCard}>
          <View style={styles.reportTop}>
            <View style={[styles.reportIcon, { backgroundColor: typeColors[r.type] + '18' }]}>
              <Text style={{ fontSize: 18 }}>📄</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.reportTitle, { color: colors.text }]}>{r.title}</Text>
              <Text style={[styles.reportDesc, { color: colors.textSecondary }]}>{r.description}</Text>
            </View>
            <View style={[styles.typeBadge, { backgroundColor: typeColors[r.type] + '18', borderColor: typeColors[r.type] }]}>
              <Text style={[styles.typeText, { color: typeColors[r.type] }]}>{r.type}</Text>
            </View>
          </View>
          <View style={[styles.reportDivider, { backgroundColor: colors.divider }]} />
          <View style={styles.reportBottom}>
            <View>
              <Text style={[styles.metaLabel, { color: colors.textSecondary }]}>REPORT ID</Text>
              <Text style={[styles.metaValue, { color: colors.text }]}>{r.id}</Text>
            </View>
            <View>
              <Text style={[styles.metaLabel, { color: colors.textSecondary }]}>GENERATED</Text>
              <Text style={[styles.metaValue, { color: colors.text }]}>{r.date}</Text>
            </View>
            <View style={{ marginLeft: 'auto', alignItems: 'flex-end' }}>
              <View style={[styles.readyDot, { backgroundColor: colors.success }]} />
              <Text style={[styles.readyText, { color: colors.success }]}>{r.status}</Text>
            </View>
            <Text style={[styles.reportArrow, { color: colors.primary }]}>→</Text>
          </View>
        </Card>
      ))}

      {filtered.length === 0 && (
        <Card style={styles.emptyCard}>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>No reports found</Text>
          <Text style={[styles.emptySub, { color: colors.textSecondary }]}>Try changing the search or report category.</Text>
        </Card>
      )}

      {/* Generator */}
      <SectionHeader eyebrow="Report Generator" title="Generate New Intelligence" />
      <Card style={[styles.generatorCard, { borderColor: colors.primary }]}>
        <View style={styles.generatorHeader}>
          <Text style={[styles.generatorTitle, { color: colors.text }]}>Generate New Intelligence</Text>
          <View style={[styles.aiBadge, { backgroundColor: colors.primary + '18', borderColor: colors.primary }]}>
            <Text style={[styles.aiText, { color: colors.primary }]}>AI</Text>
          </View>
        </View>
        <Text style={[styles.generatorDesc, { color: colors.textSecondary }]}>Generate a consolidated report using the latest market, vessel, route and risk intelligence.</Text>
        <View style={styles.options}>
          {['VOYAGE', 'MARKET', 'RISK', 'FLEET'].map((o, i) => (
            <View key={o} style={[styles.option, { backgroundColor: i === 0 ? colors.primary + '18' : colors.cardAlt, borderColor: i === 0 ? colors.primary : colors.border }]}>
              {i === 0 && <View style={[styles.optionDot, { backgroundColor: colors.primary }]} />}
              <Text style={[styles.optionText, { color: i === 0 ? colors.primary : colors.textSecondary }]}>{o}</Text>
            </View>
          ))}
        </View>
        <PrimaryButton label="GENERATE REPORT" onPress={() => {}} icon="file-text" />
      </Card>

      {/* Analytics Chart */}
      <SectionHeader eyebrow="Report Analytics" title="Intelligence Activity" />
      <Card>
        <View style={styles.analyticsHeader}>
          <Text style={[styles.analyticsTitle, { color: colors.text }]}>Activity</Text>
          <Text style={[styles.analyticsValue, { color: colors.success }]}>86%</Text>
        </View>
        <View style={styles.chartBars}>
          {[35, 52, 43, 68, 58, 81, 96].map((h, i) => (
            <View key={i} style={[styles.chartBar, { height: h, backgroundColor: colors.primary, opacity: 0.6 + i * 0.06 }]} />
          ))}
        </View>
        <View style={styles.chartLabels}>
          {['AUG 20', 'AUG 23', 'AUG 26'].map(l => (
            <Text key={l} style={[styles.chartLabel, { color: colors.textSecondary }]}>{l}</Text>
          ))}
        </View>
      </Card>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  metricsRow: { flexDirection: 'row', gap: 10, marginBottom: 4 },
  metricCard: { flex: 1, alignItems: 'center', paddingVertical: 16 },
  metricLabel: { fontSize: 9, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  metricValue: { fontSize: 24, fontWeight: '800', marginTop: 8 },
  searchBox: { flexDirection: 'row', alignItems: 'center', height: 48, borderRadius: 12, borderWidth: 1.5, paddingHorizontal: 14, marginBottom: 4 },
  searchIcon: { fontSize: 20, marginRight: 8 },
  searchInput: { flex: 1, fontSize: 13, fontWeight: '600' },
  filters: { gap: 8, paddingVertical: 10 },
  filterBtn: { height: 34, paddingHorizontal: 14, borderRadius: 17, borderWidth: 1, justifyContent: 'center' },
  filterText: { fontSize: 12, fontWeight: '700' },
  reportCard: { marginBottom: 10 },
  reportTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  reportIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  reportTitle: { fontSize: 14, fontWeight: '700' },
  reportDesc: { fontSize: 11, marginTop: 3 },
  typeBadge: { paddingHorizontal: 8, paddingVertical: 5, borderRadius: 20, borderWidth: 1 },
  typeText: { fontSize: 10, fontWeight: '700' },
  reportDivider: { height: 1, marginVertical: 12 },
  reportBottom: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  metaLabel: { fontSize: 9, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  metaValue: { fontSize: 12, fontWeight: '700', marginTop: 3 },
  readyDot: { width: 6, height: 6, borderRadius: 3, marginBottom: 3 },
  readyText: { fontSize: 10, fontWeight: '700' },
  reportArrow: { fontSize: 20, marginLeft: 4 },
  emptyCard: { alignItems: 'center', paddingVertical: 24 },
  emptyTitle: { fontSize: 15, fontWeight: '700' },
  emptySub: { fontSize: 12, marginTop: 4 },
  generatorCard: { borderWidth: 2 },
  generatorHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  generatorTitle: { fontSize: 18, fontWeight: '800' },
  aiBadge: { width: 40, height: 36, borderRadius: 10, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  aiText: { fontSize: 12, fontWeight: '800' },
  generatorDesc: { fontSize: 13, lineHeight: 19, marginBottom: 12 },
  options: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 4 },
  option: { flexDirection: 'row', alignItems: 'center', gap: 5, height: 32, paddingHorizontal: 12, borderRadius: 16, borderWidth: 1 },
  optionDot: { width: 6, height: 6, borderRadius: 3 },
  optionText: { fontSize: 11, fontWeight: '700' },
  analyticsHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 },
  analyticsTitle: { fontSize: 16, fontWeight: '700' },
  analyticsValue: { fontSize: 18, fontWeight: '800' },
  chartBars: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, height: 100, marginBottom: 8 },
  chartBar: { flex: 1, borderRadius: 6 },
  chartLabels: { flexDirection: 'row', justifyContent: 'space-between' },
  chartLabel: { fontSize: 10, fontWeight: '600' },
});
