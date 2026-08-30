import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import ScreenShell, { Card, InfoRow, SectionHeader } from '../../components/ScreenShell';
import { useTheme } from '../../constants/theme';

export default function Profile() {
  const { colors } = useTheme();

  return (
    <ScreenShell title="Profile" subtitle="Account identity and intelligence preferences" badge="ACTIVE" badgeColor={colors.success}>
      {/* Profile Card */}
      <Card style={styles.profileCard}>
        <View style={[styles.avatar, { backgroundColor: colors.deepAccent }]}>
          <Text style={styles.avatarText}>M</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.name, { color: colors.text }]}>Mahi Sharma</Text>
          <Text style={[styles.role, { color: colors.primary }]}>FREIGHT INTELLIGENCE OPERATOR</Text>
          <Text style={[styles.org, { color: colors.textSecondary }]}>FREYNA Logistics Division</Text>
        </View>
        <TouchableOpacity style={[styles.editBtn, { backgroundColor: colors.primary + '18', borderColor: colors.primary }]} activeOpacity={0.8}>
          <Text style={[styles.editText, { color: colors.primary }]}>EDIT</Text>
        </TouchableOpacity>
      </Card>

      {/* Access */}
      <SectionHeader eyebrow="Account Overview" title="Access & Identity" />
      <Card style={{ padding: 0 }}>
        {[
          { label: 'OPERATOR ID', value: 'OI-2048-TSK' },
          { label: 'ACCESS LEVEL', value: 'INTELLIGENCE OPERATOR' },
          { label: 'REGION', value: 'GLOBAL MARITIME' },
          { label: 'LAST ACTIVE', value: '26 AUG 2026 • 23:48' },
        ].map(r => (
          <InfoRow key={r.label} label={r.label} value={r.value} />
        ))}
      </Card>

      {/* Metrics */}
      <SectionHeader eyebrow="Operator Activity" title="Intelligence Usage" right="THIS MONTH" />
      <View style={styles.metricsRow}>
        {[{ v: '42', l: 'VOYAGES' }, { v: '18', l: 'REPORTS' }, { v: '96%', l: 'ACCURACY', positive: true }].map(m => (
          <Card key={m.l} style={styles.metricCard}>
            <Text style={[styles.metricValue, { color: m.positive ? colors.success : colors.text }]}>{m.v}</Text>
            <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>{m.l}</Text>
          </Card>
        ))}
      </View>

      {/* Preferences */}
      <SectionHeader eyebrow="Intelligence Preferences" title="System Configuration" />
      {[
        { title: 'Market Intelligence', desc: 'Freight movement and market signals' },
        { title: 'Risk Monitoring', desc: 'Operational and voyage risk alerts' },
        { title: 'Environmental Intelligence', desc: 'Waste and environmental indicators' },
        { title: 'AI Recommendations', desc: 'Automated chartering recommendations' },
      ].map(p => (
        <Card key={p.title} style={styles.prefCard}>
          <View style={[styles.prefBar, { backgroundColor: colors.primary }]} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.prefTitle, { color: colors.text }]}>{p.title}</Text>
            <Text style={[styles.prefDesc, { color: colors.textSecondary }]}>{p.desc}</Text>
          </View>
          <Switch
            value={true}
            trackColor={{ false: colors.divider, true: colors.primary + '60' }}
            thumbColor={colors.primary}
          />
        </Card>
      ))}

      {/* Security */}
      <SectionHeader eyebrow="Security" title="Account Security" />
      <Card style={[styles.securityCard, { borderColor: colors.success }]}>
        <View style={[styles.securityIcon, { backgroundColor: colors.success + '18' }]}>
          <Text style={{ fontSize: 22 }}>🔒</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.securityTitle, { color: colors.text }]}>Account Protected</Text>
          <Text style={[styles.securityDesc, { color: colors.textSecondary }]}>Your intelligence workspace is secured with authenticated access.</Text>
        </View>
        <View style={[styles.secureBadge, { backgroundColor: colors.success + '18', borderColor: colors.success }]}>
          <Text style={[styles.secureText, { color: colors.success }]}>SECURE</Text>
        </View>
      </Card>

      {/* Actions */}
      <TouchableOpacity
        style={[styles.actionCard, { backgroundColor: colors.card, borderColor: colors.border }]}
        onPress={() => router.push('/(main)/settings')}
        activeOpacity={0.8}
      >
        <View style={[styles.actionBar, { backgroundColor: colors.primary }]} />
        <View style={{ flex: 1 }}>
          <Text style={[styles.actionTitle, { color: colors.text }]}>Account Settings</Text>
          <Text style={[styles.actionDesc, { color: colors.textSecondary }]}>Manage account and application preferences</Text>
        </View>
        <Text style={[styles.arrow, { color: colors.primary }]}>→</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.logoutBtn, { backgroundColor: '#FFF0F0', borderColor: '#FFCDD2' }]}
        activeOpacity={0.8}
      >
        <Text style={[styles.logoutText, { color: '#E53E3E' }]}>SIGN OUT</Text>
      </TouchableOpacity>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  profileCard: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  avatar: { width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#FFFFFF', fontSize: 24, fontWeight: '800' },
  name: { fontSize: 18, fontWeight: '800' },
  role: { fontSize: 10, fontWeight: '700', letterSpacing: 0.5, marginTop: 3 },
  org: { fontSize: 12, marginTop: 3 },
  editBtn: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20, borderWidth: 1 },
  editText: { fontSize: 11, fontWeight: '700' },
  metricsRow: { flexDirection: 'row', gap: 10 },
  metricCard: { flex: 1, alignItems: 'center', paddingVertical: 16 },
  metricValue: { fontSize: 24, fontWeight: '800' },
  metricLabel: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 5 },
  prefCard: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14 },
  prefBar: { width: 4, height: 32, borderRadius: 2 },
  prefTitle: { fontSize: 13, fontWeight: '700' },
  prefDesc: { fontSize: 11, marginTop: 3 },
  securityCard: { flexDirection: 'row', alignItems: 'center', gap: 14, borderWidth: 1.5 },
  securityIcon: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  securityTitle: { fontSize: 14, fontWeight: '700' },
  securityDesc: { fontSize: 12, lineHeight: 18, marginTop: 3 },
  secureBadge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20, borderWidth: 1 },
  secureText: { fontSize: 11, fontWeight: '700' },
  actionCard: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderRadius: 14, borderWidth: 1, marginBottom: 10 },
  actionBar: { width: 4, height: 32, borderRadius: 2 },
  actionTitle: { fontSize: 14, fontWeight: '700' },
  actionDesc: { fontSize: 12, marginTop: 3 },
  arrow: { fontSize: 20 },
  logoutBtn: { height: 48, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center', marginTop: 4 },
  logoutText: { fontSize: 13, fontWeight: '800', letterSpacing: 0.5 },
});
