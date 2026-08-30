import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../constants/theme';

export default function RecommendationCard({
  vessel,
  confidence,
  eta,
  fuelCost,
  risk,
  expectedFreight,
  trend,
  reason,
}: {
  vessel: string;
  confidence: string;
  eta: string;
  fuelCost: string;
  risk: string;
  expectedFreight: string;
  trend: string;
  reason: string;
}) {
  const { colors } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, shadowColor: colors.shadow }]}>
      <View style={styles.headerRow}>
        <View>
          <Text style={[styles.eyebrow, { color: colors.primary }]}>AI Recommendation</Text>
          <Text style={[styles.title, { color: colors.text }]}>Voyage Optimization</Text>
        </View>
        <View style={[styles.badge, { backgroundColor: colors.deepAccent + '18', borderColor: colors.deepAccent + '40' }]}>
          <Text style={[styles.badgeText, { color: colors.deepAccent }]}>{confidence}</Text>
        </View>
      </View>

      <View style={styles.metricsGrid}>
        <InfoRow label="Recommended Vessel" value={vessel} />
        <InfoRow label="ETA" value={eta} />
        <InfoRow label="Fuel Cost" value={fuelCost} />
        <InfoRow label="Risk" value={risk} />
        <InfoRow label="Expected Freight" value={expectedFreight} />
        <InfoRow label="Market Trend" value={trend} />
      </View>

      <View style={[styles.reasonWrap, { backgroundColor: colors.cardAlt, borderColor: colors.border }]}>
        <Text style={[styles.reasonTitle, { color: colors.primary }]}>AI Reason</Text>
        <Text style={[styles.reasonText, { color: colors.textSecondary }]}>{reason}</Text>
      </View>

      <TouchableOpacity style={[styles.button, { backgroundColor: colors.deepAccent }]} activeOpacity={0.9}>
        <Text style={[styles.buttonText, { color: '#FFFFFF' }]}>View Full Analysis</Text>
      </TouchableOpacity>
    </View>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.infoRow, { borderBottomColor: colors.divider }]}>
      <Text style={[styles.infoLabel, { color: colors.textMuted }]}>{label}</Text>
      <Text style={[styles.infoValue, { color: colors.text }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 22,
    borderWidth: 1,
    padding: 20,
    shadowOpacity: 1,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 18,
  },
  eyebrow: {
    fontSize: 11,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
    fontWeight: '700',
    marginBottom: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  badge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '800',
  },
  metricsGrid: {
    gap: 12,
    marginBottom: 18,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 8,
    borderBottomWidth: 1,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'right',
    flexShrink: 1,
  },
  reasonWrap: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    marginBottom: 18,
  },
  reasonTitle: {
    fontSize: 11,
    letterSpacing: 1.3,
    textTransform: 'uppercase',
    fontWeight: '700',
    marginBottom: 8,
  },
  reasonText: {
    fontSize: 13,
    lineHeight: 20,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '800',
  },
});
