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

  return (
    <View style={[styles.panel, isMobile && styles.panelMobile, { backgroundColor: colors.card, borderColor: colors.tint }]}>
      <Text style={[styles.heading, { color: colors.text }]}>Intelligence Feed</Text>

      {isMobile ? (
        <View style={styles.list}>
          {alerts.map((alert, index) => (
            <View key={`${alert.title}-${index}`} style={[styles.card, { borderColor: colors.tint }]}>
              <View style={styles.topRow}>
                <Text style={styles.kind}>{alert.kind}</Text>
                <Text style={[styles.level, getLevelStyle(alert.level)]}>{alert.level}</Text>
              </View>
              <Text style={[styles.title, { color: colors.text }]}>{alert.title}</Text>
              <Text style={styles.detail}>{alert.detail}</Text>
            </View>
          ))}
        </View>
      ) : (
        <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
          {alerts.map((alert, index) => (
            <View key={`${alert.title}-${index}`} style={[styles.card, { borderColor: colors.tint }]}>
              <View style={styles.topRow}>
                <Text style={styles.kind}>{alert.kind}</Text>
                <Text style={[styles.level, getLevelStyle(alert.level)]}>{alert.level}</Text>
              </View>
              <Text style={[styles.title, { color: colors.text }]}>{alert.title}</Text>
              <Text style={styles.detail}>{alert.detail}</Text>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

function getLevelStyle(level: string) {
  if (level === 'Critical') return { color: '#FF6B7A' };
  if (level === 'Warning') return { color: '#FFBE5C' };
  if (level === 'Positive') return { color: '#7DE8C5' };
  return { color: '#39D8E8' };
}

const styles = StyleSheet.create({
  panel: {
    width: '100%',
    backgroundColor: 'rgba(9, 23, 32, 0.96)',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(121, 152, 171, 0.18)',
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
  },
  panelMobile: {
    marginTop: 18,
  },
  heading: {
    color: '#EAF7FF',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 14,
  },
  list: {
    maxHeight: 760,
  },
  card: {
    backgroundColor: 'rgba(14, 33, 43, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(121, 152, 171, 0.14)',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  kind: {
    color: '#39D8E8',
    fontSize: 10,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  level: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  title: {
    color: '#EAF7FF',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 6,
  },
  detail: {
    color: '#9CB7C8',
    fontSize: 12,
    lineHeight: 18,
  },
});
