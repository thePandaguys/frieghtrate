import { Feather } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

const CYAN = '#00D4FF';

const feeds = [
  { icon: 'cloud-lightning', color: '#FF6B7A', bg: 'rgba(255,107,122,0.12)', kind: 'Weather Alert', title: 'Storm Watch: North Sea', detail: 'Squall cluster forming near English Channel. Expect 2-3m swells.' },
  { icon: 'alert-triangle', color: '#FFBE5C', bg: 'rgba(255,190,92,0.12)', kind: 'Route Risk', title: 'High Traffic: Strait of Malacca', detail: 'Congestion elevated. Consider alternate routing via Lombok.' },
  { icon: 'anchor', color: '#FF7A00', bg: 'rgba(255,122,0,0.12)', kind: 'Port Congestion', title: 'Hamburg Yard Backlog', detail: 'Berth dwell times extended by 21 hours. Plan for delays.' },
  { icon: 'cpu', color: CYAN, bg: 'rgba(0,212,255,0.12)', kind: 'AI Recommendation', title: 'Optimal Departure Window', detail: 'AI suggests departing within 48h to capture favorable freight rates.' },
];

export default function MobileIntelligenceFeed() {
  return (
    <View style={s.wrap}>
      <View style={s.header}>
        <Text style={s.eyebrow}>AI Intelligence</Text>
        <Text style={s.title}>Live Feed</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.scroll}>
        {feeds.map(item => (
          <View key={item.kind} style={[s.card, { borderColor: item.color + '40' }]}>
            <View style={[s.iconWrap, { backgroundColor: item.bg }]}>
              <Feather name={item.icon as any} size={18} color={item.color} />
            </View>
            <Text style={[s.kind, { color: item.color }]}>{item.kind}</Text>
            <Text style={s.cardTitle}>{item.title}</Text>
            <Text style={s.detail}>{item.detail}</Text>
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
  card: { width: 200, backgroundColor: '#0A1E35', borderRadius: 18, borderWidth: 1, padding: 14 },
  iconWrap: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  kind: { fontSize: 9, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 5 },
  cardTitle: { color: '#fff', fontSize: 13, fontWeight: '700', marginBottom: 6 },
  detail: { color: 'rgba(167,219,216,0.8)', fontSize: 11, lineHeight: 16 },
});
