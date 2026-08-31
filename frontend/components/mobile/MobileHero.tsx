import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Path, Stop } from 'react-native-svg';

const CYAN = '#00D4FF';
const EMERALD = '#22C55E';
const ORANGE = '#FF7A00';

function AnimatedWaves() {
  const w1 = useRef(new Animated.Value(0)).current;
  const w2 = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(Animated.timing(w1, { toValue: 1, duration: 3200, easing: Easing.linear, useNativeDriver: true })).start();
    Animated.loop(Animated.timing(w2, { toValue: 1, duration: 2400, easing: Easing.linear, useNativeDriver: true })).start();
  }, []);
  const tx1 = w1.interpolate({ inputRange: [0, 1], outputRange: [0, -60] });
  const tx2 = w2.interpolate({ inputRange: [0, 1], outputRange: [0, 60] });
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Animated.View style={[StyleSheet.absoluteFill, { transform: [{ translateX: tx1 }] }]}>
        <Svg width="200%" height="100%" viewBox="0 0 800 200" preserveAspectRatio="none">
          <Path d="M0 120 Q100 80 200 120 Q300 160 400 120 Q500 80 600 120 Q700 160 800 120 L800 200 L0 200 Z" fill="rgba(0,212,255,0.07)" />
        </Svg>
      </Animated.View>
      <Animated.View style={[StyleSheet.absoluteFill, { transform: [{ translateX: tx2 }] }]}>
        <Svg width="200%" height="100%" viewBox="0 0 800 200" preserveAspectRatio="none">
          <Path d="M0 140 Q100 100 200 140 Q300 180 400 140 Q500 100 600 140 Q700 180 800 140 L800 200 L0 200 Z" fill="rgba(11,110,255,0.08)" />
        </Svg>
      </Animated.View>
    </View>
  );
}

function AIPulse() {
  const pulse = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 1200, easing: Easing.out(Easing.ease), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 1200, easing: Easing.in(Easing.ease), useNativeDriver: true }),
      ])
    ).start();
  }, []);
  const scale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.8] });
  const opacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.7, 0] });
  return (
    <View style={s.pulseWrap}>
      <Animated.View style={[s.pulseRing, { transform: [{ scale }], opacity }]} />
      <View style={s.pulseDot} />
    </View>
  );
}

function MiniMap({ origin, destination }: { origin: string; destination: string }) {
  const shipX = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shipX, { toValue: 1, duration: 4000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(shipX, { toValue: 0, duration: 4000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    ).start();
  }, []);
  const tx = shipX.interpolate({ inputRange: [0, 1], outputRange: [20, 220] });
  return (
    <View style={s.mapWrap}>
      <Svg width="100%" height={120} viewBox="0 0 320 120">
        <Defs>
          <LinearGradient id="og" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#0B2A6E" />
            <Stop offset="100%" stopColor="#061840" />
          </LinearGradient>
        </Defs>
        <Path d="M0 0 H320 V120 H0 Z" fill="url(#og)" />
        <Path d="M20 40 L55 28 L90 32 L110 50 L95 70 L60 72 L30 60 Z" fill="rgba(34,197,94,0.22)" stroke="rgba(34,197,94,0.4)" strokeWidth={0.8} />
        <Path d="M130 30 L165 22 L195 28 L210 45 L200 62 L170 65 L145 55 Z" fill="rgba(34,197,94,0.22)" stroke="rgba(34,197,94,0.4)" strokeWidth={0.8} />
        <Path d="M230 35 L275 25 L305 38 L310 60 L285 72 L250 68 L228 52 Z" fill="rgba(34,197,94,0.22)" stroke="rgba(34,197,94,0.4)" strokeWidth={0.8} />
        <Path d="M140 75 L165 68 L180 80 L170 95 L148 92 Z" fill="rgba(34,197,94,0.18)" stroke="rgba(34,197,94,0.35)" strokeWidth={0.8} />
        <Path d="M30 85 Q100 60 160 75 Q220 90 290 70" stroke={CYAN} strokeWidth={1.5} strokeDasharray="6 4" fill="none" opacity={0.8} />
        <Circle cx={30} cy={85} r={5} fill={ORANGE} />
        <Circle cx={30} cy={85} r={9} fill="rgba(255,122,0,0.25)" />
        <Circle cx={290} cy={70} r={5} fill={CYAN} />
        <Circle cx={290} cy={70} r={9} fill="rgba(0,212,255,0.25)" />
      </Svg>
      <Animated.View style={[s.shipEmoji, { transform: [{ translateX: tx }] }]}>
        <Text style={{ fontSize: 13 }}>🚢</Text>
      </Animated.View>
      <View style={s.mapLabels}>
        <Text style={[s.mapLabel, { color: ORANGE }]}>{origin}</Text>
        <Text style={[s.mapLabel, { color: CYAN }]}>{destination}</Text>
      </View>
    </View>
  );
}

const kpis = [
  { label: 'Freight Rate', value: '$42.8', sub: '/MT', change: '+8.4%', color: CYAN },
  { label: 'Forecast', value: '$47.6', sub: '40D', change: '+11.2%', color: EMERALD },
  { label: 'AI Accuracy', value: '91.8%', sub: 'AI', change: '+3.2%', color: ORANGE },
];

export default function MobileHero({ origin, destination }: { origin: string; destination: string }) {
  return (
    <View style={s.hero}>
      <AnimatedWaves />
      <View style={s.heroText}>
        <View style={s.titleRow}>
          <AIPulse />
          <Text style={s.title}>FREYNA Freight Intelligence</Text>
        </View>
        <Text style={s.sub}>AI-powered Maritime Intelligence Platform</Text>
      </View>
      <MiniMap origin={origin} destination={destination} />
      <View style={s.kpiRow}>
        {kpis.map(k => (
          <View key={k.label} style={[s.kpiCard, { borderColor: k.color + '50' }]}>
            <Text style={[s.kpiLabel, { color: k.color }]}>{k.label}</Text>
            <View style={s.kpiValRow}>
              <Text style={s.kpiVal}>{k.value}</Text>
              <Text style={[s.kpiSub, { color: k.color }]}>{k.sub}</Text>
            </View>
            <Text style={[s.kpiChange, { color: EMERALD }]}>{k.change}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  hero: { backgroundColor: '#061840', borderRadius: 24, overflow: 'hidden', marginBottom: 16, paddingTop: 20, paddingHorizontal: 16, paddingBottom: 16 },
  heroText: { marginBottom: 12, zIndex: 1 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 6 },
  title: { color: '#fff', fontSize: 17, fontWeight: '800', flex: 1, flexWrap: 'wrap' },
  sub: { color: 'rgba(0,212,255,0.85)', fontSize: 12, fontWeight: '600' },
  pulseWrap: { width: 18, height: 18, alignItems: 'center', justifyContent: 'center' },
  pulseRing: { position: 'absolute', width: 18, height: 18, borderRadius: 9, backgroundColor: CYAN },
  pulseDot: { width: 9, height: 9, borderRadius: 5, backgroundColor: CYAN },
  mapWrap: { borderRadius: 14, overflow: 'hidden', marginBottom: 14, position: 'relative' },
  shipEmoji: { position: 'absolute', top: 50 },
  mapLabels: { position: 'absolute', bottom: 5, left: 8, right: 8, flexDirection: 'row', justifyContent: 'space-between' },
  mapLabel: { fontSize: 10, fontWeight: '700' },
  kpiRow: { flexDirection: 'row', gap: 8 },
  kpiCard: { flex: 1, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 14, borderWidth: 1, padding: 10 },
  kpiLabel: { fontSize: 9, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 },
  kpiValRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 2 },
  kpiVal: { color: '#fff', fontSize: 17, fontWeight: '800' },
  kpiSub: { fontSize: 10, marginBottom: 2 },
  kpiChange: { fontSize: 10, fontWeight: '700', marginTop: 3 },
});
