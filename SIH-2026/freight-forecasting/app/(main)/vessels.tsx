import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import ScreenShell, { Card, PrimaryButton, SectionHeader } from '../../components/ScreenShell';
import { useTheme } from '../../constants/theme';

type VesselStatus = 'AVAILABLE' | 'AT SEA' | 'CHARTERED';
type Vessel = { name: string; type: string; dwt: string; route: string; status: VesselStatus; score: number; eta: string };

const vessels: Vessel[] = [
  { name: 'OCEAN TITAN', type: 'VLCC', dwt: '298,000 DWT', route: 'Rotterdam → Singapore', status: 'AVAILABLE', score: 94.7, eta: 'Available now' },
  { name: 'PACIFIC HORIZON', type: 'VLCC', dwt: '285,000 DWT', route: 'Ras Tanura → Singapore', status: 'AT SEA', score: 91.4, eta: 'ETA 3 days' },
  { name: 'BLUE MERIDIAN', type: 'SUEZMAX', dwt: '158,000 DWT', route: 'Houston → Rotterdam', status: 'AVAILABLE', score: 88.9, eta: 'Available now' },
  { name: 'NORTHSTAR', type: 'VLCC', dwt: '301,000 DWT', route: 'Singapore → Fujairah', status: 'CHARTERED', score: 84.2, eta: 'Chartered' },
];

export default function Vessels() {
  const { colors } = useTheme();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'ALL' | VesselStatus>('ALL');

  const filtered = useMemo(() => vessels.filter(v => {
    const q = search.toLowerCase();
    return (v.name.toLowerCase().includes(q) || v.type.toLowerCase().includes(q)) && (filter === 'ALL' || v.status === filter);
  }), [search, filter]);

  const statusColor = (s: VesselStatus) => s === 'AVAILABLE' ? colors.success : s === 'AT SEA' ? colors.primary : colors.textSecondary;

  return (
    <ScreenShell title="Vessel Intelligence" subtitle="Fleet availability and AI suitability analysis" badge="LIVE" badgeColor={colors.success}>
      {/* Summary */}
      <Card>
        <View style={styles.summaryRow}>
          <View style={{ flex: 1.4 }}>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>MONITORED FLEET</Text>
            <Text style={[styles.summaryValue, { color: colors.text }]}>486</Text>
            <Text style={[styles.summarySub, { color: colors.textSecondary }]}>vessels currently tracked</Text>
          </View>
          <View style={[styles.summaryDivider, { backgroundColor: colors.divider }]} />
          {[{ l: 'AVAILABLE', v: '142' }, { l: 'AT SEA', v: '271' }].map(m => (
            <View key={m.l} style={styles.summaryMetric}>
              <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>{m.l}</Text>
              <Text style={[styles.metricValue, { color: colors.primary }]}>{m.v}</Text>
            </View>
          ))}
        </View>
      </Card>

      {/* Search */}
      <View style={[styles.searchBox, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder }]}>
        <Text style={[styles.searchIcon, { color: colors.primary }]}>⌕</Text>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search vessel or class"
          placeholderTextColor={colors.placeholder}
          style={[styles.searchInput, { color: colors.inputText }]}
        />
      </View>

      {/* Filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
        {(['ALL', 'AVAILABLE', 'AT SEA', 'CHARTERED'] as const).map(f => (
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

      <SectionHeader eyebrow="Fleet Database" title="Vessel Matches" right={`${filtered.length} RESULTS`} />

      {filtered.map((v, i) => (
        <Card key={v.name} style={styles.vesselCard}>
          <View style={styles.vesselTop}>
            <View style={[styles.rankBox, { backgroundColor: colors.primary + '18' }]}>
              <Text style={[styles.rankText, { color: colors.primary }]}>{String(i + 1).padStart(2, '0')}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.vesselName, { color: colors.text }]}>{v.name}</Text>
              <Text style={[styles.vesselType, { color: colors.textSecondary }]}>{v.type} • {v.dwt}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: statusColor(v.status) + '18', borderColor: statusColor(v.status) }]}>
              <View style={[styles.statusDot, { backgroundColor: statusColor(v.status) }]} />
              <Text style={[styles.statusText, { color: statusColor(v.status) }]}>{v.status}</Text>
            </View>
          </View>
          <View style={[styles.routeRow, { borderTopColor: colors.divider }]}>
            <View style={[styles.routeDot, { backgroundColor: colors.primary }]} />
            <Text style={[styles.routeText, { color: colors.textSecondary }]}>{v.route}</Text>
          </View>
          <View style={styles.vesselBottom}>
            <View>
              <Text style={[styles.bottomLabel, { color: colors.textSecondary }]}>AVAILABILITY</Text>
              <Text style={[styles.bottomValue, { color: colors.text }]}>{v.eta}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={[styles.bottomLabel, { color: colors.textSecondary }]}>AI MATCH</Text>
              <Text style={[styles.matchValue, { color: colors.success }]}>{v.score}%</Text>
            </View>
          </View>
          <View style={[styles.matchTrack, { backgroundColor: colors.divider }]}>
            <View style={[styles.matchFill, { width: `${v.score}%`, backgroundColor: colors.primary }]} />
          </View>
        </Card>
      ))}

      {filtered.length === 0 && (
        <Card style={styles.emptyCard}>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>No vessels found</Text>
          <Text style={[styles.emptySub, { color: colors.textSecondary }]}>Try changing your search or availability filter.</Text>
        </Card>
      )}

      {/* AI Optimizer CTA */}
      <Card style={[styles.optimizerCard, { borderColor: colors.primary }]}>
        <View style={styles.optimizerHeader}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.optimizerEyebrow, { color: colors.primary }]}>AI VESSEL OPTIMIZER</Text>
            <Text style={[styles.optimizerTitle, { color: colors.text }]}>Find the best vessel</Text>
          </View>
          <View style={[styles.aiBadge, { backgroundColor: colors.primary + '18', borderColor: colors.primary }]}>
            <Text style={[styles.aiText, { color: colors.primary }]}>AI</Text>
          </View>
        </View>
        <Text style={[styles.optimizerDesc, { color: colors.textSecondary }]}>Match vessel capacity, route compatibility, availability and operational risk against a specific voyage.</Text>
        <PrimaryButton label="OPEN VESSEL OPTIMIZER" onPress={() => router.push('/(main)/optimizer')} icon="zap" />
      </Card>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  summaryRow: { flexDirection: 'row', alignItems: 'center' },
  summaryLabel: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  summaryValue: { fontSize: 28, fontWeight: '800', marginTop: 4 },
  summarySub: { fontSize: 11, marginTop: 2 },
  summaryDivider: { width: 1, height: 60, marginHorizontal: 14 },
  summaryMetric: { flex: 1, alignItems: 'center' },
  metricLabel: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  metricValue: { fontSize: 22, fontWeight: '800', marginTop: 6 },
  searchBox: { flexDirection: 'row', alignItems: 'center', height: 48, borderRadius: 12, borderWidth: 1.5, paddingHorizontal: 14, marginBottom: 4 },
  searchIcon: { fontSize: 20, marginRight: 8 },
  searchInput: { flex: 1, fontSize: 13, fontWeight: '600' },
  filters: { gap: 8, paddingVertical: 10 },
  filterBtn: { height: 34, paddingHorizontal: 14, borderRadius: 17, borderWidth: 1, justifyContent: 'center' },
  filterText: { fontSize: 12, fontWeight: '700' },
  vesselCard: { marginBottom: 10 },
  vesselTop: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  rankBox: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  rankText: { fontSize: 12, fontWeight: '800' },
  vesselName: { fontSize: 14, fontWeight: '700' },
  vesselType: { fontSize: 11, marginTop: 2 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 8, paddingVertical: 5, borderRadius: 20, borderWidth: 1 },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 10, fontWeight: '700' },
  routeRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12, paddingTop: 12, borderTopWidth: 1 },
  routeDot: { width: 8, height: 8, borderRadius: 4 },
  routeText: { fontSize: 12, fontWeight: '600' },
  vesselBottom: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  bottomLabel: { fontSize: 9, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  bottomValue: { fontSize: 13, fontWeight: '700', marginTop: 3 },
  matchValue: { fontSize: 16, fontWeight: '800', marginTop: 3 },
  matchTrack: { height: 5, borderRadius: 3, overflow: 'hidden', marginTop: 10 },
  matchFill: { height: 5, borderRadius: 3 },
  emptyCard: { alignItems: 'center', paddingVertical: 24 },
  emptyTitle: { fontSize: 15, fontWeight: '700' },
  emptySub: { fontSize: 12, marginTop: 4 },
  optimizerCard: { borderWidth: 2 },
  optimizerHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 },
  optimizerEyebrow: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  optimizerTitle: { fontSize: 18, fontWeight: '800', marginTop: 4 },
  aiBadge: { width: 40, height: 36, borderRadius: 10, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  aiText: { fontSize: 12, fontWeight: '800' },
  optimizerDesc: { fontSize: 13, lineHeight: 19, marginBottom: 4 },
});
