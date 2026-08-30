import React from 'react';
import { ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Svg, { Circle, Defs, G, Line, LinearGradient, Path, Rect, Stop, Text as SvgText } from 'react-native-svg';
import { useTheme } from '../constants/theme';

const freightTrend = [44, 53, 48, 61, 68, 72, 79, 84, 88];
const fuelTrend = [78, 74, 73, 69, 66, 62, 60, 57, 55];
const portCongestion = [42, 48, 52, 61, 57, 64, 59, 66, 62];
const heatmapData = [
  [1, 1, 2, 2, 3],
  [1, 2, 3, 3, 4],
  [2, 3, 4, 5, 3],
  [1, 2, 4, 3, 2],
  [2, 3, 5, 4, 2],
];

function buildLinePath(values: number[], width: number, height: number, padding: number) {
  const max = Math.max(...values) + 5;
  const min = Math.min(...values) - 5;
  const points = values.map((value, index) => {
    const x = padding + (index * (width - padding * 2)) / (values.length - 1);
    const ratio = (value - min) / (max - min || 1);
    const y = height - padding - ratio * (height - padding * 2);
    return { x, y };
  });

  const line = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');
  const area = `${line} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

  return { points, line, area };
}

function makeBarChart(values: number[], width: number, height: number) {
  const maxVal = Math.max(...values) + 8;
  const barWidth = 24;
  return values.map((value, index) => {
    const x = index * 42 + 18;
    const barHeight = (value / maxVal) * (height - 36);
    const y = height - 26 - barHeight;
    return { x, y, barHeight, value };
  });
}

export default function Charts() {
  const { width } = useWindowDimensions();
  const { colors } = useTheme();
  const isMobile = width < 768;
  const compactChartWidth = Math.max(width - 72, 248);
  const freightMetrics = buildLinePath(freightTrend, 650, 220, 26);
  const fuelMetrics = buildLinePath(fuelTrend, 320, 180, 18);
  const portMetrics = makeBarChart(portCongestion, 320, 180);

  return (
    <View style={styles.container}>
      <View style={[styles.chartCardWide, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.chartHeader}>
          <View>
            <Text style={[styles.chartEyebrow, { color: colors.primary }]}>Freight Trend</Text>
            <Text style={[styles.chartTitle, { color: colors.text }]}>Global Demand Signal</Text>
          </View>
          <Text style={[styles.chartBadge, { color: colors.deepAccent, backgroundColor: colors.deepAccent + '15', borderColor: colors.deepAccent + '40' }]}>+18.6%</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <Svg width={650} height={220} viewBox="0 0 650 220">
            <Defs>
              <LinearGradient id="freightArea" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0%" stopColor={colors.primary} stopOpacity={0.35} />
                <Stop offset="100%" stopColor={colors.primary} stopOpacity={0.02} />
              </LinearGradient>
            </Defs>

            {[0, 1, 2, 3, 4].map((row) => {
              const y = 28 + row * 42;
              return <Line key={`grid-${row}`} x1="28" x2="620" y1={y} y2={y} stroke={colors.border} strokeWidth={1} strokeDasharray="6 8" />;
            })}

            <Path d={freightMetrics.area} fill="url(#freightArea)" />
            <Path d={freightMetrics.line} fill="none" stroke={colors.primary} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />

            {freightMetrics.points.map((point, index) => (
              <G key={`freight-point-${index}`}>
                <Circle cx={point.x} cy={point.y} r={4} fill={colors.primary} />
                <Circle cx={point.x} cy={point.y} r={10} fill={colors.secondary} opacity={0.35} />
              </G>
            ))}
            
            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'].map((label, index) => (
              <SvgText key={label} x={28 + index * 66} y={208} fill={colors.textSecondary} fontSize="11" fontWeight="600" textAnchor="middle">
                {label}
              </SvgText>
            ))}
          </Svg>
        </ScrollView>
      </View>

      <View style={[styles.chartRow, isMobile && styles.chartRowMobile]}>
        <View style={[styles.chartCard, isMobile && styles.chartCardMobile, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.chartEyebrow, { color: colors.primary }]}>Fuel Trend</Text>
          <Text style={[styles.chartTitle, { color: colors.text }]}>Bunker Index</Text>
          <Svg width={isMobile ? compactChartWidth : 320} height={180} viewBox="0 0 320 180">
            <Defs>
              <LinearGradient id="fuelArea" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0%" stopColor={colors.secondary} stopOpacity={0.32} />
                <Stop offset="100%" stopColor={colors.secondary} stopOpacity={0.02} />
              </LinearGradient>
            </Defs>

            {[0, 1, 2, 3].map((row) => (
              <Line key={`fuel-grid-${row}`} x1="18" x2="296" y1={26 + row * 38} y2={26 + row * 38} stroke={colors.border} strokeWidth={1} strokeDasharray="6 6" />
            ))}

            <Path d={fuelMetrics.area} fill="url(#fuelArea)" />
            <Path d={fuelMetrics.line} fill="none" stroke={colors.secondary} strokeWidth={3} strokeLinecap="round" />
          </Svg>
        </View>

        <View style={[styles.chartCard, isMobile && styles.chartCardMobile, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.chartEyebrow, { color: colors.primary }]}>Port Congestion</Text>
          <Text style={[styles.chartTitle, { color: colors.text }]}>Regional Capacity</Text>
          <Svg width={isMobile ? compactChartWidth : 320} height={180} viewBox="0 0 320 180">
            {portMetrics.map((bar, index) => (
              <G key={`bar-${index}`}>
                <Rect x={bar.x} y={bar.y} width={18} height={bar.barHeight} rx={8} fill={index % 2 === 0 ? colors.primary : colors.secondary} opacity={0.9} />
              </G>
            ))}
          </Svg>
        </View>
      </View>

      <View style={[styles.chartRowBottom, isMobile && styles.chartRowBottomMobile]}>
        <View style={[styles.chartCard, isMobile && styles.chartCardMobile, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.chartEyebrow, { color: colors.primary }]}>Cargo Distribution</Text>
          <Text style={[styles.chartTitle, { color: colors.text }]}>Volume Mix</Text>
          <View style={styles.pieWrap}>
            <Svg width={160} height={160} viewBox="0 0 160 160">
              <Circle cx="80" cy="80" r="56" fill="none" stroke={colors.border} strokeWidth="18" />
              <Circle cx="80" cy="80" r="56" fill="none" stroke={colors.primary} strokeWidth="18" strokeDasharray="120 100" strokeLinecap="round" transform="rotate(-90 80 80)" />
              <Circle cx="80" cy="80" r="56" fill="none" stroke={colors.secondary} strokeWidth="18" strokeDasharray="70 150" strokeLinecap="round" transform="rotate(24 80 80)" />
              <Circle cx="80" cy="80" r="56" fill="none" stroke={colors.accent} strokeWidth="18" strokeDasharray="62 158" strokeLinecap="round" transform="rotate(110 80 80)" />
              <Circle cx="80" cy="80" r="37" fill={colors.background} />
            </Svg>
            <View style={styles.legend}>
              <LegendItem color={colors.primary} label="Containers" />
              <LegendItem color={colors.secondary} label="Bulk" />
              <LegendItem color={colors.accent} label="Energy" />
            </View>
          </View>
        </View>

        <View style={[styles.chartCard, isMobile && styles.chartCardMobile, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.chartEyebrow, { color: colors.primary }]}>Global Shipping Density</Text>
          <Text style={[styles.chartTitle, { color: colors.text }]}>Heatmap</Text>
          <View style={styles.heatmapWrap}>
            {heatmapData.map((row, rowIndex) => (
              <View key={`row-${rowIndex}`} style={styles.heatRow}>
                {row.map((cell, cellIndex) => (
                  <View
                    key={`cell-${rowIndex}-${cellIndex}`}
                    style={[styles.heatCell, { backgroundColor: getHeatColor(cell) }]}
                  />
                ))}
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  const { colors } = useTheme();
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <Text style={[styles.legendLabel, { color: colors.textSecondary }]}>{label}</Text>
    </View>
  );
}

function getHeatColor(value: number) {
  const palette = ['#A7DBD8', '#69D2E7', '#69D2E7', '#F38630', '#FA6900'];
  return palette[Math.max(0, Math.min(value - 1, 4))];
}

const styles = StyleSheet.create({
  container: {
    gap: 18,
    marginTop: 18,
  },
  chartCardWide: {
    borderRadius: 22,
    borderWidth: 1,
    padding: 18,
  },
  chartCard: {
    flex: 1,
    borderRadius: 22,
    borderWidth: 1,
    padding: 16,
    minHeight: 220,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  chartEyebrow: {
    fontSize: 11,
    letterSpacing: 1.3,
    textTransform: 'uppercase',
    fontWeight: '700',
    marginBottom: 6,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  chartBadge: {
    fontSize: 12,
    fontWeight: '800',
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  chartRow: {
    flexDirection: 'row',
    gap: 18,
  },
  chartRowMobile: {
    flexDirection: 'column',
  },
  chartRowBottom: {
    flexDirection: 'row',
    gap: 18,
  },
  chartRowBottomMobile: {
    flexDirection: 'column',
  },
  chartCardMobile: {
    width: '100%',
  },
  pieWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  legend: {
    gap: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  heatmapWrap: {
    marginTop: 12,
    gap: 6,
  },
  heatRow: {
    flexDirection: 'row',
    gap: 6,
  },
  heatCell: {
    width: 20,
    height: 20,
    borderRadius: 6,
  },
});
