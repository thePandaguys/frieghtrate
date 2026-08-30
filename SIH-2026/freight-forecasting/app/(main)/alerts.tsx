import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ScreenShell, { Card, PrimaryButton, SectionHeader } from '../../components/ScreenShell';
import { useTheme } from '../../constants/theme';

const ALERTS = [
  { id: '1', level: 'HIGH',   title: 'Freight Rate Volatility',       description: 'Projected freight movement indicates elevated rate volatility over the next 72 hours.', source: 'FORECAST ENGINE',  time: '8 MIN AGO' },
  { id: '2', level: 'MEDIUM', title: 'Vessel Availability Tightening', description: 'Available VLCC capacity is trending below the current market baseline.',                    source: 'VESSEL OPTIMIZER', time: '24 MIN AGO' },
  { id: '3', level: 'MEDIUM', title: 'Fuel Cost Pressure',             description: 'Recent bunker cost movement may increase voyage operating expenditure.',                      source: 'MARKET MONITOR',   time: '41 MIN AGO' },
  { id: '4', level: 'LOW',    title: 'Route Conditions Stable',        description: 'No significant operational disruption detected across the selected route.',                    source: 'ROUTE MONITOR',    time: '1 HR AGO' },
];

export default function Alerts() {
  const { colors } = useTheme();
  const [filter, setFilter] = useState('ALL');
  const [expanded, setExpanded] = useState<string | null>(null);
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.timing(pulse, { toValue: 1, duration: 1600, useNativeDriver: true }),
      Animated.timing(pulse, { toValue: 0, duration: 1600, useNativeDriver: true }),
    ])).start();
  }, []);

  const filtered = filter === 'ALL' ? ALERTS : ALERTS.filter(a => a.level === filter);

  const levelColor = (level: string) => {
    if (level === 'HIGH')   return colors.danger;
    if (level === 'MEDIUM') return colors.warning;
    return colors.success;
  };

  return (
    <ScreenShell title="Alerts" subtitle="Operational, market and voyage intelligence alerts">
      {/* Overview */}
      <Card>
        <View style={styles.overviewRow}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.overviewLabel, { color: colors.textMuted }]}>ACTIVE RISK SIGNALS</Text>
            <Text style={[styles.overviewNumber, { color: colors.deepAccent }]}>04</Text>
            <Text style={[styles.overviewStatus, { color: colors.primary }]}>MARKET CONDITIONS UNDER MONITORING</Text>
          </View>
          <View style={[styles.overviewDivider, { backgroundColor: colors.divider }]} />
          <View style={styles.overviewMetric}>
            <Text style={[styles.overviewLabel, { color: colors.textMuted }]}>RISK INDEX</Text>
            <Text style={[styles.riskIndex, { color: colors.text }]}>38</Text>
            <Text style={[styles.riskStatus, { color: colors.warning }]}>MODERATE</Text>
          </View>
        </View>
      </Card>

      {/* Risk Bar */}
      <SectionHeader eyebrow="Voyage Risk Profile" title="Current Risk Exposure" right="38 / 100" />
      <Card>
        <View style={[styles.riskTrack, { backgroundColor: colors.divider }]}>
          <View style={[styles.riskProgress, { backgroundColor: colors.warning, width: '38%' }]} />
        </View>
        <View style={styles.riskLabels}>
          {['LOW', 'MODERATE', 'HIGH', 'CRITICAL'].map(l => (
            <Text key={l} style={[styles.riskLabel, { color: colors.textMuted }]}>{l}</Text>
          ))}
        </View>
      </Card>

      {/* Filters */}
      <SectionHeader eyebrow="Intelligence Feed" title="Active Alerts" right="UPDATED LIVE" />
      <View style={styles.filters}>
        {['ALL', 'HIGH', 'MEDIUM', 'LOW'].map(f => (
          <TouchableOpacity
            key={f}
            onPress={() => setFilter(f)}
            style={[styles.filterBtn, {
              backgroundColor: filter === f ? colors.deepAccent : colors.card,
              borderColor: filter === f ? colors.deepAccent : colors.border,
            }]}
            activeOpacity={0.8}
          >
            <Text style={[styles.filterText, { color: filter === f ? '#FFFFFF' : colors.textMuted }]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Alert List */}
      {filtered.map(alert => {
        const isExpanded = expanded === alert.id;
        const lc = levelColor(alert.level);
        return (
          <TouchableOpacity
            key={alert.id}
            onPress={() => setExpanded(isExpanded ? null : alert.id)}
            activeOpacity={0.85}
          >
            <Card style={[styles.alertCard, { borderLeftColor: lc, borderLeftWidth: 4 }]}>
              <View style={styles.alertTop}>
                <View style={{ flex: 1 }}>
                  <View style={styles.alertTitleRow}>
                    <Text style={[styles.alertTitle, { color: colors.text }]}>{alert.title}</Text>
                    <View style={[styles.levelBadge, { backgroundColor: lc + '18', borderColor: lc }]}>
                      <Text style={[styles.levelText, { color: lc }]}>{alert.level}</Text>
                    </View>
                  </View>
                  <Text style={[styles.alertDesc, { color: colors.textSecondary }]} numberOfLines={isExpanded ? undefined : 2}>
                    {alert.description}
                  </Text>
                </View>
              </View>
              <View style={[styles.alertFooter, { borderTopColor: colors.divider }]}>
                <Text style={[styles.alertSource, { color: colors.primary }]}>{alert.source}</Text>
                <View style={styles.timeRow}>
                  <Text style={[styles.alertTime, { color: colors.textMuted }]}>{alert.time}</Text>
                  <Text style={[styles.expandArrow, { color: colors.primary }]}>{isExpanded ? '↑' : '↓'}</Text>
                </View>
              </View>
            </Card>
          </TouchableOpacity>
        );
      })}

      {/* AI Insight */}
      <SectionHeader eyebrow="AI Risk Interpretation" title="Recommended Action" />
      <Card accent>
        <View style={styles.insightHeader}>
          <View style={[styles.aiIcon, { backgroundColor: colors.deepAccent }]}>
            <Text style={styles.aiIconText}>AI</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.insightEyebrow, { color: colors.primary }]}>AI RISK INTERPRETATION</Text>
            <Text style={[styles.insightTitle, { color: colors.text }]}>Recommended Action</Text>
          </View>
        </View>
        <Text style={[styles.insightDesc, { color: colors.textSecondary }]}>
          Current signals suggest monitoring freight movement closely and securing suitable vessel capacity before the projected rate increase develops further.
        </Text>
        <PrimaryButton label="REVIEW FORECAST →" onPress={() => router.push('/(main)/forecast')} icon="trending-up" />
      </Card>

      {/* System Health */}
      <SectionHeader eyebrow="Monitoring Status" title="Intelligence Systems" />
      {['Market Monitor', 'Forecast Engine', 'Route Intelligence', 'Vessel Database'].map(sys => (
        <Card key={sys} style={styles.systemRow}>
          <View style={styles.systemLeft}>
            <View style={[styles.systemDot, { backgroundColor: colors.success }]} />
            <Text style={[styles.systemTitle, { color: colors.text }]}>{sys}</Text>
          </View>
          <View style={[styles.systemBadge, { backgroundColor: colors.successBg, borderColor: colors.success }]}>
            <Text style={[styles.systemStatus, { color: colors.success }]}>OPERATIONAL</Text>
          </View>
        </Card>
      ))}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  overviewRow: { flexDirection: 'row', alignItems: 'center' },
  overviewLabel: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  overviewNumber: { fontSize: 36, fontWeight: '800', marginTop: 4 },
  overviewStatus: { fontSize: 10, fontWeight: '700', marginTop: 4 },
  overviewDivider: { width: 1, height: 70, marginHorizontal: 16 },
  overviewMetric: { flex: 0.8, justifyContent: 'center' },
  riskIndex: { fontSize: 28, fontWeight: '800', marginTop: 4 },
  riskStatus: { fontSize: 12, fontWeight: '700', marginTop: 3 },
  riskTrack: { height: 8, borderRadius: 4, overflow: 'hidden', marginBottom: 8 },
  riskProgress: { height: 8, borderRadius: 4 },
  riskLabels: { flexDirection: 'row', justifyContent: 'space-between' },
  riskLabel: { fontSize: 10, fontWeight: '600' },
  filters: { flexDirection: 'row', gap: 8, marginBottom: 4 },
  filterBtn: { flex: 1, height: 38, borderRadius: 10, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  filterText: { fontSize: 12, fontWeight: '700' },
  alertCard: { marginBottom: 10, borderLeftWidth: 4 },
  alertTop: { flexDirection: 'row' },
  alertTitleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
  alertTitle: { fontSize: 14, fontWeight: '700', flex: 1, marginRight: 8 },
  levelBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 20, borderWidth: 1 },
  levelText: { fontSize: 10, fontWeight: '700' },
  alertDesc: { fontSize: 13, lineHeight: 19 },
  alertFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 10, borderTopWidth: 1 },
  alertSource: { fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
  timeRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  alertTime: { fontSize: 11, fontWeight: '600' },
  expandArrow: { fontSize: 14, fontWeight: '700' },
  insightHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  aiIcon: { width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  aiIconText: { color: '#FFFFFF', fontSize: 13, fontWeight: '800' },
  insightEyebrow: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  insightTitle: { fontSize: 16, fontWeight: '800', marginTop: 2 },
  insightDesc: { fontSize: 13, lineHeight: 20, marginBottom: 4 },
  systemRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14 },
  systemLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  systemDot: { width: 8, height: 8, borderRadius: 4 },
  systemTitle: { fontSize: 14, fontWeight: '600' },
  systemBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, borderWidth: 1 },
  systemStatus: { fontSize: 11, fontWeight: '700' },
});
