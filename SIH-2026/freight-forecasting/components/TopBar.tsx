import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useTheme } from '../constants/theme';

const roleOptions = [
  'Administrator', 'Logistics Manager', 'Operations Manager',
  'Fleet Manager', 'Chartering Manager', 'Freight Analyst',
  'Port Operator', 'Risk Analyst', 'Viewer',
] as const;

export default function TopBar({ role, onRoleChange }: { role: string; onRoleChange: (v: string) => void }) {
  const { colors } = useTheme();
  const [now, setNow] = useState(new Date());
  const [roleOpen, setRoleOpen] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const dateLabel = useMemo(() => now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }), [now]);
  const timeLabel = useMemo(() => now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }), [now]);

  return (
    <View style={[styles.container, { backgroundColor: colors.topBar, borderBottomColor: colors.topBarBorder, shadowColor: colors.shadow }]}>
      <View style={styles.leftBlock}>
        <Text style={[styles.eyebrow, { color: colors.primary }]}>FREYNA Freight Intelligence & Analytics</Text>
        <Text style={[styles.title, { color: colors.text }]}>Command Center</Text>
        <View style={styles.metaRow}>
          <View style={[styles.metaChip, { backgroundColor: colors.cardAlt, borderColor: colors.border }]}>
            <Text style={[styles.metaLabel, { color: colors.textSecondary }]}>Weather</Text>
            <Text style={[styles.metaValue, { color: colors.text }]}>18 kt / 15°C</Text>
          </View>
          <View style={[styles.metaChip, { backgroundColor: colors.cardAlt, borderColor: colors.border }]}>
            <Text style={[styles.metaLabel, { color: colors.textSecondary }]}>System</Text>
            <Text style={[styles.metaValue, { color: colors.success }]}>Operational</Text>
          </View>
        </View>
      </View>

      <View style={styles.rightBlock}>
        <View style={[styles.searchWrap, { backgroundColor: colors.inputBg, borderColor: colors.primary }]}>
          <Feather name="search" size={14} color={colors.primary} />
          <TextInput
            placeholder="Search route, vessel, port…"
            placeholderTextColor={colors.placeholder}
            style={[styles.searchInput, { color: colors.inputText }]}
          />
        </View>

        <View style={[styles.metaChip, { backgroundColor: colors.cardAlt, borderColor: colors.border }]}>
          <Text style={[styles.metaLabel, { color: colors.textSecondary }]}>Date</Text>
          <Text style={[styles.metaValue, { color: colors.text }]}>{dateLabel}</Text>
        </View>

        <View style={[styles.metaChip, { backgroundColor: colors.cardAlt, borderColor: colors.border }]}>
          <Text style={[styles.metaLabel, { color: colors.textSecondary }]}>Time</Text>
          <Text style={[styles.metaValue, { color: colors.text }]}>{timeLabel}</Text>
        </View>

        <Pressable
          onPress={() => router.push('/(main)/alerts')}
          style={({ pressed }) => [styles.alertBtn, { backgroundColor: colors.cardAlt, borderColor: colors.primary, opacity: pressed ? 0.8 : 1 }]}
        >
          <Feather name="bell" size={16} color={colors.primary} />
          <View style={[styles.alertDot, { backgroundColor: colors.deepAccent }]} />
        </Pressable>

        <View style={[styles.userWrap, { backgroundColor: colors.cardAlt, borderColor: colors.border }]}>
          <Pressable onPress={() => router.push('/(main)/profile')} style={[styles.avatar, { backgroundColor: colors.deepAccent }]}>
            <Text style={styles.avatarText}>MS</Text>
          </Pressable>
          <View>
            <Text style={[styles.userName, { color: colors.text }]}>Mahi Sharma</Text>
            <Pressable onPress={() => setRoleOpen(v => !v)} style={styles.roleBtn}>
              <Text style={[styles.roleText, { color: colors.primary }]}>{role}</Text>
              <Text style={[styles.roleChevron, { color: colors.primary }]}>{roleOpen ? '▴' : '▾'}</Text>
            </Pressable>
          </View>
        </View>
      </View>

      {roleOpen && (
        <View style={[styles.roleMenu, { backgroundColor: colors.card, borderColor: colors.border, shadowColor: colors.shadow }]}>
          <ScrollView style={{ maxHeight: 260 }} showsVerticalScrollIndicator={false}>
            {roleOptions.map(opt => (
              <Pressable
                key={opt}
                onPress={() => { onRoleChange(opt); setRoleOpen(false); }}
                style={({ pressed }) => [styles.roleOption, pressed && { backgroundColor: colors.navHover }]}
              >
                <Text style={[styles.roleOptionText, { color: opt === role ? colors.primary : colors.text }]}>{opt}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 16,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 16,
    borderBottomWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
    zIndex: 10,
  },
  leftBlock: { flex: 1, gap: 10 },
  eyebrow: { fontSize: 11, letterSpacing: 1.4, textTransform: 'uppercase', fontWeight: '700' },
  title: { fontSize: 24, fontWeight: '800' },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  metaChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  metaLabel: { fontSize: 9, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 3 },
  metaValue: { fontSize: 12, fontWeight: '700' },
  rightBlock: { flexDirection: 'row', alignItems: 'center', gap: 10, flexWrap: 'wrap', justifyContent: 'flex-end' },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width: 240,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  searchInput: { flex: 1, fontSize: 13, fontWeight: '500' },
  alertBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  alertDot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    top: 6,
    right: 6,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  userWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#FFFFFF', fontWeight: '800', fontSize: 13 },
  userName: { fontSize: 12, fontWeight: '700' },
  roleBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  roleText: { fontSize: 10, fontWeight: '700' },
  roleChevron: { fontSize: 10 },
  roleMenu: {
    position: 'absolute',
    top: 100,
    right: 18,
    width: 220,
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 6,
    zIndex: 999,
    elevation: 20,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 16,
  },
  roleOption: { paddingHorizontal: 14, paddingVertical: 11 },
  roleOptionText: { fontSize: 13, fontWeight: '600' },
});
