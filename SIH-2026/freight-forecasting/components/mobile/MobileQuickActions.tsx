import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

const CYAN = '#00D4FF';

const actions = [
  { label: 'Market Entry', icon: 'trending-up', set: 'F', route: '/(main)/market-entry', grad: ['#0B6EFF', '#00D4FF'] },
  { label: 'Vessel Optimizer', icon: 'ship-wheel', set: 'M', route: '/(main)/vessels', grad: ['#FF7A00', '#FFB347'] },
  { label: 'Statistics', icon: 'bar-chart-2', set: 'F', route: '/(main)/stats', grad: ['#22C55E', '#4ADE80'] },
  { label: 'Reports', icon: 'file-text', set: 'F', route: '/(main)/reports', grad: ['#8B5CF6', '#A78BFA'] },
  { label: 'Policies', icon: 'shield', set: 'F', route: '/(main)/policy', grad: ['#EC4899', '#F472B6'] },
  { label: 'Routes', icon: 'map', set: 'F', route: '/(main)/routes', grad: ['#06B6D4', '#67E8F9'] },
] as const;

function ActionCard({ item }: { item: typeof actions[number] }) {
  const scale = useRef(new Animated.Value(1)).current;
  const onPressIn = () => Animated.spring(scale, { toValue: 0.93, useNativeDriver: true }).start();
  const onPressOut = () => Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();

  return (
    <Animated.View style={[s.cardWrap, { transform: [{ scale }] }]}>
      <Pressable
        onPress={() => router.push(item.route as any)}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        style={[s.card, { backgroundColor: item.grad[0] + '22', borderColor: item.grad[0] + '50' }]}
      >
        <View style={[s.iconWrap, { backgroundColor: item.grad[0] + '30' }]}>
          {item.set === 'F'
            ? <Feather name={item.icon as any} size={20} color={item.grad[0]} />
            : <MaterialCommunityIcons name={item.icon as any} size={20} color={item.grad[0]} />
          }
        </View>
        <Text style={[s.label, { color: '#fff' }]}>{item.label}</Text>
      </Pressable>
    </Animated.View>
  );
}

export default function MobileQuickActions() {
  return (
    <View style={s.wrap}>
      <View style={s.header}>
        <Text style={s.eyebrow}>Quick Actions</Text>
        <Text style={s.title}>Navigate</Text>
      </View>
      <View style={s.grid}>
        {actions.map(item => <ActionCard key={item.label} item={item} />)}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { marginBottom: 16 },
  header: { marginBottom: 12, paddingHorizontal: 2 },
  eyebrow: { color: CYAN, fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 3 },
  title: { color: '#fff', fontSize: 16, fontWeight: '800' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  cardWrap: { width: '31%', flexGrow: 1 },
  card: { borderRadius: 18, borderWidth: 1, padding: 14, alignItems: 'center', gap: 10 },
  iconWrap: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  label: { fontSize: 11, fontWeight: '700', textAlign: 'center' },
});
