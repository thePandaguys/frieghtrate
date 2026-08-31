import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import ScreenShell, { Card, SectionHeader } from '../../components/ScreenShell';
import { useTheme } from '../../constants/theme';

type VesselStatus = 'AVAILABLE' | 'UNDERWAY' | 'CHARTERED' | 'DISCHARGING';

type BulkCarrier = {
  id: string;
  name: string;
  imo: string;
  vesselClass: 'Capesize' | 'Panamax' | 'Supramax' | 'Handysize';
  dwt: number;
  draftM: number;
  loaM: number;
  currentCorridor: string;
  status: VesselStatus;
  suitabilityScore: number;
  eta: string;
  compatibleEastPorts: string[];
};

const fleet: BulkCarrier[] = [
  {
    id: 'v1',
    name: 'MV Samudra Ratna',
    imo: 'IMO 9482711',
    vesselClass: 'Capesize',
    dwt: 180000,
    draftM: 18.2,
    loaM: 292,
    currentCorridor: 'Gladstone → Gangavaram',
    status: 'UNDERWAY',
    suitabilityScore: 96.4,
    eta: 'ETA 5.2 days',
    compatibleEastPorts: ['Gangavaram', 'Visakhapatnam', 'Dhamra'],
  },
  {
    id: 'v2',
    name: 'MV Sagar Kanti',
    imo: 'IMO 9314820',
    vesselClass: 'Panamax',
    dwt: 75000,
    draftM: 14.1,
    loaM: 225,
    currentCorridor: 'Samarinda → Paradip',
    status: 'AVAILABLE',
    suitabilityScore: 94.1,
    eta: 'Open in Singapore (Immediate)',
    compatibleEastPorts: ['Paradip', 'Visakhapatnam', 'Dhamra', 'Gopalpur', 'Sandheads'],
  },
  {
    id: 'v3',
    name: 'MV Steel Pioneer',
    imo: 'IMO 9720194',
    vesselClass: 'Capesize',
    dwt: 175000,
    draftM: 17.8,
    loaM: 289,
    currentCorridor: 'Norfolk → Dhamra',
    status: 'UNDERWAY',
    suitabilityScore: 91.8,
    eta: 'ETA 12.6 days',
    compatibleEastPorts: ['Dhamra', 'Gangavaram', 'Visakhapatnam'],
  },
  {
    id: 'v4',
    name: 'MV Utkal Star',
    imo: 'IMO 9651034',
    vesselClass: 'Supramax',
    dwt: 58000,
    draftM: 12.8,
    loaM: 190,
    currentCorridor: 'Maputo → Gopalpur',
    status: 'DISCHARGING',
    suitabilityScore: 89.5,
    eta: 'Discharging at Gopalpur Berth 2',
    compatibleEastPorts: ['Gopalpur', 'Paradip', 'Visakhapatnam', 'Dhamra', 'Haldia (Lightened)'],
  },
  {
    id: 'v5',
    name: 'MV Bengal Express',
    imo: 'IMO 9284719',
    vesselClass: 'Handysize',
    dwt: 35000,
    draftM: 8.4,
    loaM: 178,
    currentCorridor: 'Taboneo → Haldia Dock Complex',
    status: 'AVAILABLE',
    suitabilityScore: 95.0,
    eta: 'Open at Sandheads (Immediate)',
    compatibleEastPorts: ['Haldia Dock Complex', 'All East Coast Ports'],
  },
];

export default function Vessels() {
  const { colors } = useTheme();
  const [search, setSearch] = useState('');
  const [filterClass, setFilterClass] = useState<string>('ALL');

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return fleet.filter(v => {
      const matchSearch =
        v.name.toLowerCase().includes(q) ||
        v.vesselClass.toLowerCase().includes(q) ||
        v.currentCorridor.toLowerCase().includes(q);
      const matchFilter = filterClass === 'ALL' || v.vesselClass === filterClass;
      return matchSearch && matchFilter;
    });
  }, [search, filterClass]);

  const getStatusColor = (s: VesselStatus) => {
    switch (s) {
      case 'AVAILABLE':
        return colors.success;
      case 'UNDERWAY':
        return colors.primary;
      case 'DISCHARGING':
        return colors.accent;
      default:
        return colors.textMuted;
    }
  };

  return (
    <ScreenShell
      title="Fleet Intelligence & Vessel Allocation"
      subtitle="Optimized dry bulk carriers matched against East Coast India draft & LOA restrictions (SIH 26006)"
      breadcrumb="Vessel Optimizer"
      badge="FLEET RADAR"
      badgeColor={colors.success}
    >
      {/* Fleet Summary Header */}
      <Animated.View entering={FadeInDown.duration(400)}>
        <Card style={[styles.summaryCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.summaryLeft}>
            <Text style={[styles.summaryLabel, { color: colors.textMuted }]}>MONITORED BULK CARRIER POOL</Text>
            <Text style={[styles.summaryValue, { color: colors.text }]}>148 Vessels</Text>
            <Text style={[styles.summarySub, { color: colors.textSecondary }]}>
              Capesize, Panamax, Supramax & Handysize on Indian ore & coal routes
            </Text>
          </View>

          <View style={styles.summaryRight}>
            <View style={[styles.metricChip, { backgroundColor: colors.cardAlt, borderColor: colors.border }]}>
              <Text style={[styles.metricChipLabel, { color: colors.textMuted }]}>OPEN / AVAILABLE</Text>
              <Text style={[styles.metricChipVal, { color: colors.success }]}>38</Text>
            </View>
            <View style={[styles.metricChip, { backgroundColor: colors.cardAlt, borderColor: colors.border }]}>
              <Text style={[styles.metricChipLabel, { color: colors.textMuted }]}>LADEN UNDERWAY</Text>
              <Text style={[styles.metricChipVal, { color: colors.primary }]}>92</Text>
            </View>
          </View>
        </Card>
      </Animated.View>

      {/* Search & Filter Bar */}
      <View style={styles.controlsRow}>
        <View style={[styles.searchWrap, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
          <Feather name="search" size={14} color={colors.primary} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search by vessel name, class, corridor..."
            placeholderTextColor={colors.placeholder}
            style={[styles.searchInput, { color: colors.inputText }]}
          />
        </View>

        <View style={styles.filterPills}>
          {['ALL', 'Capesize', 'Panamax', 'Supramax', 'Handysize'].map(c => (
            <Pressable
              key={c}
              onPress={() => setFilterClass(c)}
              style={[
                styles.filterBtn,
                {
                  backgroundColor: filterClass === c ? colors.deepAccent : colors.cardAlt,
                  borderColor: filterClass === c ? colors.accent : colors.border,
                },
              ]}
            >
              <Text style={[styles.filterBtnText, { color: filterClass === c ? '#FFFFFF' : colors.textMuted }]}>
                {c.toUpperCase()}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Vessel List */}
      <SectionHeader eyebrow="Vessel Allocation" title="Dry Bulk Fleet Candidates" right="SIH 26006" />
      {filtered.map((v, i) => {
        const sColor = getStatusColor(v.status);
        return (
          <Animated.View key={v.id} entering={FadeInDown.delay(100 + i * 70).duration(400)}>
            <Card style={[styles.vesselCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              {/* Header */}
              <View style={styles.vesselHeader}>
                <View style={styles.vesselTitleWrap}>
                  <View style={[styles.vesselIconBox, { backgroundColor: colors.cardAlt, borderColor: colors.border }]}>
                    <MaterialCommunityIcons name="ferry" size={20} color={colors.accent} />
                  </View>
                  <View>
                    <View style={styles.nameRow}>
                      <Text style={[styles.vesselName, { color: colors.text }]}>{v.name}</Text>
                      <Text style={[styles.vesselImo, { color: colors.textMuted }]}>({v.imo})</Text>
                    </View>
                    <Text style={[styles.vesselClass, { color: colors.primary }]}>
                      {v.vesselClass} • {v.dwt.toLocaleString()} DWT • Max Draft: {v.draftM}m • LOA: {v.loaM}m
                    </Text>
                  </View>
                </View>

                <View style={[styles.statusPill, { backgroundColor: sColor + '18', borderColor: sColor }]}>
                  <View style={[styles.statusDot, { backgroundColor: sColor }]} />
                  <Text style={[styles.statusPillText, { color: sColor }]}>{v.status}</Text>
                </View>
              </View>

              {/* Corridor & ETA */}
              <View style={[styles.corridorStrip, { backgroundColor: colors.cardAlt, borderColor: colors.border }]}>
                <View style={styles.corridorCol}>
                  <Text style={[styles.corridorMeta, { color: colors.textMuted }]}>CURRENT CORRIDOR</Text>
                  <Text style={[styles.corridorVal, { color: colors.text }]}>{v.currentCorridor}</Text>
                </View>
                <View style={styles.corridorCol}>
                  <Text style={[styles.corridorMeta, { color: colors.textMuted }]}>DEPLOYMENT STATUS / ETA</Text>
                  <Text style={[styles.corridorVal, { color: colors.accent }]}>{v.eta}</Text>
                </View>
                <View style={styles.corridorCol}>
                  <Text style={[styles.corridorMeta, { color: colors.textMuted }]}>AI SUITABILITY SCORE</Text>
                  <Text style={[styles.corridorVal, { color: colors.success }]}>{v.suitabilityScore}%</Text>
                </View>
              </View>

              {/* Port Compatibility Badges */}
              <View style={styles.portCompRow}>
                <Text style={[styles.portCompLabel, { color: colors.textMuted }]}>COMPATIBLE EAST COAST PORTS:</Text>
                <View style={styles.portTagsWrap}>
                  {v.compatibleEastPorts.map(p => (
                    <View key={p} style={[styles.portTag, { backgroundColor: colors.backgroundAlt, borderColor: colors.border }]}>
                      <Text style={[styles.portTagText, { color: colors.textSecondary }]}>{p}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </Card>
          </Animated.View>
        );
      })}

      {filtered.length === 0 && (
        <Card style={[styles.emptyCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>No matching bulk carriers found</Text>
          <Text style={[styles.emptySub, { color: colors.textSecondary }]}>Try changing your search or vessel class filter.</Text>
        </Card>
      )}

      {/* AI Optimizer CTA */}
      <Animated.View entering={FadeInDown.delay(600).duration(500)}>
        <Card style={[styles.optimizerCard, { backgroundColor: colors.cardAlt, borderColor: colors.primary }]}>
          <View style={styles.optimizerHeader}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.optimizerEyebrow, { color: colors.primary }]}>AI VESSEL & PARCEL OPTIMIZATION</Text>
              <Text style={[styles.optimizerTitle, { color: colors.text }]}>Automate Charter Allocation</Text>
            </View>
            <View style={[styles.aiBadge, { backgroundColor: colors.primary + '18', borderColor: colors.primary }]}>
              <Feather name="cpu" size={16} color={colors.primary} />
            </View>
          </View>
          <Text style={[styles.optimizerDesc, { color: colors.textSecondary }]}>
            Evaluate draft restriction thresholds, LOA limits, and demurrage avoidance strategies for Ministry of Steel / SAIL voyages.
          </Text>
          <Pressable
            style={[styles.optimizerBtn, { backgroundColor: colors.accent }]}
            onPress={() => router.push('/(main)/optimizer')}
          >
            <Text style={styles.optimizerBtnText}>RUN INTELLIGENT ALLOCATION ENGINE</Text>
            <Feather name="arrow-right" size={16} color="#FFFFFF" />
          </Pressable>
        </Card>
      </Animated.View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  summaryCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 16,
    padding: 18,
  },
  summaryLeft: {
    flex: 1,
    minWidth: 240,
  },
  summaryLabel: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: '900',
    marginTop: 4,
    letterSpacing: -0.4,
  },
  summarySub: {
    fontSize: 11,
    marginTop: 2,
  },
  summaryRight: {
    flexDirection: 'row',
    gap: 10,
  },
  metricChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    minWidth: 110,
  },
  metricChipLabel: {
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  metricChipVal: {
    fontSize: 18,
    fontWeight: '900',
    marginTop: 2,
  },
  controlsRow: {
    marginTop: 14,
    marginBottom: 8,
    gap: 10,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 44,
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
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  filterBtnText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  vesselCard: {
    marginBottom: 12,
    padding: 16,
  },
  vesselHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: 12,
  },
  vesselTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    minWidth: 260,
  },
  vesselIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  vesselName: {
    fontSize: 15,
    fontWeight: '800',
  },
  vesselImo: {
    fontSize: 11,
    fontWeight: '600',
  },
  vesselClass: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusPillText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  corridorStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 12,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 12,
  },
  corridorCol: {
    minWidth: 140,
  },
  corridorMeta: {
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  corridorVal: {
    fontSize: 12,
    fontWeight: '800',
    marginTop: 2,
  },
  portCompRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(35, 70, 91, 0.3)',
  },
  portCompLabel: {
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  portTagsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  portTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
  },
  portTagText: {
    fontSize: 9,
    fontWeight: '700',
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: 28,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  emptySub: {
    fontSize: 12,
    marginTop: 4,
  },
  optimizerCard: {
    padding: 18,
    marginTop: 14,
  },
  optimizerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  optimizerEyebrow: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  optimizerTitle: {
    fontSize: 18,
    fontWeight: '900',
    marginTop: 2,
  },
  aiBadge: {
    width: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optimizerDesc: {
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 14,
  },
  optimizerBtn: {
    height: 48,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  optimizerBtnText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.8,
  },
});
