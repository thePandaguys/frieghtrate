import React, { useState } from 'react';
import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import ScreenShell, { Card, InfoRow, SectionHeader } from '../../components/ScreenShell';
import { ThemeMode, useTheme } from '../../constants/theme';

export default function Settings() {
  const { mode, setMode, colors } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [marketAlerts, setMarketAlerts] = useState(true);
  const [riskAlerts, setRiskAlerts] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [animations, setAnimations] = useState(true);

  return (
    <ScreenShell title="Settings" subtitle="Configure intelligence, alerts and system preferences" badge="ACTIVE" badgeColor={colors.success}>
      {/* Theme */}
      <SectionHeader eyebrow="Appearance" title="Theme" />
      <Card>
        <Text style={[styles.themeDesc, { color: colors.text }]}>Choose how FREYNA looks across the application.</Text>
        <View style={styles.themeOptions}>
          {(['system', 'light', 'dark'] as ThemeMode[]).map(opt => (
            <TouchableOpacity
              key={opt}
              onPress={() => setMode(opt)}
              style={[styles.themeOption, {
                backgroundColor: mode === opt ? colors.primary : colors.cardAlt,
                borderColor: mode === opt ? colors.primary : colors.border,
              }]}
              activeOpacity={0.8}
            >
              <Text style={{ fontSize: 18 }}>{opt === 'system' ? '⚙️' : opt === 'light' ? '☀️' : '🌙'}</Text>
              <Text style={[styles.themeOptionText, { color: mode === opt ? '#FFFFFF' : colors.text }]}>
                {opt[0].toUpperCase() + opt.slice(1)}
              </Text>
              {mode === opt && <View style={styles.themeCheck}><Text style={{ color: '#FFFFFF', fontSize: 12 }}>✓</Text></View>}
            </TouchableOpacity>
          ))}
        </View>
      </Card>

      {/* Workspace */}
      <SectionHeader eyebrow="Preferences" title="Workspace" />
      <SettingCard icon="◈" title="Animations" description="Enable smooth transitions and intelligence motion" value={animations} onChange={setAnimations} />
      <Card style={styles.accentCard}>
        <View>
          <Text style={[styles.accentTitle, { color: colors.text }]}>Accent Color</Text>
          <Text style={[styles.accentDetail, { color: colors.textSecondary }]}>FREYNA Default</Text>
        </View>
        <View style={[styles.accentSwatch, { backgroundColor: colors.accent }]} />
      </Card>

      {/* Account */}
      <SectionHeader eyebrow="Account" title="Account Preferences" />
      <Card style={{ padding: 0 }}>
        {[
          { label: 'Language', value: 'English' },
          { label: 'Profile', value: 'Mahi Sharma · Logistics Manager' },
          { label: 'About App', value: 'FREYNA v1.0.0' },
        ].map(r => <InfoRow key={r.label} label={r.label} value={r.value} />)}
      </Card>

      {/* System */}
      <SectionHeader eyebrow="System" title="System Preferences" />
      <SettingCard icon="◉" title="Automatic Data Refresh" description="Keep market and vessel intelligence synchronized" value={autoRefresh} onChange={setAutoRefresh} />
      <SettingCard icon="◌" title="Notifications" description="Receive important system and intelligence updates" value={notifications} onChange={setNotifications} />

      {/* Alerts */}
      <SectionHeader eyebrow="Intelligence" title="Alert Preferences" />
      <SettingCard icon="↗" title="Market Alerts" description="Notify when significant freight-rate movements occur" value={marketAlerts} onChange={setMarketAlerts} />
      <SettingCard icon="!" title="Risk Alerts" description="Notify when operational or route risks are detected" value={riskAlerts} onChange={setRiskAlerts} />

      {/* AI Model */}
      <SectionHeader eyebrow="AI Engine" title="Model Configuration" />
      <Card style={[styles.modelCard, { borderColor: colors.primary }]}>
        <View style={styles.modelHeader}>
          <View>
            <Text style={[styles.modelEyebrow, { color: colors.textSecondary }]}>ACTIVE MODEL</Text>
            <Text style={[styles.modelTitle, { color: colors.text }]}>FREYNA Forecast Engine</Text>
          </View>
          <View style={[styles.onlineBadge, { backgroundColor: colors.success + '18', borderColor: colors.success }]}>
            <View style={[styles.onlineDot, { backgroundColor: colors.success }]} />
            <Text style={[styles.onlineText, { color: colors.success }]}>ONLINE</Text>
          </View>
        </View>
        <View style={[styles.modelDivider, { backgroundColor: colors.divider }]} />
        {[
          { label: 'MODEL VERSION', value: 'OFX-4.2' },
          { label: 'FORECAST HORIZON', value: '40 DAYS' },
          { label: 'CURRENT ACCURACY', value: '91.8%' },
          { label: 'LAST TRAINED', value: '26 AUG 2026' },
        ].map(r => <InfoRow key={r.label} label={r.label} value={r.value} />)}
      </Card>

      {/* Data Sources */}
      <SectionHeader eyebrow="Data" title="Connected Sources" />
      {[
        { title: 'Freight Market Feed', detail: 'Live market intelligence' },
        { title: 'Vessel Availability', detail: 'Fleet and vessel data' },
        { title: 'Route Intelligence', detail: 'Port and route information' },
        { title: 'Weather Intelligence', detail: 'Environmental conditions' },
      ].map(s => (
        <Card key={s.title} style={styles.sourceCard}>
          <View style={[styles.sourceDot, { backgroundColor: colors.success }]} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.sourceTitle, { color: colors.text }]}>{s.title}</Text>
            <Text style={[styles.sourceDetail, { color: colors.textSecondary }]}>{s.detail}</Text>
          </View>
          <View style={[styles.connectedBadge, { backgroundColor: colors.success + '18', borderColor: colors.success }]}>
            <Text style={[styles.connectedText, { color: colors.success }]}>CONNECTED</Text>
          </View>
        </Card>
      ))}

      {/* Security */}
      <SectionHeader eyebrow="Security" title="Account & Security" />
      {[
        { title: 'Privacy & Data', desc: 'Manage data permissions and system privacy' },
        { title: 'Security', desc: 'Authentication and account protection' },
      ].map(a => (
        <Card key={a.title} style={styles.actionCard}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.actionTitle, { color: colors.text }]}>{a.title}</Text>
            <Text style={[styles.actionDesc, { color: colors.textSecondary }]}>{a.desc}</Text>
          </View>
          <Text style={[styles.arrow, { color: colors.primary }]}>→</Text>
        </Card>
      ))}

      <TouchableOpacity
        style={[styles.resetBtn, { backgroundColor: colors.cardAlt, borderColor: colors.border }]}
        activeOpacity={0.8}
      >
        <Text style={[styles.resetText, { color: colors.textSecondary }]}>RESET SYSTEM PREFERENCES</Text>
      </TouchableOpacity>
    </ScreenShell>
  );
}

function SettingCard({ icon, title, description, value, onChange }: { icon: string; title: string; description: string; value: boolean; onChange: (v: boolean) => void }) {
  const { colors } = useTheme();
  return (
    <Card style={styles.settingCard}>
      <View style={[styles.settingIcon, { backgroundColor: colors.primary + '18', borderColor: colors.primary }]}>
        <Text style={[styles.settingIconText, { color: colors.primary }]}>{icon}</Text>
      </View>
      <View style={{ flex: 1, paddingRight: 8 }}>
        <Text style={[styles.settingTitle, { color: colors.text }]}>{title}</Text>
        <Text style={[styles.settingDesc, { color: colors.textSecondary }]}>{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: colors.divider, true: colors.primary + '60' }}
        thumbColor={value ? colors.primary : colors.textSecondary}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  themeDesc: { fontSize: 13, marginBottom: 14 },
  themeOptions: { flexDirection: 'row', gap: 10 },
  themeOption: { flex: 1, alignItems: 'center', paddingVertical: 14, borderRadius: 12, borderWidth: 1.5, gap: 6 },
  themeOptionText: { fontSize: 13, fontWeight: '700' },
  themeCheck: { position: 'absolute', top: 6, right: 6 },
  accentCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  accentTitle: { fontSize: 14, fontWeight: '700' },
  accentDetail: { fontSize: 12, marginTop: 3 },
  accentSwatch: { width: 28, height: 28, borderRadius: 14 },
  modelCard: { borderWidth: 2 },
  modelHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  modelEyebrow: { fontSize: 9, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  modelTitle: { fontSize: 15, fontWeight: '800', marginTop: 3 },
  onlineBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20, borderWidth: 1 },
  onlineDot: { width: 6, height: 6, borderRadius: 3 },
  onlineText: { fontSize: 11, fontWeight: '700' },
  modelDivider: { height: 1, marginBottom: 4 },
  sourceCard: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14 },
  sourceDot: { width: 8, height: 8, borderRadius: 4 },
  sourceTitle: { fontSize: 13, fontWeight: '700' },
  sourceDetail: { fontSize: 11, marginTop: 2 },
  connectedBadge: { paddingHorizontal: 8, paddingVertical: 5, borderRadius: 20, borderWidth: 1 },
  connectedText: { fontSize: 10, fontWeight: '700' },
  actionCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  actionTitle: { fontSize: 14, fontWeight: '700' },
  actionDesc: { fontSize: 12, marginTop: 3 },
  arrow: { fontSize: 20 },
  resetBtn: { height: 48, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center', marginTop: 4 },
  resetText: { fontSize: 12, fontWeight: '700', letterSpacing: 0.5 },
  settingCard: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  settingIcon: { width: 40, height: 40, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  settingIconText: { fontSize: 16, fontWeight: '700' },
  settingTitle: { fontSize: 13, fontWeight: '700' },
  settingDesc: { fontSize: 11, marginTop: 3 },
});
