import React from 'react';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useTheme } from '../constants/theme';

const stats = [
  { label: 'Current Freight', value: '$1.24M', delta: '+3.2%', accent: '#39D8E8' },
  { label: 'Market Sentiment', value: 'Bullish', delta: '+12.1%', accent: '#7AE6FF' },
  { label: 'Fuel Price', value: '$845/mt', delta: '-4.6%', accent: '#7DE8C5' },
  { label: 'Fleet Utilization', value: '82.4%', delta: '+5.1%', accent: '#63D2FF' },
  { label: 'Port Congestion', value: '38%', delta: 'Low', accent: '#5FE3C2' },
  { label: 'Available Vessels', value: '24', delta: '6 ready', accent: '#73E0FF' },
] as const;

export default function MarketCards() {
  const { width } = useWindowDimensions();
  const { colors } = useTheme();
  const isMobile = width < 768;

  return (
    <View style={styles.grid}>
      {stats.map((item) => (
        <View key={item.label} style={[styles.card, isMobile && styles.cardMobile, { backgroundColor: colors.card, borderColor: colors.tint }]}>
          <View style={[styles.accentBar, { backgroundColor: item.accent }]} />
          <Text style={styles.label}>{item.label}</Text>
          <Text style={[styles.value, { color: colors.text }]}>{item.value}</Text>
          <Text style={[styles.delta, { color: item.accent }]}>{item.delta}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    marginTop: 18,
    marginBottom: 18,
  },
  card: {
    width: '31.5%',
    minWidth: 180,
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 18,
    backgroundColor: 'rgba(12, 31, 41, 0.96)',
    borderWidth: 1,
    borderColor: 'rgba(118, 146, 168, 0.18)',
    position: 'relative',
    overflow: 'hidden',
  },
  cardMobile: {
    width: '100%',
    minWidth: 0,
    flex: 0,
    flexBasis: '100%',
  },
  accentBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
  },
  label: {
    color: '#7A9EB7',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  value: {
    color: '#EAF7FF',
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 6,
  },
  delta: {
    fontSize: 12,
    fontWeight: '700',
  },
});
