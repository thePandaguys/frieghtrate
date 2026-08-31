import React from 'react';
import { ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useTheme } from '../constants/theme';

const alerts = [
  { kind: 'AI Alert', title: 'Route anomaly', detail: 'Crosswind band increased across the North Sea corridor.', level: 'Critical' },
  { kind: 'Weather', title: 'Storm watch', detail: 'Squall cluster forming near the English Channel.', level: 'Watch' },
  { kind: 'Market News', title: 'Freight rebound', detail: 'Dry bulk index rising after port congestion relief.', level: 'Positive' },
  { kind: 'Port Delays', title: 'Hamburg yard backlog', detail: 'Berth dwell times extended by 21 hours.', level: 'Warning' },
  { kind: 'AIS Update', title: 'Vessel deviation', detail: 'Panamax candidate veered off planned corridor.', level: 'Watch' },
  { kind: 'Risk Alert', title: 'Insurance exposure', detail: 'Exposure risk elevated for coal routes in Q4.', level: 'Critical' },
];

export default function RightPanel() {
  const { width } = useWindowDimensions();
  const { colors } = useTheme();
  const isMobile = width < 768;

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'Critical':
        return { color: colors.danger, bg: colors.danger + '15' };
      case 'Warning':
        return { color: colors.warning, bg: colors.warning + '15' };
      case 'Positive':
        return { color: colors.success, bg: colors.success + '15' };
      default:
        return { color: colors.primary, bg: colors.primary + '15' };
    }
  };

  return (
    <View style={[styles.panel, isMobile && styles.panelMobile, { backgroundColor: colors.card, borderColor: colors.border, shadowColor: colors.shadow }]}>
      <View style={[styles.headingRow, { borderBottomColor: colors.divider }]}>
        <Text style={[styles.heading, { color: colors.text }]}>Live Operational Feed</Text>
        <View style={[styles.liveDot, { backgroundColor: colors.success }]} />
      </View>

      <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
        {alerts.map((alert, index) => {
          const badge = getLevelBadge(alert.level);
          return (
            <View key={`${alert.title}-${index}`} style={[styles.card, { backgroundColor: colors.cardAlt, borderColor: colors.border }]}>
              <View style={styles.topRow}>
                <Text style={[styles.kind, { color: colors.primary }]}>{alert.kind}</Text>
                <View style={[styles.levelPill, { backgroundColor: badge.bg, borderColor: badge.color + '40' }]}>
                  <Text style={[styles.levelText, { color: badge.color }]}>{alert.level.toUpperCase()}</Text>
                </View>
              </View>
              <Text style={[styles.title, { color: colors.text }]}>{alert.title}</Text>
              <Text style={[styles.detail, { color: colors.textSecondary }]}>{alert.detail}</Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  panelMobile: {
    width: '100%',
    marginTop: 16,
  },
  headingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 12,
    marginBottom: 12,
    borderBottomWidth: 1,
  },
  heading: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  list: {
    maxHeight: 560,
  },
  card: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 12,
    marginBottom: 10,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  kind: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  levelPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
  },
  levelText: {
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 4,
  },
  detail: {
    fontSize: 11,
    lineHeight: 16,
  },
});
