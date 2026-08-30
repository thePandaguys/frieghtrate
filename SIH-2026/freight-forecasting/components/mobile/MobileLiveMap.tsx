import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Defs, G, LinearGradient, Path, Stop } from 'react-native-svg';

const CYAN = '#00D4FF';
const ORANGE = '#FF7A00';
const OCEAN = '#0B6EFF';

export default function MobileLiveMap({ origin, destination }: { origin: string; destination: string }) {
  const shipX = useRef(new Animated.Value(0)).current;
  const glow = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shipX, { toValue: 1, duration: 5000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(shipX, { toValue: 0, duration: 5000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    ).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(glow, { toValue: 1, duration: 1500, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(glow, { toValue: 0, duration: 1500, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const tx = shipX.interpolate({ inputRange: [0, 1], outputRange: [10, 240] });
  const glowOp = glow.interpolate({ inputRange: [0, 1], outputRange: [0.3, 1] });

  return (
    <View style={s.card}>
      <View style={s.header}>
        <View>
          <Text style={s.eyebrow}>Live Ocean Map</Text>
          <Text style={s.title}>Active Route Tracking</Text>
        </View>
        <View style={s.liveBadge}>
          <View style={s.liveDot} />
          <Text style={s.liveText}>LIVE</Text>
        </View>
      </View>

      <View style={s.mapContainer}>
        <Svg width="100%" height={200} viewBox="0 0 340 200">
          <Defs>
            <LinearGradient id="sea" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#061840" />
              <Stop offset="100%" stopColor="#030E28" />
            </LinearGradient>
            <LinearGradient id="routeGrad" x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0%" stopColor={ORANGE} />
              <Stop offset="100%" stopColor={CYAN} />
            </LinearGradient>
          </Defs>
          <Path d="M0 0 H340 V200 H0 Z" fill="url(#sea)" />
          {/* Grid lines */}
          {[40, 80, 120, 160].map(y => (
            <Path key={y} d={`M0 ${y} H340`} stroke="rgba(0,212,255,0.05)" strokeWidth={1} />
          ))}
          {[68, 136, 204, 272].map(x => (
            <Path key={x} d={`M${x} 0 V200`} stroke="rgba(0,212,255,0.05)" strokeWidth={1} />
          ))}
          {/* Continents */}
          <Path d="M15 50 L50 35 L85 40 L100 60 L85 80 L50 82 L20 70 Z" fill="rgba(34,197,94,0.2)" stroke="rgba(34,197,94,0.35)" strokeWidth={1} />
          <Path d="M120 38 L158 28 L188 35 L200 55 L190 72 L160 75 L135 62 Z" fill="rgba(34,197,94,0.2)" stroke="rgba(34,197,94,0.35)" strokeWidth={1} />
          <Path d="M220 42 L265 30 L300 44 L308 68 L280 80 L245 76 L218 60 Z" fill="rgba(34,197,94,0.2)" stroke="rgba(34,197,94,0.35)" strokeWidth={1} />
          <Path d="M135 90 L162 82 L178 96 L168 112 L144 108 Z" fill="rgba(34,197,94,0.18)" stroke="rgba(34,197,94,0.3)" strokeWidth={1} />
          {/* Route line */}
          <Path d="M25 110 Q80 85 140 100 Q200 115 260 95 Q295 85 320 90"
            stroke="url(#routeGrad)" strokeWidth={2} strokeDasharray="8 5" fill="none" opacity={0.9} />
          {/* Origin */}
          <G>
            <Circle cx={25} cy={110} r={6} fill={ORANGE} />
            <Circle cx={25} cy={110} r={12} fill="rgba(255,122,0,0.2)" />
          </G>
          {/* Destination */}
          <G>
            <Circle cx={320} cy={90} r={6} fill={CYAN} />
            <Circle cx={320} cy={90} r={12} fill="rgba(0,212,255,0.2)" />
          </G>
        </Svg>

        {/* Animated ship */}
        <Animated.View style={[s.ship, { transform: [{ translateX: tx }] }]}>
          <Animated.View style={[s.shipGlow, { opacity: glowOp }]} />
          <Text style={s.shipIcon}>🚢</Text>
        </Animated.View>

        {/* Port labels */}
        <View style={s.portLabels}>
          <View style={s.portTag}>
            <View style={[s.portDot, { backgroundColor: ORANGE }]} />
            <Text style={s.portName}>{origin}</Text>
          </View>
          <View style={s.portTag}>
            <View style={[s.portDot, { backgroundColor: CYAN }]} />
            <Text style={s.portName}>{destination}</Text>
          </View>
        </View>
      </View>

      {/* Stats row */}
      <View style={s.statsRow}>
        {[
          { label: 'Distance', value: '11,240 nm' },
          { label: 'ETA', value: '8.4 days' },
          { label: 'Speed', value: '14.2 kn' },
        ].map(item => (
          <View key={item.label} style={s.statItem}>
            <Text style={s.statLabel}>{item.label}</Text>
            <Text style={s.statValue}>{item.value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  card: { backgroundColor: '#061840', borderRadius: 20, borderWidth: 1, borderColor: 'rgba(0,212,255,0.2)', marginBottom: 16, overflow: 'hidden' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, paddingBottom: 12 },
  eyebrow: { color: CYAN, fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 3 },
  title: { color: '#fff', fontSize: 16, fontWeight: '800' },
  liveBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(34,197,94,0.15)', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1, borderColor: 'rgba(34,197,94,0.4)' },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#22C55E' },
  liveText: { color: '#22C55E', fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  mapContainer: { position: 'relative', marginHorizontal: 12, borderRadius: 14, overflow: 'hidden' },
  ship: { position: 'absolute', top: 72 },
  shipGlow: { position: 'absolute', width: 30, height: 10, borderRadius: 5, backgroundColor: CYAN, top: 8, left: -5, shadowColor: CYAN, shadowOpacity: 0.8, shadowRadius: 8, shadowOffset: { width: 0, height: 0 } },
  shipIcon: { fontSize: 16 },
  portLabels: { position: 'absolute', bottom: 8, left: 8, right: 8, flexDirection: 'row', justifyContent: 'space-between' },
  portTag: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  portDot: { width: 6, height: 6, borderRadius: 3 },
  portName: { color: 'rgba(255,255,255,0.8)', fontSize: 10, fontWeight: '700' },
  statsRow: { flexDirection: 'row', padding: 14, paddingTop: 12, gap: 0 },
  statItem: { flex: 1, alignItems: 'center' },
  statLabel: { color: 'rgba(0,212,255,0.7)', fontSize: 10, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 3 },
  statValue: { color: '#fff', fontSize: 13, fontWeight: '800' },
});
