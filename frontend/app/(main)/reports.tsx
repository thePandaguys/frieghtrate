import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import ScreenShell, { Card, PrimaryButton, SectionHeader } from '../../components/ScreenShell';
import { useTheme } from '../../constants/theme';

type ReportType = 'VOYAGE' | 'FORECAST' | 'RISK' | 'CHARTER';

type Report = {
  id: string;
  title: string;
  type: ReportType;
  date: string;
  description: string;
  status: 'READY' | 'PROCESSING';
  savingsEst: string;
};

const reports: Report[] = [
  {
    id: 'RPT-26006-01',
    title: 'Gladstone → Paradip Bulk Charter Optimization',
    type: 'VOYAGE',
    date: '31 AUG 2026',
    description: 'Capesize vs Panamax financial feasibility and demurrage prevention report for SAIL procurement.',
    status: 'READY',
    savingsEst: '$345,000',
  },
  {
    id: 'RPT-26006-02',
    title: '40-Day Forward Freight Curve Analysis',
    type: 'FORECAST',
    date: '30 AUG 2026',
    description: 'Multi-horizon AI rate trajectory covering Australia, Indonesia, and Mozambique loading origins.',
    status: 'READY',
    savingsEst: '+8.4% Accuracy',
  },
  {
    id: 'RPT-26006-03',
    title: 'East Coast Discharge Port Draft & Tide Constraints',
    type: 'RISK',
    date: '29 AUG 2026',
    description: 'Comprehensive LOA, lock gate timing, and Sandheads lightening audit for Haldia & Vizag berths.',
    status: 'READY',
    savingsEst: 'Zero Demurrage Risk',
  },
  {
    id: 'RPT-26006-04',
    title: 'Phased Multi-Voyage Charter Allocation Strategy',
    type: 'CHARTER',
    date: '28 AUG 2026',
    description: 'Contract of Affreightment (COA) multi-parcel evaluation for Ministry of Steel quarterly intake.',
    status: 'READY',
    savingsEst: '$1.2M Contract Value',
  },
];

export default function Reports() {
  const { colors } = useTheme();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'ALL' | ReportType>('ALL');

  const filtered = useMemo(
    () =>
      reports.filter(r => {
        const q = search.toLowerCase().trim();
        const matchesQuery =
          r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.id.toLowerCase().includes(q);
        const matchesFilter = filter === 'ALL' || r.type === filter;
        return matchesQuery && matchesFilter;
      }),
    [search, filter]
  );

  const getTypeStyle = (t: ReportType) => {
    switch (t) {
      case 'VOYAGE':
        return { color: colors.accent, icon: 'compass' };
      case 'FORECAST':
        return { color: colors.success, icon: 'trending-up' };
      case 'RISK':
        return { color: colors.danger, icon: 'shield-alert' };
      case 'CHARTER':
        return { color: colors.primary, icon: 'file-text' };
    }
  };

  return (
    <ScreenShell
      title="Procurement & Intelligence Reports"
      subtitle="Executive chartering summaries, audit records, and exportable data dossiers (SIH 26006)"
      breadcrumb="Reports"
      badge="AUDIT LOGS"
      badgeColor={colors.success}
    >
      {/* Top Metric Strip */}
      <View style={styles.metricsRow}>
        {[
          { l: 'TOTAL GENERATED REPORTS', v: '48' },
          { l: 'PROCUREMENT AUDITS READY', v: '42' },
          { l: 'ESTIMATED ACCUMULATED SAVINGS', v: '$4.2M', highlight: true },
        ].map(m => (
          <Card key={m.l} style={[styles.metricCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.metricLabel, { color: colors.textMuted }]}>{m.l}</Text>
            <Text style={[styles.metricValue, { color: m.highlight ? colors.success : colors.text }]}>{m.v}</Text>
          </Card>
        ))}
      </View>

      {/* Search & Filter */}
      <View style={styles.controlsRow}>
        <View style={[styles.searchWrap, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
          <Feather name="search" size={14} color={colors.primary} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search report dossier or ID..."
            placeholderTextColor={colors.placeholder}
            style={[styles.searchInput, { color: colors.inputText }]}
          />
        </View>

        <View style={styles.filterPills}>
          {['ALL', 'VOYAGE', 'FORECAST', 'RISK', 'CHARTER'].map(f => (
            <Pressable
              key={f}
              onPress={() => setFilter(f as any)}
              style={[
                styles.filterBtn,
                {
                  backgroundColor: filter === f ? colors.primary : colors.cardAlt,
                  borderColor: filter === f ? colors.primary : colors.border,
                },
              ]}
            >
              <Text style={[styles.filterBtnText, { color: filter === f ? '#FFFFFF' : colors.textMuted }]}>{f}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Reports List */}
      <SectionHeader eyebrow="Intelligence Dossiers" title="Generated Maritime Reports" right={`${filtered.length} READY`} />

      {filtered.map(r => {
        const typeStyle = getTypeStyle(r.type);
        return (
          <Card key={r.id} style={[styles.reportCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.reportTop}>
              <View style={[styles.reportIcon, { backgroundColor: typeStyle.color + '18', borderColor: typeStyle.color }]}>
                <Feather name={typeStyle.icon as any} size={18} color={typeStyle.color} />
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.titleRow}>
                  <Text style={[styles.reportTitle, { color: colors.text }]}>{r.title}</Text>
                  <View style={[styles.typeBadge, { backgroundColor: typeStyle.color + '15', borderColor: typeStyle.color }]}>
                    <Text style={[styles.typeText, { color: typeStyle.color }]}>{r.type}</Text>
                  </View>
                </View>
                <Text style={[styles.reportDesc, { color: colors.textSecondary }]}>{r.description}</Text>
              </View>
            </View>

            <View style={[styles.reportDivider, { backgroundColor: colors.divider }]} />

            <View style={styles.reportBottom}>
              <View>
                <Text style={[styles.metaLabel, { color: colors.textMuted }]}>REPORT DOSSIER ID</Text>
                <Text style={[styles.metaValue, { color: colors.text }]}>{r.id}</Text>
              </View>
              <View>
                <Text style={[styles.metaLabel, { color: colors.textMuted }]}>GENERATED TIMESTAMP</Text>
                <Text style={[styles.metaValue, { color: colors.text }]}>{r.date}</Text>
              </View>
              <View>
                <Text style={[styles.metaLabel, { color: colors.textMuted }]}>ESTIMATED IMPACT</Text>
                <Text style={[styles.metaValue, { color: colors.success }]}>{r.savingsEst}</Text>
              </View>
              <View style={styles.readyWrap}>
                <View style={[styles.readyDot, { backgroundColor: colors.success }]} />
                <Text style={[styles.readyText, { color: colors.success }]}>{r.status}</Text>
              </View>
            </View>
          </Card>
        );
      })}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  metricsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 8,
  },
  metricCard: {
    flex: 1,
    minWidth: 180,
    padding: 14,
  },
  metricLabel: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  metricValue: {
    fontSize: 22,
    fontWeight: '900',
    marginTop: 4,
  },
  controlsRow: {
    marginTop: 8,
    marginBottom: 8,
    gap: 10,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 42,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    outlineStyle: 'none',
  },
  filterPills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  filterBtn: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
  },
  filterBtnText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  reportCard: {
    marginBottom: 12,
    padding: 16,
  },
  reportTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  reportIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  reportTitle: {
    fontSize: 14,
    fontWeight: '800',
    flex: 1,
  },
  typeBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
  },
  typeText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  reportDesc: {
    fontSize: 11,
    lineHeight: 16,
    marginTop: 4,
  },
  reportDivider: {
    height: 1,
    marginVertical: 12,
  },
  reportBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
  },
  metaLabel: {
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  metaValue: {
    fontSize: 11,
    fontWeight: '800',
    marginTop: 2,
  },
  readyWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  readyDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  readyText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
