import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import ScreenShell, { Card, SectionHeader } from '../../components/ScreenShell';
import { useTheme } from '../../constants/theme';

export default function RoutesScreen() {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const [selectedCorridor, setSelectedCorridor] = useState<string | null>(null);

  const corridors = [
    {
      id: 'c1',
      origin: 'Gladstone (AUGLT)',
      destination: 'Paradip (INPRT)',
      region: 'Australia → East Coast India',
      cargo: 'Coking Coal',
      vesselClass: 'Capesize (180K DWT)',
      demand: 'VERY HIGH',
      demandColor: colors.danger,
      volume: '75,000 MT',
      distance: '5,620 NM',
      time: '18d 04h',
      status: 'On Schedule',
      statusColor: colors.success,
      maxDraft: '16.0m (Paradip Max)',
      weather: 'Calm Sea (Beaufort 3)',
      idleRisk: 'Low',
    },
    {
      id: 'c2',
      origin: 'Samarinda (IDSRI)',
      destination: 'Visakhapatnam (INVTZ)',
      region: 'Indonesia → East Coast India',
      cargo: 'Thermal Coal',
      vesselClass: 'Panamax (75K DWT)',
      demand: 'HIGH',
      demandColor: colors.accent,
      volume: '65,000 MT',
      distance: '2,840 NM',
      time: '09d 12h',
      status: 'Berth Congestion +18h',
      statusColor: colors.warning,
      maxDraft: '18.1m (Vizag Max)',
      weather: 'Squall Watch Malacca',
      idleRisk: 'Medium',
    },
    {
      id: 'c3',
      origin: 'Maputo (MZMPM)',
      destination: 'Gangavaram (INGGV)',
      region: 'Mozambique → East Coast India',
      cargo: 'PCI Coal / Anthracite',
      vesselClass: 'Capesize (180K DWT)',
      demand: 'MEDIUM',
      demandColor: colors.primary,
      volume: '150,000 MT',
      distance: '4,180 NM',
      time: '14d 18h',
      status: 'On Schedule',
      statusColor: colors.success,
      maxDraft: '20.0m (Gangavaram Deep)',
      weather: 'Equatorial Calm',
      idleRisk: 'Low',
    },
    {
      id: 'c4',
      origin: 'Norfolk (USORF)',
      destination: 'Dhamra (INDHM)',
      region: 'US East Coast → East Coast India',
      cargo: 'Met Coal (High Volatile)',
      vesselClass: 'Capesize via Cape',
      demand: 'HIGH',
      demandColor: colors.accent,
      volume: '160,000 MT',
      distance: '11,480 NM',
      time: '34d 06h',
      status: 'On Schedule',
      statusColor: colors.success,
      maxDraft: '18.5m (Dhamra Max)',
      weather: 'Roaring 40s Cape Swell',
      idleRisk: 'Low',
    },
    {
      id: 'c5',
      origin: 'Taboneo (IDBDJ)',
      destination: 'Haldia Dock Complex (INHAL)',
      region: 'Indonesia → East Coast India',
      cargo: 'Industrial Coal',
      vesselClass: 'Handysize (35K DWT)',
      demand: 'MEDIUM',
      demandColor: colors.primary,
      volume: '30,000 MT',
      distance: '2,420 NM',
      time: '08d 02h',
      status: 'Draft Constrained (8.5m)',
      statusColor: colors.warning,
      maxDraft: '8.5m (Haldia River Lock)',
      weather: 'Monsoon Swell',
      idleRisk: 'Elevated',
    },
  ];

  return (
    <ScreenShell
      title="Freight Corridors & Trade Lanes"
      subtitle="Overseas Bulk Loading Ports to East Coast of India (Ministry of Steel / SAIL SIH 26006)"
      breadcrumb="Freight Routes"
      badge="AIS ACTIVE"
      badgeColor={colors.success}
    >
      {/* Network Status Strip */}
      <Animated.View entering={FadeInDown.duration(400)}>
        <Card style={[styles.statusCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.statusLeft}>
            <View style={[styles.liveDotWrap, { backgroundColor: colors.success + '20' }]}>
              <View style={[styles.liveDot, { backgroundColor: colors.success }]} />
            </View>
            <View>
              <Text style={[styles.statusTitle, { color: colors.text }]}>East Coast Maritime Corridor Operational</Text>
              <Text style={[styles.statusSub, { color: colors.textSecondary }]}>
                12 overseas origins • 7 discharge ports monitored in real-time
              </Text>
            </View>
          </View>
          <View style={[styles.statusBadgeWrap, { backgroundColor: colors.success + '15', borderColor: colors.success }]}>
            <Feather name="check-circle" size={14} color={colors.success} />
            <Text style={[styles.statusPct, { color: colors.success }]}>96.4% ON SCHEDULE</Text>
          </View>
        </Card>
      </Animated.View>

      {/* Summary KPI Grid (Zero Emojis, Institutional Vector Icons) */}
      <SectionHeader eyebrow="Network Telemetry" title="Strategic Route Overview" />
      <View style={styles.summaryGrid}>
        {[
          { icon: 'git-branch', iconSet: 'F', value: '19', label: 'Active Corridors', color: colors.primary },
          { icon: 'shield-check', iconSet: 'M', value: '96.4%', label: 'Schedule Adherence', color: colors.success },
          { icon: 'clock', iconSet: 'F', value: '2', label: 'Congestion Alerts', color: colors.warning },
          { icon: 'anchor', iconSet: 'F', value: '7', label: 'East Coast Discharge Ports', color: colors.accent },
        ].map((s, i) => (
          <Animated.View key={s.label} entering={FadeInDown.delay(i * 80).duration(400)} style={styles.summaryCol}>
            <Card style={[styles.summaryCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={[styles.iconBox, { backgroundColor: colors.cardAlt, borderColor: colors.border }]}>
                {s.iconSet === 'F' ? (
                  <Feather name={s.icon as any} size={18} color={s.color} />
                ) : (
                  <MaterialCommunityIcons name={s.icon as any} size={20} color={s.color} />
                )}
              </View>
              <Text style={[styles.summaryValue, { color: colors.text }]}>{s.value}</Text>
              <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>{s.label}</Text>
            </Card>
          </Animated.View>
        ))}
      </View>

      {/* Active Corridors */}
      <SectionHeader eyebrow="Live Marine Corridors" title="Overseas Procurement Corridors" right="SIH 26006" />
      {corridors.map((r, i) => (
        <Animated.View key={r.id} entering={FadeInDown.delay(200 + i * 80).duration(500)}>
          <Card style={[styles.routeCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            {/* Header: Origin -> Destination */}
            <View style={styles.routeHeader}>
              <View style={styles.locationWrap}>
                <View style={[styles.locationDot, { backgroundColor: colors.accent }]} />
                <View>
                  <Text style={[styles.locationLabel, { color: colors.textMuted }]}>LOADING PORT (OVERSEAS)</Text>
                  <Text style={[styles.location, { color: colors.text }]}>{r.origin}</Text>
                </View>
              </View>

              <View style={styles.arrowWrap}>
                <Feather name="arrow-right" size={18} color={colors.primary} />
                <Text style={[styles.regionTag, { color: colors.textMuted }]}>{r.region}</Text>
              </View>

              <View style={styles.locationWrap}>
                <View style={[styles.locationDot, { backgroundColor: colors.success }]} />
                <View>
                  <Text style={[styles.locationLabel, { color: colors.textMuted }]}>DISCHARGE (EAST COAST INDIA)</Text>
                  <Text style={[styles.location, { color: colors.text }]}>{r.destination}</Text>
                </View>
              </View>
            </View>

            {/* Subrow: Cargo, Vessel, Demand */}
            <View style={styles.metaRow}>
              <View style={[styles.metaChip, { backgroundColor: colors.cardAlt, borderColor: colors.border }]}>
                <Text style={[styles.metaChipLabel, { color: colors.textMuted }]}>CARGO:</Text>
                <Text style={[styles.metaChipVal, { color: colors.text }]}>{r.cargo}</Text>
              </View>
              <View style={[styles.metaChip, { backgroundColor: colors.cardAlt, borderColor: colors.border }]}>
                <Text style={[styles.metaChipLabel, { color: colors.textMuted }]}>VESSEL:</Text>
                <Text style={[styles.metaChipVal, { color: colors.primary }]}>{r.vesselClass}</Text>
              </View>
              <View style={[styles.metaChip, { backgroundColor: r.demandColor + '18', borderColor: r.demandColor + '40' }]}>
                <Text style={[styles.metaChipLabel, { color: r.demandColor }]}>DEMAND:</Text>
                <Text style={[styles.metaChipVal, { color: r.demandColor }]}>{r.demand}</Text>
              </View>
            </View>

            {/* Route Numerical Metrics */}
            <View style={[styles.detailsRow, { borderTopColor: colors.divider }]}>
              {[
                { l: 'PARCEL VOLUME', v: r.volume },
                { l: 'SAILING DISTANCE', v: r.distance },
                { l: 'ESTIMATED TRANSIT', v: r.time },
                { l: 'DRAFT RESTRICTION', v: r.maxDraft },
              ].map(d => (
                <View key={d.l} style={styles.detailCol}>
                  <Text style={[styles.detailLabel, { color: colors.textMuted }]}>{d.l}</Text>
                  <Text style={[styles.detailValue, { color: colors.text }]}>{d.v}</Text>
                </View>
              ))}
            </View>

            {/* Footer Status Bar */}
            <View style={[styles.routeFooter, { borderTopColor: colors.divider }]}>
              <View style={styles.footerLeft}>
                <View style={[styles.scheduleDot, { backgroundColor: r.statusColor }]} />
                <Text style={[styles.scheduleText, { color: r.statusColor }]}>{r.status}</Text>
              </View>
              <Text style={[styles.weatherText, { color: colors.textMuted }]}>{r.weather}</Text>
              <Pressable
                onPress={() => router.push('/(main)/dashboard')}
                style={[styles.inspectBtn, { backgroundColor: colors.cardAlt, borderColor: colors.border }]}
              >
                <Text style={[styles.inspectBtnText, { color: colors.primary }]}>View on GIS Map</Text>
                <Feather name="external-link" size={11} color={colors.primary} />
              </Pressable>
            </View>
          </Card>
        </Animated.View>
      ))}

      {/* Institutional Recommendation & CTA */}
      <Animated.View entering={FadeInDown.delay(800).duration(500)}>
        <Card style={[styles.alertCard, { backgroundColor: colors.cardAlt, borderColor: colors.primary }]}>
          <View style={[styles.alertIcon, { backgroundColor: colors.primary + '20' }]}>
            <Feather name="cpu" size={20} color={colors.primary} />
          </View>
          <View style={{ flex: 1, marginLeft: 14 }}>
            <Text style={[styles.alertTitle, { color: colors.text }]}>AI Optimization Recommended</Text>
            <Text style={[styles.alertText, { color: colors.textSecondary }]}>
              Vessel allocation model suggests Panamax consolidation on Samarinda → Paradip corridor to reduce demurrage exposure.
            </Text>
          </View>
        </Card>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(900).duration(500)}>
        <Pressable
          style={[styles.forecastBtn, { backgroundColor: colors.accent }]}
          onPress={() => router.push('/(main)/forecast')}
        >
          <Text style={styles.forecastBtnText}>LAUNCH MULTI-HORIZON FREIGHT FORECAST</Text>
          <Feather name="arrow-right" size={16} color="#FFFFFF" />
        </Pressable>
      </Animated.View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  statusCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
    padding: 16,
  },
  statusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  liveDotWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  liveDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  statusTitle: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  statusSub: {
    fontSize: 11,
    marginTop: 2,
  },
  statusBadgeWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  statusPct: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 8,
  },
  summaryCol: {
    flex: 1,
    minWidth: 160,
  },
  summaryCard: {
    padding: 14,
    minHeight: 110,
    justifyContent: 'space-between',
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 22,
    fontWeight: '800',
    marginTop: 8,
    letterSpacing: -0.5,
  },
  summaryLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  routeCard: {
    marginBottom: 14,
    padding: 16,
  },
  routeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 12,
  },
  locationWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minWidth: 180,
  },
  locationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  locationLabel: {
    fontSize: 9,
    letterSpacing: 0.8,
    fontWeight: '700',
  },
  location: {
    fontSize: 14,
    fontWeight: '800',
    marginTop: 2,
  },
  arrowWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  regionTag: {
    fontSize: 9,
    fontWeight: '600',
    marginTop: 2,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
  },
  metaChipLabel: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  metaChipVal: {
    fontSize: 11,
    fontWeight: '700',
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
  },
  detailCol: {
    minWidth: 110,
  },
  detailLabel: {
    fontSize: 9,
    letterSpacing: 0.8,
    fontWeight: '700',
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '800',
    marginTop: 4,
  },
  routeFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  scheduleDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  scheduleText: {
    fontSize: 12,
    fontWeight: '700',
  },
  weatherText: {
    fontSize: 11,
    fontWeight: '600',
  },
  inspectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  inspectBtnText: {
    fontSize: 11,
    fontWeight: '700',
  },
  alertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginTop: 6,
  },
  alertIcon: {
    width: 42,
    height: 42,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  alertText: {
    fontSize: 12,
    lineHeight: 18,
    marginTop: 3,
  },
  forecastBtn: {
    height: 50,
    borderRadius: 12,
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  forecastBtnText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.8,
  },
});
