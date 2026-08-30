import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const CYAN = '#00D4FF';
const EMERALD = '#22C55E';
const ORANGE = '#FF7A00';

const markets = [
  { label: 'Freight Index', value: '1,842', change: '+4.2%', up: true, color: CYAN, spark: 'M0 30 L10 25 L20 28 L30 18 L40 22 L50 12 L60 8' },
  { label: 'Fuel Prices', value: '$845/mt', change: '-2.1%', up: false, color: ORANGE, spark: 'M0 10 L10 14 L20 12 L30 18 L40 22 L50 20 L60 28' },
  { label: 'Vessel Avail.', value: '24 ships', change: '+6 ready', up: true, color: EMERALD, spark: 'M0 28 L10 22 L20 25 L30 18 L40 14 L50 10 L60 8' },
  { label: 'Demand Index', value: '78.4%', change: '+5.1%', up: true, color: '#A78BFA', spark: 'M0 30 L10 26 L20 20 L30 22 L40 15 L50 12 L60 6' },
];

function SparkLine({ d, color }: { d: string; color: string }) {
  return (
    <Svg width={60} height={36} viewBox="0 0 60 36">
      <Path d={d} stroke={color} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export default function MobileMarketOverview() {
  return (
    <View style={s.wrap}>
      <View style={s.header}>
        <Text style={s.eyebrow}>Market Overview</Text>
        <Text style={s.title}>Live Indices</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.scroll}>
        {markets.map(m => (
          <View key={m.label} style={[s.card, { borderColor: m.color + '40' }]}>
            <Text style={[s.label, { color: m.color }]}>{m.label}</Text>
            <Text style={s.value}>{m.value}</Text>
            <View style={s.bottom}>
              <Text style={[s.change, { color: m.up ? EMERALD : '#FF6B7A' }]}>{m.change}</Text>
              <SparkLine d={m.spark} color={m.color} />
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { marginBottom: 16 },
  header: { marginBottom: 12, paddingHorizontal: 2 },
  eyebrow: { color: CYAN, fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 3 },
  title: { color: '#fff', fontSize: 16, fontWeight: '800' },
  scroll: { gap: 12, paddingRight: 4 },
  card: { width: 150, backgroundColor: '#0A1E35', borderRadius: 18, borderWidth: 1, padding: 14 },
  label: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 },
  value: { color: '#fff', fontSize: 20, fontWeight: '800', marginBottom: 8 },
  bottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  change: { fontSize: 12, fontWeight: '700' },
});
