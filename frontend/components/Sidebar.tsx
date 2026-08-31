import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { router, usePathname } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../constants/theme';

const NAV_GROUPS = [
  {
    label: 'Intelligence',
    items: [
      { label: 'Dashboard',         icon: 'home',         set: 'F', route: '/(main)/dashboard' },
      { label: 'Freight Forecast',  icon: 'trending-up',  set: 'F', route: '/(main)/forecast' },
      { label: 'Market Entry',      icon: 'chart-line',   set: 'M', route: '/(main)/market-entry' },
      { label: 'Risk Analysis',     icon: 'shield-alert', set: 'M', route: '/(main)/risk' },
      { label: 'Alerts',            icon: 'bell',         set: 'F', route: '/(main)/alerts' },
    ],
  },
  {
    label: 'Decision Tools',
    items: [
      { label: 'Vessel Optimizer',   icon: 'ship-wheel',  set: 'M', route: '/(main)/optimizer' },
      { label: 'TCE Calculator',     icon: 'dollar-sign', set: 'F', route: '/(main)/waste' },
      { label: 'Scenario Simulator', icon: 'cpu',         set: 'F', route: '/(main)/simulator' },
      { label: 'Vessel Classes',     icon: 'package',     set: 'F', route: '/(main)/vessels' },
    ],
  },
  {
    label: 'Data & Operations',
    items: [
      { label: 'Ports & Routes',  icon: 'map',          set: 'F', route: '/(main)/routes' },
      { label: 'Origins & Data',  icon: 'globe',        set: 'F', route: '/(main)/policy' },
      { label: 'Reports',         icon: 'file-text',    set: 'F', route: '/(main)/reports' },
      { label: 'Statistics',      icon: 'bar-chart-2',  set: 'F', route: '/(main)/stats' },
    ],
  },
  {
    label: 'Account',
    items: [
      { label: 'Profile',  icon: 'user',     set: 'F', route: '/(main)/profile' },
      { label: 'Settings', icon: 'settings', set: 'F', route: '/(main)/settings' },
    ],
  },
] as const;

function NavIcon({ name, set, color }: { name: string; set: 'F' | 'M'; color: string }) {
  return set === 'F'
    ? <Feather name={name as any} size={15} color={color} />
    : <MaterialCommunityIcons name={name as any} size={15} color={color} />;
}

export default function Sidebar() {
  const pathname = usePathname();
  const { colors } = useTheme();

  return (
    <View style={[styles.container, {
      backgroundColor: colors.sidebar,
      borderRightColor: colors.sidebarBorder,
      shadowColor: colors.shadowMd,
    }]}>
      {/* Brand */}
      <View style={styles.brand}>
        <View style={[styles.brandMark, { backgroundColor: colors.deepAccent }]}>
          <Text style={styles.brandMarkText}>F</Text>
        </View>
        <View>
          <Text style={[styles.brandName, { color: colors.text }]}>FREYNA</Text>
          <Text style={[styles.brandSub, { color: colors.textMuted }]}>Freight Intelligence</Text>
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: colors.divider }]} />

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {NAV_GROUPS.map((group) => (
          <View key={group.label} style={styles.group}>
            <Text style={[styles.groupLabel, { color: colors.textMuted }]}>{group.label}</Text>
            {group.items.map((item) => {
              const isActive = pathname === item.route;
              return (
                <Pressable
                  key={item.label}
                  onPress={() => router.push(item.route)}
                  style={({ pressed }) => [
                    styles.navItem,
                    isActive && [styles.navItemActive, { backgroundColor: colors.navActive }],
                    !isActive && pressed && { backgroundColor: colors.navHover },
                  ]}
                >
                  <View style={[
                    styles.iconWrap,
                    { backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : colors.primary + '18' },
                  ]}>
                    <NavIcon
                      name={item.icon}
                      set={item.set as 'F' | 'M'}
                      color={isActive ? '#FFFFFF' : colors.navIcon}
                    />
                  </View>
                  <Text style={[
                    styles.navLabel,
                    { color: isActive ? '#FFFFFF' : colors.navText },
                    isActive && styles.navLabelActive,
                  ]}>
                    {item.label}
                  </Text>
                  {isActive && <View style={styles.activePip} />}
                </Pressable>
              );
            })}
          </View>
        ))}
      </ScrollView>

      {/* Footer */}
      <View style={[styles.sidebarFooter, { borderTopColor: colors.divider }]}>
        <View style={[styles.statusPill, { backgroundColor: colors.success + '18', borderColor: colors.success }]}>
          <View style={[styles.statusDot, { backgroundColor: colors.success }]} />
          <Text style={[styles.statusText, { color: colors.success }]}>System Online</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 248,
    borderRightWidth: 1,
    paddingTop: 18,
    paddingBottom: 0,
    shadowOffset: { width: 3, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 6,
  },
  brand: {
    flexDirection: 'row', alignItems: 'center', gap: 11,
    paddingHorizontal: 16, marginBottom: 14,
  },
  brandMark: {
    width: 40, height: 40, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  brandMarkText: { color: '#FFFFFF', fontSize: 20, fontWeight: '800' },
  brandName: { fontSize: 18, fontWeight: '800', letterSpacing: 0.3 },
  brandSub: { fontSize: 10, fontWeight: '600', marginTop: 1 },
  divider: { height: 1, marginHorizontal: 16, marginBottom: 10 },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 10, paddingBottom: 8 },
  group: { marginBottom: 6 },
  groupLabel: {
    fontSize: 9, fontWeight: '700', letterSpacing: 1.3, textTransform: 'uppercase',
    marginLeft: 10, marginTop: 10, marginBottom: 4,
  },
  navItem: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 10, paddingVertical: 9, borderRadius: 12,
  },
  navItemActive: { shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 6, elevation: 3 },
  iconWrap: { width: 28, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  navLabel: { flex: 1, fontSize: 13, fontWeight: '600' },
  navLabelActive: { fontWeight: '700' },
  activePip: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.7)' },
  sidebarFooter: {
    borderTopWidth: 1, paddingHorizontal: 16, paddingVertical: 12,
  },
  statusPill: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 10, paddingVertical: 7, borderRadius: 20, borderWidth: 1,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 11, fontWeight: '700' },
});
