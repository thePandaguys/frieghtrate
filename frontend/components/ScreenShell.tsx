import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../constants/theme';

interface ScreenShellProps {
  title: string;
  subtitle?: string;
  breadcrumb?: string;
  badge?: string;
  badgeColor?: string;
  children: React.ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
}

export default function ScreenShell({
  title, subtitle, breadcrumb, badge, badgeColor, children, contentStyle,
}: ScreenShellProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.content, contentStyle]}>
        {/* Breadcrumb */}
        <View style={styles.breadcrumbRow}>
          <Pressable onPress={() => router.push('/(main)/dashboard')}>
            <Text style={[styles.breadcrumbLink, { color: colors.primary }]}>Dashboard</Text>
          </Pressable>
          <Text style={[styles.breadcrumbSep, { color: colors.textMuted }]}> › </Text>
          <Text style={[styles.breadcrumbCurrent, { color: colors.textMuted }]}>{breadcrumb ?? title}</Text>
        </View>

        {/* Page Header */}
        <View style={[styles.pageHeader, { backgroundColor: colors.card, borderColor: colors.border, shadowColor: colors.shadow }]}>
          <View style={[styles.headerAccent, { backgroundColor: colors.accent }]} />
          <View style={styles.pageHeaderInner}>
            <View style={styles.pageHeaderLeft}>
              <Text style={[styles.eyebrow, { color: colors.primary }]}>FREYNA FREIGHT INTELLIGENCE</Text>
              <Text style={[styles.pageTitle, { color: colors.text }]}>{title}</Text>
              {subtitle ? <Text style={[styles.pageSubtitle, { color: colors.textSecondary }]}>{subtitle}</Text> : null}
            </View>
            {badge ? (
              <View style={[styles.badge, {
                backgroundColor: (badgeColor ?? colors.success) + '18',
                borderColor: badgeColor ?? colors.success,
              }]}>
                <View style={[styles.badgeDot, { backgroundColor: badgeColor ?? colors.success }]} />
                <Text style={[styles.badgeText, { color: badgeColor ?? colors.success }]}>{badge}</Text>
              </View>
            ) : null}
          </View>
        </View>

        {children}

        <Text style={[styles.footer, { color: colors.textMuted }]}>FREYNA • {title.toUpperCase()}</Text>
      </ScrollView>
    </View>
  );
}

// ─── Reusable Sub-Components ─────────────────────────────────────────────────

export function SectionHeader({ eyebrow, title, right }: { eyebrow: string; title: string; right?: string }) {
  const { colors } = useTheme();
  return (
    <View style={styles.sectionHeader}>
      <View>
        <Text style={[styles.sectionEyebrow, { color: colors.primary }]}>{eyebrow}</Text>
        <Text style={[styles.sectionTitle, { color: colors.deepAccent }]}>{title}</Text>
      </View>
      {right ? <Text style={[styles.sectionRight, { color: colors.textMuted }]}>{right}</Text> : null}
    </View>
  );
}

export function Card({ children, style, accent }: { children: React.ReactNode; style?: StyleProp<ViewStyle>; accent?: boolean }) {
  const { colors } = useTheme();
  return (
    <View style={[
      styles.card,
      {
        backgroundColor: accent ? colors.cardHighlight : colors.card,
        borderColor: accent ? colors.accent + '40' : colors.border,
        shadowColor: colors.shadow,
      },
      style,
    ]}>
      {children}
    </View>
  );
}

export function PrimaryButton({ label, onPress, loading, icon, variant = 'orange' }: {
  label: string; onPress: () => void; loading?: boolean; icon?: string; variant?: 'orange' | 'cyan';
}) {
  const { colors } = useTheme();
  const bg = variant === 'cyan' ? colors.primary : colors.deepAccent;
  return (
    <Pressable
      onPress={onPress}
      disabled={loading}
      style={({ pressed }) => [styles.primaryBtn, { backgroundColor: bg, opacity: pressed || loading ? 0.85 : 1 }]}
    >
      {icon ? <Feather name={icon as any} size={16} color="#FFFFFF" style={{ marginRight: 8 }} /> : null}
      <Text style={styles.primaryBtnText}>{loading ? 'Processing…' : label}</Text>
    </Pressable>
  );
}

export function StatusBadge({ label, color }: { label: string; color: string }) {
  return (
    <View style={[styles.statusBadge, { backgroundColor: color + '18', borderColor: color }]}>
      <View style={[styles.statusDot, { backgroundColor: color }]} />
      <Text style={[styles.statusBadgeText, { color }]}>{label}</Text>
    </View>
  );
}

export function InfoRow({ label, value, valueColor }: { label: string; value: string; valueColor?: string }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.infoRow, { borderBottomColor: colors.divider }]}>
      <Text style={[styles.infoLabel, { color: colors.textMuted }]}>{label}</Text>
      <Text style={[styles.infoValue, { color: valueColor ?? colors.text }]}>{value}</Text>
    </View>
  );
}

export function ProgressBar({ value, color }: { value: number; color?: string }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.progressTrack, { backgroundColor: colors.divider }]}>
      <View style={[styles.progressFill, { width: `${Math.min(value, 100)}%`, backgroundColor: color ?? colors.primary }]} />
    </View>
  );
}

export function KPICard({ label, value, change, icon, color }: {
  label: string; value: string; change?: string; icon?: string; color?: string;
}) {
  const { colors } = useTheme();
  const c = color ?? colors.deepAccent;
  return (
    <Card style={styles.kpiCard}>
      <View style={styles.kpiTop}>
        <Text style={[styles.kpiLabel, { color: colors.textMuted }]}>{label}</Text>
        {icon ? (
          <View style={[styles.kpiIconWrap, { backgroundColor: c + '18' }]}>
            <Feather name={icon as any} size={14} color={c} />
          </View>
        ) : null}
      </View>
      <Text style={[styles.kpiValue, { color: c }]}>{value}</Text>
      {change ? <Text style={[styles.kpiChange, { color: change.startsWith('+') ? colors.success : colors.danger }]}>{change}</Text> : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 18, paddingTop: 20, paddingBottom: 48 },

  breadcrumbRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  breadcrumbLink: { fontSize: 13, fontWeight: '700' },
  breadcrumbSep: { fontSize: 13, marginHorizontal: 4 },
  breadcrumbCurrent: { fontSize: 13, fontWeight: '600' },

  pageHeader: {
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 20,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 3,
    flexDirection: 'row',
  },
  headerAccent: { width: 5, borderRadius: 0 },
  pageHeaderInner: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 18,
  },
  pageHeaderLeft: { flex: 1, paddingRight: 12 },
  eyebrow: { fontSize: 10, fontWeight: '700', letterSpacing: 1.4, textTransform: 'uppercase', marginBottom: 4 },
  pageTitle: { fontSize: 26, fontWeight: '800', letterSpacing: -0.3 },
  pageSubtitle: { fontSize: 13, lineHeight: 19, marginTop: 5 },

  badge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 10, paddingVertical: 7, borderRadius: 20, borderWidth: 1,
  },
  badgeDot: { width: 6, height: 6, borderRadius: 3 },
  badgeText: { fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },

  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end',
    marginTop: 22, marginBottom: 12,
  },
  sectionEyebrow: { fontSize: 10, fontWeight: '700', letterSpacing: 1.2, textTransform: 'uppercase' },
  sectionTitle: { fontSize: 19, fontWeight: '800', marginTop: 3, letterSpacing: -0.2 },
  sectionRight: { fontSize: 11, fontWeight: '600' },

  card: {
    borderRadius: 16, borderWidth: 1, padding: 16, marginBottom: 12,
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 1, shadowRadius: 8, elevation: 2,
  },

  primaryBtn: {
    height: 52, borderRadius: 14, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center', marginTop: 8,
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  primaryBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '800', letterSpacing: 0.5 },

  statusBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20, borderWidth: 1,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusBadgeText: { fontSize: 11, fontWeight: '700' },

  infoRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 13, borderBottomWidth: 1,
  },
  infoLabel: { fontSize: 12, fontWeight: '600', letterSpacing: 0.3 },
  infoValue: { fontSize: 13, fontWeight: '700', textAlign: 'right', maxWidth: '60%' },

  progressTrack: { height: 7, borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: 7, borderRadius: 4 },

  footer: { textAlign: 'center', fontSize: 11, fontWeight: '600', letterSpacing: 0.8, marginTop: 28 },

  kpiCard: { flex: 1, minHeight: 110 },
  kpiTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  kpiLabel: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, flex: 1 },
  kpiIconWrap: { width: 30, height: 30, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  kpiValue: { fontSize: 24, fontWeight: '800', letterSpacing: -0.5 },
  kpiChange: { fontSize: 12, fontWeight: '700', marginTop: 4 },
});
