import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ScreenShell, { Card, PrimaryButton, SectionHeader } from '../../components/ScreenShell';
import { useTheme } from '../../constants/theme';

export default function MarketEntry() {
  const { colors } = useTheme();
  const [analyzing, setAnalyzing] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const progress = useRef(new Animated.Value(0)).current;
  const resultAnim = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.timing(pulse, { toValue: 1, duration: 1400, useNativeDriver: true }),
      Animated.timing(pulse, { toValue: 0, duration: 1400, useNativeDriver: true }),
    ])).start();
  }, []);

  const analyze = () => {
    setAnalyzing(true);
    setShowResult(false);
    progress.setValue(0);
    resultAnim.setValue(0);
    Animated.timing(progress, { toValue: 1, duration: 2200, useNativeDriver: false }).start();
    setTimeout(() => {
      setAnalyzing(false);
      setShowResult(true);
      Animated.spring(resultAnim, { toValue: 1, friction: 7, tension: 50, useNativeDriver: true }).start();
    }, 2300);
  };

  const pulseScale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.08] });
  const resultScale = resultAnim.interpolate({ inputRange: [0, 1], outputRange: [0.95, 1] });

  return (
    <ScreenShell title="Market Entry" subtitle="Identify the optimal timing to enter the freight market">
      {/* Status */}
      <Card style={styles.statusCard}>
        <View style={styles.statusRow}>
          <View style={[styles.statusDot, { backgroundColor: colors.success }]} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.statusTitle, { color: colors.primary }]}>MARKET ENGINE ONLINE</Text>
            <Text style={[styles.statusSub, { color: colors.textSecondary }]}>Live freight intelligence available</Text>
          </View>
          <Animated.View style={[styles.aiBadge, { backgroundColor: colors.primary + '20', borderColor: colors.primary, transform: [{ scale: pulseScale }] }]}>
            <Text style={[styles.aiText, { color: colors.primary }]}>AI</Text>
          </Animated.View>
        </View>
      </Card>

      {/* Market Overview */}
      <SectionHeader eyebrow="Current Market" title="Freight Environment" right="UPDATED NOW" />
      <Card>
        <View style={styles.marketRow}>
          <View style={{ flex: 1.3, paddingRight: 16, borderRightWidth: 1, borderRightColor: colors.divider }}>
            <Text style={[styles.rateLabel, { color: colors.textSecondary }]}>CURRENT FREIGHT RATE</Text>
            <View style={styles.rateValueRow}>
              <Text style={[styles.rateValue, { color: colors.text }]}>$42.8</Text>
              <Text style={[styles.rateUnit, { color: colors.textSecondary }]}> / MT</Text>
            </View>
            <Text style={[styles.changeValue, { color: colors.success }]}>+8.4% vs previous period</Text>
          </View>
          <View style={{ flex: 1, paddingLeft: 16 }}>
            <Text style={[styles.rateLabel, { color: colors.textSecondary }]}>SENTIMENT</Text>
            <Text style={[styles.sentimentValue, { color: colors.success }]}>BULLISH</Text>
            <View style={[styles.sentimentTrack, { backgroundColor: colors.divider }]}>
              <View style={[styles.sentimentFill, { backgroundColor: colors.success, width: '82%' }]} />
            </View>
            <Text style={[styles.sentimentScore, { color: colors.textSecondary }]}>82 / 100</Text>
          </View>
        </View>
      </Card>

      {/* Signals */}
      <SectionHeader eyebrow="Market Signals" title="Entry Indicators" />
      {[
        { label: 'FREIGHT MOMENTUM', value: 'STRONG', desc: 'Rates showing sustained upward movement', positive: true },
        { label: 'VESSEL AVAILABILITY', value: 'MODERATE', desc: 'Available tonnage tightening across key routes', positive: false },
        { label: 'CARGO DEMAND', value: 'HIGH', desc: 'Current demand supports upward freight pressure', positive: true },
        { label: 'ROUTE RISK', value: 'LOW', desc: 'No significant disruption detected', positive: true },
      ].map(s => (
        <Card key={s.label} style={styles.signalCard}>
          <View style={[styles.signalBar, { backgroundColor: colors.primary }]} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.signalLabel, { color: colors.text }]}>{s.label}</Text>
            <Text style={[styles.signalDesc, { color: colors.textSecondary }]}>{s.desc}</Text>
          </View>
          <Text style={[styles.signalValue, { color: s.positive ? colors.success : colors.warning }]}>{s.value}</Text>
        </Card>
      ))}

      {/* Timeline */}
      <SectionHeader eyebrow="Entry Forecast" title="Opportunity Window" />
      <Card>
        <View style={styles.timelineTop}>
          <View>
            <Text style={[styles.windowLabel, { color: colors.textSecondary }]}>RECOMMENDED ENTRY</Text>
            <Text style={[styles.windowValue, { color: colors.text }]}>72–96 HOURS</Text>
          </View>
          <View style={[styles.optimalBadge, { backgroundColor: colors.success + '18', borderColor: colors.success }]}>
            <View style={[styles.optimalDot, { backgroundColor: colors.success }]} />
            <Text style={[styles.optimalText, { color: colors.success }]}>OPTIMAL</Text>
          </View>
        </View>
        <Text style={[styles.timelineDesc, { color: colors.textSecondary }]}>
          Current indicators suggest that entering within this window provides the strongest balance between projected freight movement and charter cost.
        </Text>
        <View style={styles.timeline}>
          <View style={[styles.timelineTrack, { backgroundColor: colors.divider }]} />
          <View style={[styles.timelineActive, { backgroundColor: colors.primary }]} />
          <View style={[styles.timelineMarker, { backgroundColor: colors.primary, borderColor: colors.card }]} />
        </View>
        <View style={styles.timelineLabels}>
          <Text style={[styles.timelineLabel, { color: colors.textSecondary }]}>NOW</Text>
          <Text style={[styles.timelineLabelActive, { color: colors.primary }]}>72–96 HRS</Text>
          <Text style={[styles.timelineLabel, { color: colors.textSecondary }]}>+7 DAYS</Text>
        </View>
      </Card>

      <PrimaryButton label={analyzing ? 'ANALYZING MARKET' : 'ANALYZE ENTRY WINDOW'} onPress={analyze} loading={analyzing} icon="activity" />

      {analyzing && (
        <Card style={{ marginTop: 12 }}>
          <View style={styles.processingHeader}>
            <Text style={[styles.processingTitle, { color: colors.text }]}>AI market analysis in progress</Text>
            <Text style={[styles.processingLive, { color: colors.success }]}>LIVE</Text>
          </View>
          <View style={[styles.progressTrack, { backgroundColor: colors.divider }]}>
            <Animated.View style={[styles.progressFill, { backgroundColor: colors.primary, width: progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) }]} />
          </View>
          <Text style={[styles.processingText, { color: colors.textSecondary }]}>Evaluating freight momentum, vessel supply, demand pressure and route conditions...</Text>
        </Card>
      )}

      {showResult && (
        <Animated.View style={{ opacity: resultAnim, transform: [{ scale: resultScale }] }}>
          <Card style={[styles.resultCard, { borderColor: colors.primary }]}>
            <View style={styles.resultHeader}>
              <View>
                <Text style={[styles.resultEyebrow, { color: colors.primary }]}>AI MARKET DECISION</Text>
                <Text style={[styles.resultTitle, { color: colors.text }]}>ENTER MARKET</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={[styles.confLabel, { color: colors.textSecondary }]}>CONFIDENCE</Text>
                <Text style={[styles.confValue, { color: colors.success }]}>93.1%</Text>
              </View>
            </View>
            <View style={[styles.decisionBox, { backgroundColor: colors.success + '12' }]}>
              <Text style={[styles.decisionTitle, { color: colors.text }]}>✓ Favorable Entry Conditions</Text>
              <Text style={[styles.decisionDesc, { color: colors.textSecondary }]}>Freight momentum and demand conditions currently support entering within the projected window.</Text>
            </View>
            <View style={styles.resultStats}>
              {[{ l: 'ENTRY WINDOW', v: '72–96 HRS' }, { l: 'PROJECTED RATE', v: '$45.2 / MT' }, { l: 'MARKET SCORE', v: '82 / 100' }].map(s => (
                <View key={s.l} style={{ flex: 1 }}>
                  <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{s.l}</Text>
                  <Text style={[styles.statValue, { color: colors.text }]}>{s.v}</Text>
                </View>
              ))}
            </View>
          </Card>
        </Animated.View>
      )}

      {/* Key Drivers */}
      <SectionHeader eyebrow="Decision Intelligence" title="Key Market Drivers" />
      {[
        { title: 'Freight Rate Momentum', value: '+11.2%' },
        { title: 'Demand Pressure', value: 'HIGH' },
        { title: 'Available Tonnage', value: 'TIGHTENING' },
        { title: 'Short-Term Volatility', value: 'MODERATE' },
      ].map(d => (
        <Card key={d.title} style={styles.driverCard}>
          <View style={[styles.driverDot, { backgroundColor: colors.primary }]} />
          <Text style={[styles.driverTitle, { color: colors.text, flex: 1 }]}>{d.title}</Text>
          <Text style={[styles.driverValue, { color: colors.primary }]}>{d.value}</Text>
        </Card>
      ))}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  statusCard: { marginBottom: 0 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  statusDot: { width: 10, height: 10, borderRadius: 5 },
  statusTitle: { fontSize: 12, fontWeight: '700', letterSpacing: 0.5 },
  statusSub: { fontSize: 11, marginTop: 2 },
  aiBadge: { width: 40, height: 40, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  aiText: { fontSize: 12, fontWeight: '800' },
  marketRow: { flexDirection: 'row' },
  rateLabel: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  rateValueRow: { flexDirection: 'row', alignItems: 'flex-end', marginTop: 6 },
  rateValue: { fontSize: 30, fontWeight: '800' },
  rateUnit: { fontSize: 13, marginBottom: 4 },
  changeValue: { fontSize: 12, fontWeight: '700', marginTop: 4 },
  sentimentValue: { fontSize: 18, fontWeight: '800', marginTop: 6 },
  sentimentTrack: { height: 5, borderRadius: 3, overflow: 'hidden', marginTop: 8 },
  sentimentFill: { height: 5, borderRadius: 3 },
  sentimentScore: { fontSize: 11, marginTop: 5 },
  signalCard: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14 },
  signalBar: { width: 4, height: 32, borderRadius: 2 },
  signalLabel: { fontSize: 12, fontWeight: '700' },
  signalDesc: { fontSize: 11, marginTop: 3 },
  signalValue: { fontSize: 12, fontWeight: '700' },
  timelineTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  windowLabel: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase' },
  windowValue: { fontSize: 20, fontWeight: '800', marginTop: 4 },
  optimalBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20, borderWidth: 1 },
  optimalDot: { width: 6, height: 6, borderRadius: 3 },
  optimalText: { fontSize: 11, fontWeight: '700' },
  timelineDesc: { fontSize: 12, lineHeight: 18, marginBottom: 14 },
  timeline: { height: 24, justifyContent: 'center', marginBottom: 8 },
  timelineTrack: { height: 4, borderRadius: 3 },
  timelineActive: { position: 'absolute', left: '34%', width: '34%', height: 4, borderRadius: 3 },
  timelineMarker: { position: 'absolute', left: '50%', width: 14, height: 14, borderRadius: 7, borderWidth: 3 },
  timelineLabels: { flexDirection: 'row', justifyContent: 'space-between' },
  timelineLabel: { fontSize: 11, fontWeight: '600' },
  timelineLabelActive: { fontSize: 12, fontWeight: '700' },
  processingHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  processingTitle: { fontSize: 13, fontWeight: '700' },
  processingLive: { fontSize: 11, fontWeight: '700' },
  progressTrack: { height: 6, borderRadius: 3, overflow: 'hidden', marginBottom: 10 },
  progressFill: { height: 6, borderRadius: 3 },
  processingText: { fontSize: 12, lineHeight: 18 },
  resultCard: { borderWidth: 2 },
  resultHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 },
  resultEyebrow: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  resultTitle: { fontSize: 22, fontWeight: '800', marginTop: 4 },
  confLabel: { fontSize: 9, fontWeight: '700', textTransform: 'uppercase' },
  confValue: { fontSize: 18, fontWeight: '800', marginTop: 2 },
  decisionBox: { padding: 12, borderRadius: 12, marginBottom: 14 },
  decisionTitle: { fontSize: 13, fontWeight: '700', marginBottom: 4 },
  decisionDesc: { fontSize: 12, lineHeight: 18 },
  resultStats: { flexDirection: 'row' },
  statLabel: { fontSize: 9, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  statValue: { fontSize: 14, fontWeight: '800', marginTop: 4 },
  driverCard: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14 },
  driverDot: { width: 8, height: 8, borderRadius: 4 },
  driverTitle: { fontSize: 13, fontWeight: '600' },
  driverValue: { fontSize: 13, fontWeight: '700' },
});
