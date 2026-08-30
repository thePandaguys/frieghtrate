import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
    <ScreenShell title="Statistics" subtitle="System performance, market intelligence and voyage metrics" badge="LIVE" badgeColor={colors.success}>
      {/* Period */}
      <View style={[styles.periodCard, { backgroundColor: colors.cardAlt, borderColor: colors.border }]}>
        <Text style={[styles.periodLabel, { color: colors.textSecondary }]}>ANALYTICS PERIOD</Text>
        <View style={styles.periodSelector}>
          {['7D', '30D', '90D', '1Y'].map(p => (
            <TouchableOpacity
              key={p}
              onPress={() => setPeriod(p)}
              style={[styles.periodBtn, { backgroundColor: period === p ? colors.primary : colors.card, borderColor: period === p ? colors.primary : colors.border }]}
              activeOpacity={0.8}
            >
              <Text style={[styles.periodText, { color: period === p ? '#FFFFFF' : colors.textSecondary }]}>{p}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* KPIs */}
      <SectionHeader eyebrow="System Overview" title="Key Performance" right="UPDATED NOW" />
      <View style={styles.metricGrid}>
        {[
          { label: 'VOYAGES ANALYZED', value: '1,284', change: '+18.6%' },
          { label: 'FORECAST ACCURACY', value: '91.8%', change: '+3.2%' },
          { label: 'AVG. FREIGHT RATE', value: '$42.8', suffix: '/ MT', change: '+8.4%' },
          { label: 'RISK SIGNALS', value: '38', change: '-6.4%' },
        ].map(m => (
          <Card key={m.label} style={styles.metricCard}>
            <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>{m.label}</Text>
            <View style={styles.metricValueRow}>
              <Text style={[styles.metricValue, { color: colors.text }]}>{m.value}</Text>
              {m.suffix && <Text style={[styles.metricSuffix, { color: colors.textSecondary }]}> {m.suffix}</Text>}
            </View>
            <Text style={[styles.metricChange, { color: m.change.startsWith('+') ? colors.success : colors.deepAccent }]}>{m.change}</Text>
          </Card>
        ))}
      </View>

      {/* Chart */}
      <SectionHeader eyebrow="Model Performance" title="Forecast Accuracy" />
      <Animated.View style={{ opacity: anim, transform: [{ scale }] }}>
        <Card>
          <View style={styles.chartHeader}>
            <Text style={[styles.chartTitle, { color: colors.text }]}>Forecast Accuracy</Text>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={[styles.chartValue, { color: colors.text }]}>91.8%</Text>
              <Text style={[styles.chartChange, { color: colors.success }]}>+3.2% PERIOD</Text>
            </View>
          </View>
          <View style={styles.chartBars}>
            {[55, 63, 68, 72, 80, 77, 91, 97].map((h, i) => (
              <View key={i} style={[styles.chartBar, { height: h, backgroundColor: colors.primary, opacity: 0.6 + i * 0.05 }]} />
            ))}
          </View>
          <View style={styles.chartLabels}>
            {['W1', 'W2', 'W3', 'W4'].map(l => (
              <Text key={l} style={[styles.chartLabel, { color: colors.textSecondary }]}>{l}</Text>
            ))}
          </View>
        </Card>
      </Animated.View>

      {/* Market Metrics */}
      <SectionHeader eyebrow="Market Intelligence" title="Market Metrics" />
      <View style={styles.marketGrid}>
        {[
          { label: 'MARKET SENTIMENT', value: 'BULLISH', detail: '+8.4%' },
          { label: 'DEMAND INDEX', value: '82', detail: 'HIGH' },
          { label: 'VESSEL SUPPLY', value: '64', detail: 'TIGHT' },
          { label: 'RATE VOLATILITY', value: '17.4%', detail: 'MODERATE' },
        ].map(m => (
          <Card key={m.label} style={styles.marketCard}>
            <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>{m.label}</Text>
            <Text style={[styles.marketValue, { color: colors.text }]}>{m.value}</Text>
            <Text style={[styles.marketDetail, { color: colors.success }]}>{m.detail}</Text>
          </Card>
        ))}
      </View>

      {/* Performance */}
      <SectionHeader eyebrow="Voyage Intelligence" title="Operational Performance" />
      <Card>
        {[
          { label: 'Route Optimization', value: 94 },
          { label: 'Vessel Matching', value: 92 },
          { label: 'Risk Detection', value: 89 },
          { label: 'Market Timing', value: 96 },
        ].map(p => (
          <View key={p.label} style={styles.perfRow}>
            <View style={styles.perfHeader}>
              <Text style={[styles.perfLabel, { color: colors.text }]}>{p.label}</Text>
              <Text style={[styles.perfValue, { color: colors.primary }]}>{p.value}%</Text>
            </View>
            <ProgressBar value={p.value} color={colors.primary} />
          </View>
        ))}
      </Card>

      {/* Savings */}
      <SectionHeader eyebrow="AI Impact" title="Optimization Value" />
      <Card style={[styles.savingsCard, { borderColor: colors.primary }]}>
        <View style={styles.savingsHeader}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.savingsEyebrow, { color: colors.primary }]}>ESTIMATED VALUE</Text>
            <Text style={[styles.savingsTitle, { color: colors.text }]}>Optimization Impact</Text>
          </View>
          <Text style={[styles.savingsValue, { color: colors.deepAccent }]}>$2.84M</Text>
        </View>
        <Text style={[styles.savingsDesc, { color: colors.textSecondary }]}>Estimated value generated through improved charter timing, vessel selection and freight-rate intelligence.</Text>
        <View style={[styles.savingsStats, { borderTopColor: colors.divider }]}>
          {[{ l: 'CHARTER TIMING', v: '+$1.12M' }, { l: 'VESSEL SELECTION', v: '+$0.94M' }, { l: 'RATE INTELLIGENCE', v: '+$0.78M' }].map(s => (
            <View key={s.l} style={{ flex: 1 }}>
              <Text style={[styles.impactLabel, { color: colors.textSecondary }]}>{s.l}</Text>
              <Text style={[styles.impactValue, { color: colors.text }]}>{s.v}</Text>
            </View>
          ))}
        </View>
      </Card>

      {/* Data Health */}
      <SectionHeader eyebrow="Data Infrastructure" title="Data Health" />
      {[
        { title: 'Freight Market Data', value: '98.7%' },
        { title: 'Vessel Availability Data', value: '96.4%' },
        { title: 'Route Intelligence', value: '99.1%' },
        { title: 'Forecast Inputs', value: '97.8%' },
      ].map(d => (
        <Card key={d.title} style={styles.dataRow}>
          <View style={styles.dataLeft}>
            <View style={[styles.dataDot, { backgroundColor: colors.success }]} />
            <Text style={[styles.dataTitle, { color: colors.text }]}>{d.title}</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={[styles.dataValue, { color: colors.primary }]}>{d.value}</Text>
            <Text style={[styles.dataStatus, { color: colors.success }]}>HEALTHY</Text>
          </View>
        </Card>
      ))}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  periodCard: { borderRadius: 14, borderWidth: 1, padding: 14, marginBottom: 4 },
  periodLabel: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 },
  periodSelector: { flexDirection: 'row', gap: 6 },
  periodBtn: { flex: 1, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  periodText: { fontSize: 13, fontWeight: '700' },
  metricGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  metricCard: { width: '48%', minHeight: 110 },
  metricLabel: { fontSize: 9, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  metricValueRow: { flexDirection: 'row', alignItems: 'flex-end', marginTop: 14 },
  metricValue: { fontSize: 22, fontWeight: '800' },
  metricSuffix: { fontSize: 11, marginBottom: 3 },
  metricChange: { fontSize: 12, fontWeight: '700', marginTop: 6 },
  chartHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  chartTitle: { fontSize: 16, fontWeight: '700' },
  chartValue: { fontSize: 20, fontWeight: '800' },
  chartChange: { fontSize: 11, fontWeight: '700', marginTop: 2 },
  chartBars: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, height: 110, marginBottom: 8 },
  chartBar: { flex: 1, borderRadius: 6 },
  chartLabels: { flexDirection: 'row', justifyContent: 'space-around' },
  chartLabel: { fontSize: 11, fontWeight: '600' },
  marketGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  marketCard: { width: '48%', minHeight: 100 },
  marketValue: { fontSize: 18, fontWeight: '800', marginTop: 14 },
  marketDetail: { fontSize: 12, fontWeight: '700', marginTop: 5 },
  perfRow: { marginBottom: 16 },
  perfHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  perfLabel: { fontSize: 13, fontWeight: '600' },
  perfValue: { fontSize: 13, fontWeight: '700' },
  savingsCard: { borderWidth: 2 },
  savingsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  savingsEyebrow: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  savingsTitle: { fontSize: 16, fontWeight: '800', marginTop: 4 },
  savingsValue: { fontSize: 22, fontWeight: '800' },
  savingsDesc: { fontSize: 12, lineHeight: 18, marginBottom: 14 },
  savingsStats: { flexDirection: 'row', paddingTop: 14, borderTopWidth: 1 },
  impactLabel: { fontSize: 9, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  impactValue: { fontSize: 13, fontWeight: '800', marginTop: 4 },
  dataRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14 },
  dataLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  dataDot: { width: 8, height: 8, borderRadius: 4 },
  dataTitle: { fontSize: 13, fontWeight: '600' },
  dataValue: { fontSize: 13, fontWeight: '700' },
  dataStatus: { fontSize: 9, fontWeight: '700', textTransform: 'uppercase', marginTop: 2 },
});
