import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';
import ScreenShell, { Card, SectionHeader } from '../../components/ScreenShell';
import { useTheme } from '../../constants/theme';

export default function RoutesScreen() {
  const { colors } = useTheme();

  return (
    <ScreenShell title="Freight Routes" subtitle="Monitor active freight corridors" breadcrumb="Freight Routes">
      {/* Status */}
      <Animated.View entering={FadeInDown.duration(500)}>
        <Card style={styles.statusCard}>
          <View style={styles.statusLeft}>
            <View style={[styles.liveDot, { backgroundColor: colors.success }]} />
            <View>
              <Text style={[styles.statusTitle, { color: colors.text }]}>Network Operational</Text>
              <Text style={[styles.statusSub, { color: colors.textSecondary }]}>28 active routes monitored</Text>
            </View>
          </View>
          <Text style={[styles.statusPct, { color: colors.success }]}>96%</Text>
        </Card>
      </Animated.View>

      {/* Summary Grid */}
      <SectionHeader eyebrow="Network Overview" title="Route Overview" />
      <View style={styles.summaryGrid}>
        {[
          { icon: '🚢', value: '28', label: 'Active Routes' },
          { icon: '⚡', value: '91%', label: 'On Schedule' },
          { icon: '⚠️', value: '3', label: 'At Risk' },
          { icon: '📍', value: '12', label: 'Regions' },
        ].map((s, i) => (
          <Animated.View key={s.label} entering={FadeInDown.delay(i * 100).duration(500)}>
            <Card style={styles.summaryCard}>
              <Text style={styles.summaryIcon}>{s.icon}</Text>
              <Text style={[styles.summaryValue, { color: colors.text }]}>{s.value}</Text>
              <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>{s.label}</Text>
            </Card>
          </Animated.View>
        ))}
      </View>

      {/* Active Corridors */}
      <SectionHeader eyebrow="Network Monitor" title="Active Corridors" />
      {[
        { from: 'Delhi NCR', to: 'Mumbai', demand: 'HIGH', demandColor: '#E53E3E', volume: '4,560 tons', distance: '1,420 km', time: '24h 30m', status: 'On Schedule', ok: true },
        { from: 'Delhi NCR', to: 'Bengaluru', demand: 'MEDIUM', demandColor: '#F38630', volume: '3,240 tons', distance: '2,150 km', time: '36h 20m', status: 'On Schedule', ok: true },
        { from: 'Mumbai', to: 'Chennai', demand: 'MEDIUM', demandColor: '#F38630', volume: '2,870 tons', distance: '1,335 km', time: '23h 10m', status: 'Minor Delay', ok: false },
        { from: 'Delhi NCR', to: 'Kolkata', demand: 'LOW', demandColor: '#2ECC8A', volume: '1,940 tons', distance: '1,530 km', time: '27h 15m', status: 'On Schedule', ok: true },
      ].map((r, i) => (
        <Animated.View key={`${r.from}-${r.to}`} entering={FadeInDown.delay(600 + i * 100).duration(600)}>
          <Card style={styles.routeCard}>
            <View style={styles.routeHeader}>
              <View style={styles.locationWrap}>
                <View style={[styles.locationDot, { backgroundColor: colors.primary }]} />
                <View>
                  <Text style={[styles.locationLabel, { color: colors.textSecondary }]}>FROM</Text>
                  <Text style={[styles.location, { color: colors.text }]}>{r.from}</Text>
                </View>
              </View>
              <Text style={[styles.routeArrow, { color: colors.primary }]}>→</Text>
              <View style={styles.locationWrap}>
                <View style={[styles.locationDot, { backgroundColor: colors.success }]} />
                <View>
                  <Text style={[styles.locationLabel, { color: colors.textSecondary }]}>TO</Text>
                  <Text style={[styles.location, { color: colors.text }]}>{r.to}</Text>
                </View>
              </View>
            </View>
            <View style={styles.demandRow}>
              <Text style={[styles.demandLabel, { color: colors.textSecondary }]}>DEMAND</Text>
              <View style={[styles.demandBadge, { backgroundColor: r.demandColor + '18' }]}>
                <Text style={[styles.demandText, { color: r.demandColor }]}>{r.demand}</Text>
              </View>
            </View>
            <View style={[styles.detailsRow, { borderTopColor: colors.divider }]}>
              {[{ l: 'FREIGHT', v: r.volume }, { l: 'DISTANCE', v: r.distance }, { l: 'ETA', v: r.time }].map(d => (
                <View key={d.l}>
                  <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>{d.l}</Text>
                  <Text style={[styles.detailValue, { color: colors.text }]}>{d.v}</Text>
                </View>
              ))}
            </View>
            <View style={[styles.routeFooter, { borderTopColor: colors.divider }]}>
              <View style={[styles.scheduleDot, { backgroundColor: r.ok ? colors.success : colors.warning }]} />
              <Text style={[styles.scheduleText, { color: r.ok ? colors.success : colors.warning }]}>{r.status}</Text>
              <Text style={[styles.monitorText, { color: colors.textSecondary }]}>Monitoring</Text>
            </View>
          </Card>
        </Animated.View>
      ))}

      {/* Alert */}
      <Animated.View entering={FadeInDown.delay(1000).duration(600)}>
        <Card style={[styles.alertCard, { backgroundColor: colors.warning + '10', borderColor: colors.warning }]}>
          <View style={[styles.alertIcon, { backgroundColor: colors.warning + '20' }]}>
            <Text style={{ fontSize: 20 }}>⚠️</Text>
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={[styles.alertTitle, { color: colors.text }]}>Route Risk Detected</Text>
            <Text style={[styles.alertText, { color: colors.textSecondary }]}>Mumbai → Chennai corridor is experiencing a minor delay. Consider alternate scheduling.</Text>
          </View>
        </Card>
      </Animated.View>

      {/* CTA */}
      <Animated.View entering={FadeInDown.delay(1100).duration(600)}>
        <TouchableOpacity
          style={[styles.forecastBtn, { backgroundColor: colors.primary }]}
          onPress={() => router.push('/(main)/forecast')}
          activeOpacity={0.85}
        >
          <Text style={styles.forecastBtnText}>Check AI Forecast</Text>
          <Text style={styles.forecastArrow}>→</Text>
        </TouchableOpacity>
      </Animated.View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  statusCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statusLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  liveDot: { width: 10, height: 10, borderRadius: 5 },
  statusTitle: { fontSize: 14, fontWeight: '700' },
  statusSub: { fontSize: 11, marginTop: 2 },
  statusPct: { fontSize: 22, fontWeight: '800' },
  summaryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  summaryCard: { width: '47%', minHeight: 110 },
  summaryIcon: { fontSize: 20 },
  summaryValue: { fontSize: 24, fontWeight: '800', marginTop: 8 },
  summaryLabel: { fontSize: 11, marginTop: 3 },
  routeCard: { marginBottom: 12 },
  routeHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  locationWrap: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: 8 },
  locationDot: { width: 9, height: 9, borderRadius: 5 },
  locationLabel: { fontSize: 8, letterSpacing: 1, fontWeight: '700', textTransform: 'uppercase' },
  location: { fontSize: 13, fontWeight: '700', marginTop: 2 },
  routeArrow: { fontSize: 20, marginHorizontal: 8 },
  demandRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 14 },
  demandLabel: { fontSize: 9, letterSpacing: 1, fontWeight: '700', textTransform: 'uppercase' },
  demandBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  demandText: { fontSize: 10, fontWeight: '800' },
  detailsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 14, paddingTop: 14, borderTopWidth: 1 },
  detailLabel: { fontSize: 8, letterSpacing: 0.8, fontWeight: '700', textTransform: 'uppercase' },
  detailValue: { fontSize: 12, fontWeight: '700', marginTop: 4 },
  routeFooter: { flexDirection: 'row', alignItems: 'center', marginTop: 12, paddingTop: 12, borderTopWidth: 1 },
  scheduleDot: { width: 7, height: 7, borderRadius: 4, marginRight: 6 },
  scheduleText: { fontSize: 12, fontWeight: '700' },
  monitorText: { fontSize: 11, marginLeft: 'auto' },
  alertCard: { flexDirection: 'row', alignItems: 'center', borderWidth: 1 },
  alertIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  alertTitle: { fontSize: 14, fontWeight: '700' },
  alertText: { fontSize: 12, lineHeight: 18, marginTop: 3 },
  forecastBtn: { height: 54, borderRadius: 16, marginTop: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  forecastBtnText: { fontSize: 14, fontWeight: '800', color: '#FFFFFF' },
  forecastArrow: { fontSize: 20, color: '#FFFFFF' },
});
