import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import ScreenShell, { Card, PrimaryButton, SectionHeader } from '../../components/ScreenShell';
import { useTheme } from '../../constants/theme';

type WasteStatus = 'LOW' | 'MODERATE' | 'HIGH';
type WasteRecord = { id: string; vessel: string; type: string; waste: string; volume: string; status: WasteStatus; date: string };

const wasteRecords: WasteRecord[] = [
  { id: 'WR-2048', vessel: 'OCEAN TITAN',    type: 'VLCC',    waste: 'Sludge',        volume: '18.4 MT', status: 'LOW',      date: '26 AUG 2026' },
  { id: 'WR-2047', vessel: 'PACIFIC HORIZON', type: 'VLCC',    waste: 'Oily Water',    volume: '31.7 MT', status: 'MODERATE', date: '26 AUG 2026' },
  { id: 'WR-2046', vessel: 'BLUE MERIDIAN',   type: 'SUEZMAX', waste: 'Sludge',        volume: '24.2 MT', status: 'LOW',      date: '25 AUG 2026' },
  { id: 'WR-2045', vessel: 'NORTHSTAR',       type: 'VLCC',    waste: 'Cargo Residue', volume: '47.8 MT', status: 'HIGH',     date: '24 AUG 2026' },
];

export default function Waste() {
  const { colors } = useTheme();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'ALL' | WasteStatus>('ALL');

  const filtered = useMemo(() => wasteRecords.filter(r => {
    const q = search.toLowerCase();
    return (r.vessel.toLowerCase().includes(q) || r.waste.toLowerCase().includes(q) || r.id.toLowerCase().includes(q))
      && (filter === 'ALL' || r.status === filter);
  }), [search, filter]);

  const statusColor = (s: WasteStatus) => s === 'LOW' ? colors.success : s === 'MODERATE' ? colors.warning : colors.danger;

  return (
    <ScreenShell title="Waste Intelligence" subtitle="Maritime waste monitoring and environmental compliance" badge="LIVE" badgeColor={colors.success}>

      {/* Compliance Status */}
      <Card style={[styles.statusCard, { borderColor: colors.success, borderLeftWidth: 5, borderLeftColor: colors.success }]}>
        <View style={[styles.statusIconWrap, { backgroundColor: colors.successBg }]}>
          <View style={[styles.statusIconInner, { borderColor: colors.success }]} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.statusEyebrow, { color: colors.primary }]}>ENVIRONMENTAL STATUS</Text>
          <Text style={[styles.statusTitle, { color: colors.text }]}>Compliance Stable</Text>
          <Text style={[styles.statusDesc, { color: colors.textSecondary }]}>Fleet waste levels remain within monitored operational thresholds.</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={[styles.scoreValue, { color: colors.success }]}>92%</Text>
          <Text style={[styles.scoreLabel, { color: colors.textMuted }]}>COMPLIANT</Text>
        </View>
      </Card>

      {/* Metrics */}
      <SectionHeader eyebrow="Fleet Overview" title="Waste Metrics" right="UPDATED NOW" />
      <View style={styles.metricsRow}>
        {[
          { label: 'TOTAL WASTE', value: '1,284', suffix: 'MT',      alert: false },
          { label: 'PROCESSED',   value: '1,091', suffix: 'MT',      alert: false },
          { label: 'AT RISK',     value: '07',    suffix: 'VESSELS', alert: true  },
        ].map(m => (
          <Card key={m.label} style={styles.metricCard}>
            <Text style={[styles.metricLabel, { color: colors.textMuted }]}>{m.label}</Text>
            <View style={styles.metricValueRow}>
              <Text style={[styles.metricValue, { color: m.alert ? colors.deepAccent : colors.text }]}>{m.value}</Text>
              <Text style={[styles.metricSuffix, { color: colors.textMuted }]}> {m.suffix}</Text>
            </View>
          </Card>
        ))}
      </View>

      {/* Search */}
      <View style={[styles.searchBox, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder }]}>
        <Text style={[styles.searchIcon, { color: colors.primary }]}>⌕</Text>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search vessel, waste type or record"
          placeholderTextColor={colors.placeholder}
          style={[styles.searchInput, { color: colors.inputText }]}
        />
      </View>

      {/* Filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
        {(['ALL RECORDS', 'LOW', 'MODERATE', 'HIGH'] as const).map((f, i) => {
          const key = i === 0 ? 'ALL' : f as WasteStatus;
          const isActive = filter === key;
          return (
            <TouchableOpacity
              key={f}
              onPress={() => setFilter(key)}
              style={[styles.filterBtn, { backgroundColor: isActive ? colors.deepAccent : colors.card, borderColor: isActive ? colors.deepAccent : colors.border }]}
              activeOpacity={0.8}
            >
              <Text style={[styles.filterText, { color: isActive ? '#FFFFFF' : colors.textMuted }]}>{f}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Distribution Chart */}
      <SectionHeader eyebrow="Waste Composition" title="Fleet Distribution" right="1,284 MT" />
      <Card>
        <View style={[styles.distBar, { backgroundColor: colors.divider }]}>
          <View style={[styles.distSegment, { flex: 38, backgroundColor: colors.primary }]} />
          <View style={[styles.distSegment, { flex: 27, backgroundColor: colors.deepAccent }]} />
          <View style={[styles.distSegment, { flex: 21, backgroundColor: colors.success }]} />
          <View style={[styles.distSegment, { flex: 14, backgroundColor: colors.secondary }]} />
        </View>
        <View style={styles.legend}>
          {[
            { label: 'SLUDGE',        value: '38%', color: colors.primary },
            { label: 'OILY WATER',    value: '27%', color: colors.deepAccent },
            { label: 'CARGO RESIDUE', value: '21%', color: colors.success },
            { label: 'OTHER',         value: '14%', color: colors.secondary },
          ].map(l => (
            <View key={l.label} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: l.color }]} />
              <Text style={[styles.legendLabel, { color: colors.textMuted }]}>{l.label}</Text>
              <Text style={[styles.legendValue, { color: colors.text }]}>{l.value}</Text>
            </View>
          ))}
        </View>
      </Card>

      {/* Records */}
      <SectionHeader eyebrow="Monitoring Database" title="Recent Records" right={`${filtered.length} RECORDS`} />
      {filtered.map(record => {
        const sc = statusColor(record.status);
        return (
          <Card key={record.id} style={[styles.wasteCard, { borderLeftWidth: 4, borderLeftColor: sc }]}>
            <View style={styles.wasteTop}>
              <View style={[styles.recordIcon, { backgroundColor: colors.primary + '18' }]}>
                <Text style={{ fontSize: 18 }}>🗂</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.vesselName, { color: colors.text }]}>{record.vessel}</Text>
                <Text style={[styles.vesselType, { color: colors.textMuted }]}>{record.type} • {record.id}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: sc + '18', borderColor: sc }]}>
                <View style={[styles.statusDot, { backgroundColor: sc }]} />
                <Text style={[styles.statusText, { color: sc }]}>{record.status}</Text>
              </View>
            </View>
            <View style={[styles.wasteDetails, { borderTopColor: colors.divider }]}>
              {[
                { l: 'WASTE TYPE', v: record.waste },
                { l: 'VOLUME',     v: record.volume },
                { l: 'DATE',       v: record.date },
              ].map(d => (
                <View key={d.l}>
                  <Text style={[styles.detailLabel, { color: colors.textMuted }]}>{d.l}</Text>
                  <Text style={[styles.detailValue, { color: colors.text }]}>{d.v}</Text>
                </View>
              ))}
            </View>
          </Card>
        );
      })}

      {filtered.length === 0 && (
        <Card style={styles.emptyCard}>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>No records found</Text>
          <Text style={[styles.emptySub, { color: colors.textMuted }]}>Try another vessel, waste type or status.</Text>
        </Card>
      )}

      {/* AI Insight */}
      <SectionHeader eyebrow="AI Environmental Insight" title="Waste Risk Projection" />
      <Card accent>
        <View style={styles.insightHeader}>
          <View style={[styles.aiBadge, { backgroundColor: colors.deepAccent }]}>
            <Text style={styles.aiBadgeText}>AI</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.insightEyebrow, { color: colors.primary }]}>AI ENVIRONMENTAL INSIGHT</Text>
            <Text style={[styles.insightTitle, { color: colors.text }]}>Waste Risk Projection</Text>
          </View>
        </View>
        <Text style={[styles.insightText, { color: colors.textSecondary }]}>
          Current fleet patterns indicate a stable waste profile. Increased monitoring is recommended for high-volume cargo residue operations.
        </Text>
        <View style={[styles.insightStats, { borderTopColor: colors.divider }]}>
          {[
            { l: '7-DAY TREND', v: '↓ 4.8%', color: colors.success },
            { l: 'RISK LEVEL',  v: 'MODERATE', color: colors.warning },
            { l: 'CONFIDENCE',  v: '91.3%',  color: colors.deepAccent },
          ].map(s => (
            <View key={s.l}>
              <Text style={[styles.statLabel, { color: colors.textMuted }]}>{s.l}</Text>
              <Text style={[styles.statValue, { color: s.color }]}>{s.v}</Text>
            </View>
          ))}
        </View>
      </Card>

      <PrimaryButton label="GENERATE WASTE REPORT →" onPress={() => {}} icon="file-text" />

    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  statusCard: { flexDirection: 'row', alignItems: 'center', gap: 14, borderRadius: 18, overflow: 'hidden' },
  statusIconWrap: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  statusIconInner: { width: 20, height: 20, borderRadius: 10, borderWidth: 3 },
  statusEyebrow: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  statusTitle: { fontSize: 15, fontWeight: '800', marginTop: 3 },
  statusDesc: { fontSize: 12, lineHeight: 18, marginTop: 2 },
  scoreValue: { fontSize: 22, fontWeight: '800' },
  scoreLabel: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase', marginTop: 2 },
  metricsRow: { flexDirection: 'row', gap: 10 },
  metricCard: { flex: 1, paddingVertical: 14 },
  metricLabel: { fontSize: 9, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  metricValueRow: { flexDirection: 'row', alignItems: 'flex-end', marginTop: 10 },
  metricValue: { fontSize: 20, fontWeight: '800' },
  metricSuffix: { fontSize: 10, marginBottom: 2 },
  searchBox: { flexDirection: 'row', alignItems: 'center', height: 48, borderRadius: 12, borderWidth: 1.5, paddingHorizontal: 14, marginBottom: 4 },
  searchIcon: { fontSize: 20, marginRight: 8 },
  searchInput: { flex: 1, fontSize: 13, fontWeight: '600' },
  filters: { gap: 8, paddingVertical: 10 },
  filterBtn: { height: 34, paddingHorizontal: 14, borderRadius: 17, borderWidth: 1, justifyContent: 'center' },
  filterText: { fontSize: 12, fontWeight: '700' },
  distBar: { height: 14, borderRadius: 7, overflow: 'hidden', flexDirection: 'row', marginBottom: 14 },
  distSegment: { height: 14 },
  legend: { flexDirection: 'row', flexWrap: 'wrap', rowGap: 10 },
  legendItem: { width: '50%', flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendLabel: { flex: 1, fontSize: 10, fontWeight: '600' },
  legendValue: { fontSize: 12, fontWeight: '700' },
  wasteCard: { marginBottom: 10, borderRadius: 16, overflow: 'hidden' },
  wasteTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  recordIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  vesselName: { fontSize: 14, fontWeight: '700' },
  vesselType: { fontSize: 11, marginTop: 2 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 8, paddingVertical: 5, borderRadius: 20, borderWidth: 1 },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 10, fontWeight: '700' },
  wasteDetails: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12, paddingTop: 12, borderTopWidth: 1 },
  detailLabel: { fontSize: 9, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  detailValue: { fontSize: 13, fontWeight: '700', marginTop: 3 },
  emptyCard: { alignItems: 'center', paddingVertical: 24 },
  emptyTitle: { fontSize: 15, fontWeight: '700' },
  emptySub: { fontSize: 12, marginTop: 4 },
  insightHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  aiBadge: { width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  aiBadgeText: { color: '#FFFFFF', fontSize: 13, fontWeight: '800' },
  insightEyebrow: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  insightTitle: { fontSize: 16, fontWeight: '800', marginTop: 2 },
  insightText: { fontSize: 13, lineHeight: 20, marginBottom: 14 },
  insightStats: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 14, borderTopWidth: 1 },
  statLabel: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  statValue: { fontSize: 14, fontWeight: '800', marginTop: 4 },
});
