import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import ScreenShell, { Card, ProgressBar, SectionHeader } from '../../components/ScreenShell';
import { useTheme } from '../../constants/theme';

export default function Stats() {
  const { colors } = useTheme();
  const [period, setPeriod] = useState('30D');
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(anim, { toValue: 1, friction: 8, tension: 45, useNativeDriver: true }).start();
  }, []);

  const scale = anim.interpolate({ inputRange: [0, 1], outputRange: [0.96, 1] });

  return (
    <ScreenShell
      title="System Telemetry & Procurement KPIs"
      subtitle="Model validation metrics, vessel utilization, and estimated charter savings (SIH 26006)"
      breadcrumb="Statistics"
      badge="MODEL BENCHMARK"
      badgeColor={colors.success}
    >
      {/* Period Selector */}
      <View style={[styles.periodCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.periodLabel, { color: colors.textMuted }]}>ANALYTICS TIMEFRAME</Text>
        <View style={styles.periodSelector}>
          {['7D', '30D', '90D', '1Y'].map(p => (
            <Pressable
              key={p}
              onPress={() => setPeriod(p)}
              style={[
                styles.periodBtn,
                {
                  backgroundColor: period === p ? colors.primary : colors.cardAlt,
                  borderColor: period === p ? colors.primary : colors.border,
                },
              ]}
            >
              <Text style={[styles.periodText, { color: period === p ? '#FFFFFF' : colors.textMuted }]}>{p}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Primary KPI Grid */}
      <SectionHeader eyebrow="Procurement Telemetry" title="Strategic Performance Indicators" right="UPDATED NOW" />
      <View style={styles.metricGrid}>
        {[
          { label: 'TOTAL BULK VOYAGES OPTIMIZED', value: '1,428', change: '+22.4%', icon: 'compass' },
          { label: 'ML FORECAST ACCURACY (MAPE 4.2%)', value: '95.8%', change: '+4.1%', icon: 'trending-up' },
          { label: 'AVG. BULK FREIGHT RATE', value: '$43.5', suffix: '/ MT', change: '+8.4%', icon: 'dollar-sign' },
          { label: 'DEMURRAGE / IDLE REDUCTION', value: '-38.5%', change: 'OPTIMAL', icon: 'shield-check' },
        ].map(m => (
          <Card key={m.label} style={[styles.metricCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.metricTop}>
              <Text style={[styles.metricLabel, { color: colors.textMuted }]}>{m.label}</Text>
              <Feather name={m.icon as any} size={15} color={colors.primary} />
            </View>
            <View style={styles.metricValueRow}>
              <Text style={[styles.metricValue, { color: colors.text }]}>{m.value}</Text>
              {m.suffix && <Text style={[styles.metricSuffix, { color: colors.textMuted }]}> {m.suffix}</Text>}
            </View>
            <Text style={[styles.metricChange, { color: colors.success }]}>{m.change}</Text>
          </Card>
        ))}
      </View>

      {/* Model Benchmark Chart */}
      <SectionHeader eyebrow="Inference Accuracy" title="Forward Model Accuracy vs Actuals" />
      <Animated.View style={{ opacity: anim, transform: [{ scale }] }}>
        <Card style={[styles.chartCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.chartHeader}>
            <View>
              <Text style={[styles.chartTitle, { color: colors.text }]}>Baltic Index Correlation & Rate Precision</Text>
              <Text style={[styles.chartSub, { color: colors.textSecondary }]}>Capesize & Panamax forward prediction accuracy</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={[styles.chartValue, { color: colors.accent }]}>95.8%</Text>
              <Text style={[styles.chartChange, { color: colors.success }]}>+3.8% BENCHMARK</Text>
            </View>
          </View>
          <View style={styles.chartBars}>
            {[58, 66, 72, 78, 84, 88, 93, 98].map((h, i) => (
              <View key={i} style={[styles.chartBar, { height: h, backgroundColor: colors.primary, opacity: 0.5 + i * 0.07 }]} />
            ))}
          </View>
          <View style={styles.chartLabels}>
            {['WK 1', 'WK 2', 'WK 3', 'WK 4', 'WK 5', 'WK 6', 'WK 7', 'WK 8'].map(l => (
              <Text key={l} style={[styles.chartLabel, { color: colors.textMuted }]}>{l}</Text>
            ))}
          </View>
        </Card>
      </Animated.View>

      {/* Optimization Savings Value Card */}
      <SectionHeader eyebrow="Economic Value Delivered" title="Procurement Cost Reduction" />
      <Card style={[styles.savingsCard, { backgroundColor: colors.cardAlt, borderColor: colors.primary }]}>
        <View style={styles.savingsHeader}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.savingsEyebrow, { color: colors.primary }]}>TOTAL CHARTERING SAVINGS (ESTIMATED)</Text>
            <Text style={[styles.savingsTitle, { color: colors.text }]}>Optimization Impact</Text>
          </View>
          <Text style={[styles.savingsValue, { color: colors.success }]}>$4.20M</Text>
        </View>
        <Text style={[styles.savingsDesc, { color: colors.textSecondary }]}>
          Derived through proactive multi-voyage booking, avoidance of spot market spikes, and port draft-optimized vessel sizing.
        </Text>
        <View style={[styles.savingsStats, { borderTopColor: colors.divider }]}>
          {[
            { l: 'CHARTER TIMING SAVINGS', v: '+$1.84M' },
            { l: 'VESSEL SIZING (CAPESIZE)', v: '+$1.42M' },
            { l: 'DEMURRAGE AVOIDANCE', v: '+$0.94M' },
          ].map(s => (
            <View key={s.l} style={styles.statCol}>
              <Text style={[styles.impactLabel, { color: colors.textMuted }]}>{s.l}</Text>
              <Text style={[styles.impactValue, { color: colors.text }]}>{s.v}</Text>
            </View>
          ))}
        </View>
      </Card>

      {/* Data Health Telemetry */}
      <SectionHeader eyebrow="Data Infrastructure" title="Data Feed Health & Latency" />
      {[
        { title: 'Baltic Dry Index (BDI / BCI / BPI)', value: '99.4%', status: 'REAL-TIME' },
        { title: 'Global AIS Satellite Fleet Feed', value: '98.2%', status: 'REAL-TIME' },
        { title: 'Indian Ports Berth / Turnaround Telemetry', value: '97.6%', status: 'HEALTHY' },
        { title: 'Neural Forecast Weights & Feature Store', value: '99.8%', status: 'SYNCHRONIZED' },
      ].map(d => (
        <Card key={d.title} style={[styles.dataCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.dataLeft}>
            <View style={[styles.dataDot, { backgroundColor: colors.success }]} />
            <Text style={[styles.dataTitle, { color: colors.text }]}>{d.title}</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={[styles.dataValue, { color: colors.primary }]}>{d.value}</Text>
            <Text style={[styles.dataStatus, { color: colors.success }]}>{d.status}</Text>
          </View>
        </Card>
      ))}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  periodCard: {
    padding: 14,
    marginBottom: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  periodLabel: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  periodSelector: {
    flexDirection: 'row',
    gap: 8,
  },
  periodBtn: {
    flex: 1,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  periodText: {
    fontSize: 12,
    fontWeight: '800',
  },
  metricGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 8,
  },
  metricCard: {
    flex: 1,
    minWidth: 160,
    padding: 14,
    justifyContent: 'space-between',
  },
  metricTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  metricLabel: {
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.5,
    flex: 1,
  },
  metricValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 8,
  },
  metricValue: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.4,
  },
  metricSuffix: {
    fontSize: 11,
    fontWeight: '700',
  },
  metricChange: {
    fontSize: 11,
    fontWeight: '800',
    marginTop: 4,
  },
  chartCard: {
    padding: 18,
    marginBottom: 12,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  chartSub: {
    fontSize: 11,
    marginTop: 2,
  },
  chartValue: {
    fontSize: 20,
    fontWeight: '900',
  },
  chartChange: {
    fontSize: 10,
    fontWeight: '800',
    marginTop: 2,
  },
  chartBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    height: 110,
    marginBottom: 8,
  },
  chartBar: {
    flex: 1,
    borderRadius: 6,
  },
  chartLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  chartLabel: {
    fontSize: 9,
    fontWeight: '700',
  },
  savingsCard: {
    padding: 18,
    marginBottom: 12,
    borderWidth: 1.5,
  },
  savingsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  savingsEyebrow: {
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  savingsTitle: {
    fontSize: 16,
    fontWeight: '900',
    marginTop: 2,
  },
  savingsValue: {
    fontSize: 24,
    fontWeight: '900',
  },
  savingsDesc: {
    fontSize: 11,
    lineHeight: 16,
    marginBottom: 12,
  },
  savingsStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 12,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  statCol: {
    minWidth: 110,
  },
  impactLabel: {
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  impactValue: {
    fontSize: 13,
    fontWeight: '800',
    marginTop: 2,
  },
  dataCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    marginBottom: 8,
  },
  dataLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dataDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dataTitle: {
    fontSize: 12,
    fontWeight: '700',
  },
  dataValue: {
    fontSize: 12,
    fontWeight: '800',
  },
  dataStatus: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginTop: 2,
  },
});
