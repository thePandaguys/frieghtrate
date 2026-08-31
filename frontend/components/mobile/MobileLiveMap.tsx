import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Defs, G, LinearGradient, Path, Stop } from 'react-native-svg';

const CYAN = '#29C4E8';
const ORANGE = '#FF7A00';

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
          <Text style={s.eyebrow}>MARITIME GIS TELEMETRY</Text>
          <Text style={s.title}>Active Voyage Tracking</Text>
        </View>
        <View style={s.liveBadge}>
          <View style={s.liveDot} />
          <Text style={s.liveText}>AIS ACTIVE</Text>
        </View>
      </View>

      <View style={s.mapContainer}>
        <Svg width="100%" height={200} viewBox="0 0 340 200">
          <Defs>
            <LinearGradient id="sea" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#0A1B29" />
              <Stop offset="100%" stopColor="#071521" />
            </LinearGradient>
            <LinearGradient id="routeGrad" x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0%" stopColor={ORANGE} />
              <Stop offset="100%" stopColor={CYAN} />
            </LinearGradient>
          </Defs>
          <Path d="M0 0 H340 V200 H0 Z" fill="url(#sea)" />
          {/* Grid lines */}
          {[40, 80, 120, 160].map(y => (
            <Path key={y} d={`M0 ${y} H340`} stroke="rgba(41,196,232,0.1)" strokeWidth={1} />
          ))}
          {[68, 136, 204, 272].map(x => (
            <Path key={x} d={`M${x} 0 V200`} stroke="rgba(41,196,232,0.1)" strokeWidth={1} />
          ))}
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
            <Circle cx={320} cy={90} r={12} fill="rgba(41,196,232,0.2)" />
          </G>
        </Svg>

        {/* Animated ship */}
        <Animated.View style={[s.ship, { transform: [{ translateX: tx }] }]}>
          <Animated.View style={[s.shipGlow, { opacity: glowOp }]} />
          <MaterialCommunityIcons name="ferry" size={18} color="#FF7A00" />
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
          { label: 'Distance', value: '11,480 nm' },
          { label: 'ETA', value: '26.4 days' },
          { label: 'Speed', value: '13.4 kn' },
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
  card: { backgroundColor: '#102A3D', borderRadius: 16, borderWidth: 1, borderColor: '#23465B', marginBottom: 16, overflow: 'hidden' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, paddingBottom: 12 },
  eyebrow: { color: CYAN, fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 3 },
  title: { color: '#E8F0F5', fontSize: 16, fontWeight: '800' },
  liveBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(32,201,151,0.15)', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1, borderColor: 'rgba(32,201,151,0.4)' },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#20C997' },
  liveText: { color: '#20C997', fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  mapContainer: { position: 'relative', marginHorizontal: 12, borderRadius: 14, overflow: 'hidden' },
  ship: { position: 'absolute', top: 72 },
  shipGlow: { position: 'absolute', width: 30, height: 10, borderRadius: 5, backgroundColor: CYAN, top: 8, left: -5, shadowColor: CYAN, shadowOpacity: 0.8, shadowRadius: 8, shadowOffset: { width: 0, height: 0 } },
  portLabels: { position: 'absolute', bottom: 8, left: 8, right: 8, flexDirection: 'row', justifyContent: 'space-between' },
  portTag: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  portDot: { width: 6, height: 6, borderRadius: 3 },
  portName: { color: 'rgba(255,255,255,0.8)', fontSize: 10, fontWeight: '700' },
  statsRow: { flexDirection: 'row', padding: 14, paddingTop: 12, gap: 0 },
  statItem: { flex: 1, alignItems: 'center' },
  statLabel: { color: '#91A9B8', fontSize: 10, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 3 },
  statValue: { color: '#E8F0F5', fontSize: 13, fontWeight: '800' },
});
