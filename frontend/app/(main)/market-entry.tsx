import { Feather } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
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
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 1400, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 1400, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const analyze = () => {
    setAnalyzing(true);
    setShowResult(false);
    progress.setValue(0);
    resultAnim.setValue(0);
    Animated.timing(progress, { toValue: 1, duration: 2000, useNativeDriver: false }).start();
    setTimeout(() => {
      setAnalyzing(false);
      setShowResult(true);
      Animated.spring(resultAnim, { toValue: 1, friction: 7, tension: 50, useNativeDriver: true }).start();
    }, 2100);
  };

  const pulseScale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.08] });
  const resultScale = resultAnim.interpolate({ inputRange: [0, 1], outputRange: [0.95, 1] });

  return (
    <ScreenShell
      title="Optimal Market Entry & Charter Strategy"
      subtitle="Phased chartering booking strategy: Spot vs Medium-Term Contract of Affreightment (SIH 26006)"
    >
      {/* Status Hero */}
      <Card style={[styles.statusCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.statusRow}>
          <View style={[styles.statusDot, { backgroundColor: colors.success }]} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.statusTitle, { color: colors.primary }]}>MARKET ENTRY ENGINE SYNCHRONIZED</Text>
            <Text style={[styles.statusSub, { color: colors.textSecondary }]}>
              Live forward curves, Baltic indices (BDI/BCI), and East Coast arrival slots evaluated
            </Text>
          </View>
          <Animated.View
            style={[
              styles.aiBadge,
              { backgroundColor: colors.primary + '20', borderColor: colors.primary, transform: [{ scale: pulseScale }] },
            ]}
          >
            <Feather name="trending-up" size={16} color={colors.primary} />
          </Animated.View>
        </View>
      </Card>

      {/* Freight Market Environment */}
      <SectionHeader eyebrow="Freight Environment" title="Live Market Position" right="SIH 26006 CORRIDOR" />
      <Card style={[styles.envCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.marketRow}>
          <View style={[styles.marketCol, { borderRightColor: colors.divider }]}>
            <Text style={[styles.rateLabel, { color: colors.textSecondary }]}>BENCHMARK FREIGHT RATE (GLADSTONE → PARADIP)</Text>
            <View style={styles.rateValueRow}>
              <Text style={[styles.rateValue, { color: colors.text }]}>$43.50</Text>
              <Text style={[styles.rateUnit, { color: colors.textSecondary }]}> / MT</Text>
            </View>
            <Text style={[styles.changeValue, { color: colors.success }]}>+8.4% 30-Day Forward Trend</Text>
          </View>

          <View style={styles.marketColRight}>
            <Text style={[styles.rateLabel, { color: colors.textSecondary }]}>CHARTERING SENTIMENT</Text>
            <Text style={[styles.sentimentValue, { color: colors.primary }]}>LOCK FORWARD (BULLISH)</Text>
            <View style={[styles.sentimentTrack, { backgroundColor: colors.divider }]}>
              <View style={[styles.sentimentFill, { backgroundColor: colors.primary, width: '84%' }]} />
            </View>
            <Text style={[styles.sentimentScore, { color: colors.textSecondary }]}>84 / 100 Forward Pressure Index</Text>
          </View>
        </View>
      </Card>

      {/* Entry Signals */}
      <SectionHeader eyebrow="Market Signals" title="Entry Timing Indicators" />
      {[
        {
          label: 'FREIGHT RATE MOMENTUM',
          value: 'UPWARD (+11.2%)',
          desc: 'Capesize supply on Australia-India corridor tightening; locking rates now prevents spot surge.',
          positive: true,
        },
        {
          label: 'PARADIP / VIZAG BERTH AVAILABILITY',
          value: 'OPTIMAL WINDOW (72-96h)',
          desc: 'Tidal discharge draft window aligned with low turnaround queue.',
          positive: true,
        },
        {
          label: 'BUNKER PRICE TRAJECTORY',
          value: 'VLSFO +2.4%',
          desc: 'Singapore fuel price firming up; voyage cost increases anticipated in 14 days.',
          positive: false,
        },
      ].map(s => (
        <Card key={s.label} style={[styles.signalCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.signalBar, { backgroundColor: s.positive ? colors.success : colors.warning }]} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.signalLabel, { color: colors.text }]}>{s.label}</Text>
            <Text style={[styles.signalDesc, { color: colors.textSecondary }]}>{s.desc}</Text>
          </View>
          <Text style={[styles.signalValue, { color: s.positive ? colors.success : colors.warning }]}>{s.value}</Text>
        </Card>
      ))}

      {/* Opportunity Window Strip */}
      <SectionHeader eyebrow="Entry Window" title="Recommended Laycan Window" />
      <Card style={[styles.windowCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.timelineTop}>
          <View>
            <Text style={[styles.windowLabel, { color: colors.textSecondary }]}>OPTIMAL CHARTER BOOKING WINDOW</Text>
            <Text style={[styles.windowValue, { color: colors.text }]}>NEXT 72–96 HOURS</Text>
          </View>
          <View style={[styles.optimalBadge, { backgroundColor: colors.success + '18', borderColor: colors.success }]}>
            <View style={[styles.optimalDot, { backgroundColor: colors.success }]} />
            <Text style={[styles.optimalText, { color: colors.success }]}>OPTIMAL</Text>
          </View>
        </View>
        <Text style={[styles.timelineDesc, { color: colors.textSecondary }]}>
          Model projects a 12-18% freight hike past day 14. Executing a 6-month Contract of Affreightment (COA) or medium-term time charter now secures an estimated $4.2M in annual cost savings.
        </Text>
      </Card>

      <PrimaryButton
        label={analyzing ? 'EVALUATING MULTI-VOYAGE STRATEGY...' : 'EVALUATE OPTIMAL CHARTER ENTRY'}
        onPress={analyze}
        loading={analyzing}
        icon="activity"
      />

      {/* Result Card */}
      {showResult && (
        <Animated.View style={{ opacity: resultAnim, transform: [{ scale: resultScale }] }}>
          <Card style={[styles.resultCard, { backgroundColor: colors.card, borderColor: colors.primary }]}>
            <View style={styles.resultHeader}>
              <View>
                <Text style={[styles.resultEyebrow, { color: colors.primary }]}>AI CHARTER RECOMMENDATION</Text>
                <Text style={[styles.resultTitle, { color: colors.text }]}>EXECUTE MEDIUM-TERM CHARTER</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={[styles.confLabel, { color: colors.textSecondary }]}>MODEL CONFIDENCE</Text>
                <Text style={[styles.confValue, { color: colors.success }]}>94.2%</Text>
              </View>
            </View>

            <View style={[styles.decisionBox, { backgroundColor: colors.success + '15', borderColor: colors.success }]}>
              <Feather name="check-circle" size={16} color={colors.success} />
              <Text style={[styles.decisionDesc, { color: colors.text }]}>
                Lock in 4 Capesize consecutive voyages at $43.50/MT before Baltic index upward correction.
              </Text>
            </View>

            <View style={styles.resultStats}>
              {[
                { l: 'TARGET RATE', v: '$43.50 / MT' },
                { l: 'PROJECTED SPOT AT ARRIVAL', v: '$48.10 / MT' },
                { l: 'ESTIMATED PARCEL SAVINGS', v: '$345,000' },
              ].map(s => (
                <View key={s.l} style={styles.statCol}>
                  <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{s.l}</Text>
                  <Text style={[styles.statValue, { color: colors.text }]}>{s.v}</Text>
                </View>
              ))}
            </View>
          </Card>
        </Animated.View>
      )}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  statusCard: { padding: 16, marginBottom: 12 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  statusDot: { width: 10, height: 10, borderRadius: 5 },
  statusTitle: { fontSize: 13, fontWeight: '800', letterSpacing: -0.2 },
  statusSub: { fontSize: 11, marginTop: 2 },
  aiBadge: { width: 36, height: 36, borderRadius: 8, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
  envCard: { padding: 18, marginBottom: 12 },
  marketRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  marketCol: { flex: 1.3, minWidth: 240, paddingRight: 16, borderRightWidth: 1 },
  marketColRight: { flex: 1, minWidth: 200 },
  rateLabel: { fontSize: 9, fontWeight: '800', letterSpacing: 0.8 },
  rateValueRow: { flexDirection: 'row', alignItems: 'baseline', marginTop: 4 },
  rateValue: { fontSize: 26, fontWeight: '900', letterSpacing: -0.5 },
  rateUnit: { fontSize: 12, fontWeight: '700' },
  changeValue: { fontSize: 11, fontWeight: '800', marginTop: 4 },
  sentimentValue: { fontSize: 15, fontWeight: '800', marginTop: 4 },
  sentimentTrack: { height: 6, borderRadius: 3, overflow: 'hidden', marginTop: 8 },
  sentimentFill: { height: 6, borderRadius: 3 },
  sentimentScore: { fontSize: 10, fontWeight: '700', marginTop: 4 },
  signalCard: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, marginBottom: 10, overflow: 'hidden' },
  signalBar: { width: 4, height: '100%', borderRadius: 2 },
  signalLabel: { fontSize: 12, fontWeight: '800' },
  signalDesc: { fontSize: 11, lineHeight: 16, marginTop: 2 },
  signalValue: { fontSize: 11, fontWeight: '800' },
  windowCard: { padding: 16, marginBottom: 14 },
  timelineTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  windowLabel: { fontSize: 9, fontWeight: '800', letterSpacing: 0.8 },
  windowValue: { fontSize: 18, fontWeight: '900', marginTop: 2 },
  optimalBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, borderWidth: 1 },
  optimalDot: { width: 6, height: 6, borderRadius: 3 },
  optimalText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  timelineDesc: { fontSize: 12, lineHeight: 18 },
  resultCard: { padding: 18, marginTop: 14, borderWidth: 2 },
  resultHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  resultEyebrow: { fontSize: 9, fontWeight: '800', letterSpacing: 0.8 },
  resultTitle: { fontSize: 18, fontWeight: '900', marginTop: 2 },
  confLabel: { fontSize: 8, fontWeight: '800' },
  confValue: { fontSize: 16, fontWeight: '900' },
  decisionBox: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, borderRadius: 8, borderWidth: 1, marginBottom: 14 },
  decisionDesc: { fontSize: 12, fontWeight: '700', flex: 1 },
  resultStats: { flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 },
  statCol: { minWidth: 120 },
  statLabel: { fontSize: 8, fontWeight: '800', letterSpacing: 0.5 },
  statValue: { fontSize: 14, fontWeight: '900', marginTop: 2 },
});
