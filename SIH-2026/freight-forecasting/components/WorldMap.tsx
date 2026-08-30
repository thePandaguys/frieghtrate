import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, G, Path, Polyline } from 'react-native-svg';
import { useTheme } from '../constants/theme';

const portPoints = [
  { name: 'Singapore', x: 275, y: 126 },
  { name: 'Rotterdam', x: 172, y: 96 },
  { name: 'Hamburg', x: 180, y: 88 },
  { name: 'Shanghai', x: 318, y: 108 },
  { name: 'Qingdao', x: 345, y: 92 },
  { name: 'Dubai', x: 228, y: 138 },
  { name: 'Los Angeles', x: 82, y: 120 },
];

export default function WorldMap() {
  const { colors } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.tint }]}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.eyebrow}>Global Shipping</Text>
          <Text style={[styles.title, { color: colors.text }]}>Live Trade Density</Text>
        </View>
        <Text style={styles.badge}>7 Corridors</Text>
      </View>

      <Svg width="100%" height={260} viewBox="0 0 420 260">
        <G>
          <Path
            d="M44 90 L78 68 L110 72 L150 54 L196 66 L224 90 L210 120 L172 116 L146 132 L100 124 L80 146 L50 130 Z"
            fill="rgba(27, 63, 81, 0.7)"
            stroke="rgba(121, 152, 171, 0.25)"
            strokeWidth={1}
          />
          <Path
            d="M270 70 L306 58 L336 66 L358 80 L370 92 L348 122 L312 124 L294 110 L262 102 Z"
            fill="rgba(27, 63, 81, 0.7)"
            stroke="rgba(121, 152, 171, 0.25)"
            strokeWidth={1}
          />
          <Path
            d="M214 138 L232 128 L252 133 L258 146 L246 170 L220 167 L208 152 Z"
            fill="rgba(27, 63, 81, 0.7)"
            stroke="rgba(121, 152, 171, 0.25)"
            strokeWidth={1}
          />
          <Path
            d="M92 122 L118 118 L130 132 L110 150 L86 144 Z"
            fill="rgba(27, 63, 81, 0.7)"
            stroke="rgba(121, 152, 171, 0.25)"
            strokeWidth={1}
          />

          <Polyline points="280,124 344,98 322,90 290,112" fill="none" stroke="#39D8E8" strokeWidth={2.5} strokeDasharray="6 8" opacity={0.7} />
          <Polyline points="170,92 178,88 226,126 278,126" fill="none" stroke="#39D8E8" strokeWidth={2.5} strokeDasharray="6 8" opacity={0.7} />
          <Polyline points="90,120 146,128 192,108 218,138" fill="none" stroke="#39D8E8" strokeWidth={2.5} strokeDasharray="6 8" opacity={0.7} />

          {portPoints.map((port) => (
            <G key={port.name}>
              <Circle cx={port.x} cy={port.y} r={7} fill="#39D8E8" />
              <Circle cx={port.x} cy={port.y} r={12} fill="rgba(57,216,232,0.18)" />
            </G>
          ))}
        </G>
      </Svg>

      <View style={styles.portLegend}>
        {portPoints.slice(0, 4).map((port) => (
          <Text key={port.name} style={styles.portName}>{port.name}</Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(10, 27, 37, 0.96)',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(121, 152, 171, 0.18)',
    padding: 18,
    marginTop: 18,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  eyebrow: {
    color: '#39D8E8',
    fontSize: 11,
    letterSpacing: 1.3,
    textTransform: 'uppercase',
    fontWeight: '700',
    marginBottom: 4,
  },
  title: {
    color: '#EAF7FF',
    fontSize: 18,
    fontWeight: '700',
  },
  badge: {
    color: '#9DECF7',
    fontSize: 12,
    fontWeight: '800',
    backgroundColor: 'rgba(57, 216, 232, 0.08)',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(57, 216, 232, 0.18)',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  portLegend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  portName: {
    color: '#A7CDE2',
    fontSize: 11,
    fontWeight: '600',
  },
});
