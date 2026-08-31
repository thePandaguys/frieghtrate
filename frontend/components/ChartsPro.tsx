/**
 * ChartsPro — professional SVG chart kit for freight analytics.
 * - ForecastBandChart: history + multi-horizon forecast + 80% CI band + trend + scrub
 * - LineChart, Spark, RankedBars, ProbBar, DonutGauge
 * All paths are memoised and inputs downsampled (LTTB) so a 5-year daily range
 * renders well under 2 s.
 */
import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Defs, G, Line, LinearGradient, Path, Rect, Stop, Text as SvgText } from 'react-native-svg';
import { useTheme } from '../constants/theme';

export const PALETTE = {
  accent: '#F59E0B',      // forecast
  history: '#5A7A94',     // history line
  band: '#38BDF8',        // CI band
  good: '#34D399',
  bad: '#F87171',
  warn: '#FBBF24',
  grid: 'rgba(148,163,184,0.18)',
  axis: '#7C8DA0',
  series: ['#38BDF8', '#A78BFA', '#34D399', '#F472B6', '#FBBF24'],
};

function lttb(dates: string[], values: number[], target: number): number[] {
  const n = values.length;
  if (n <= target) return values;
  const out: number[] = [];
  const step = (n - 2) / (target - 2);
  let a = 0;
  out.push(values[0]);
  for (let i = 0; i < target - 2; i++) {
    const rangeStart = Math.floor((i + 1) * step) + 1;
    const rangeEnd = Math.min(Math.floor((i + 2) * step) + 1, n);
    let avgX = 0, avgY = 0;
    for (let j = rangeStart; j < rangeEnd; j++) { avgX += j; avgY += values[j]; }
    avgX /= rangeEnd - rangeStart; avgY /= rangeEnd - rangeStart;
    const rangeOffs = Math.floor(i * step) + 1;
    let pointAX = a, pointAY = values[a];
    let maxArea = -1, nextA = rangeStart;
    for (let j = rangeStart; j < rangeEnd; j++) {
      const area = Math.abs((pointAX - avgX) * (values[j] - pointAY) - (pointAX - j) * (avgY - pointAY));
      if (area > maxArea) { maxArea = area; nextA = j; }
    }
    out.push(values[nextA]);
    a = nextA;
  }
  out.push(values[n - 1]);
  return out;
}

function niceTicks(min: number, max: number, count = 4): number[] {
  const span = max - min || 1;
  const raw = span / count;
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const norm = raw / mag;
  const step = (norm >= 7.5 ? 10 : norm >= 3.5 ? 5 : norm >= 1.5 ? 2 : 1) * mag;
  const lo = Math.floor(min / step) * step;
  const ticks: number[] = [];
  for (let t = lo; t <= max + step * 0.001; t += step) ticks.push(Math.round(t * 100) / 100);
  return ticks;
}

function fmtDate(iso: string) {
  const d = new Date(iso + (iso.length === 10 ? 'T00:00:00' : ''));
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) + (d.getMonth() === 0 ? ` ${String(d.getFullYear()).slice(2)}` : '');
}

type BandChartProps = {
  history?: { dates: string[]; rates: number[] };
  dates: string[];
  forecast: number[];
  ciLow?: number[];
  ciHigh?: number[];
  height?: number;
  unit?: string;
  showBand?: boolean;
  hideScrub?: boolean;
};

export function ForecastBandChart({ history, dates, forecast, ciLow, ciHigh, height = 260, unit = '$/t', showBand = true, hideScrub }: BandChartProps) {
  const { colors } = useTheme();
  const [scrubIdx, setScrubIdx] = useState<number | null>(null);
  const W = 860, H = height, PAD_L = 46, PAD_R = 14, PAD_T = 16, PAD_B = 26;

  const data = useMemo(() => {
    const hRates = history?.rates ?? [];
    const all = [...hRates, ...forecast, ...(ciHigh ?? []), ...(ciLow ?? [])];
    const ds = hRates.length > 420 ? lttb(history!.dates, hRates, 420) : hRates;
    const hStep = hRates.length > 1 ? Math.ceil(hRates.length / (ds.length)) : 1;
    const hDatesDs = hRates.length > 420 ? history!.dates.filter((_, i) => i % hStep === 0) : (history?.dates ?? []);
    if (hDatesDs[hDatesDs.length - 1] !== history?.dates[hRates.length - 1] && hRates.length) {
      hDatesDs.push(history!.dates[hRates.length - 1]);
      ds.push(hRates[hRates.length - 1]);
    }
    const fDs = forecast.length > 200 ? lttb(dates, forecast, 200) : forecast;
    const fStep = forecast.length > 1 ? Math.ceil(forecast.length / fDs.length) : 1;
    const fDatesDs = forecast.length > 200 ? dates.filter((_, i) => i % fStep === 0) : dates;
    const lo = Math.min(...all) * 0.985;
    const hi = Math.max(...all) * 1.015;
    return { hRates: ds, hDates: hDatesDs, fRates: fDs, fDates: fDatesDs, lo, hi };
  }, [history, forecast, ciLow, ciHigh, dates]);

  const xOf = (i: number, total: number) => PAD_L + (i * (W - PAD_L - PAD_R)) / Math.max(total - 1, 1);
  const yOf = (v: number) => PAD_T + (1 - (v - data.lo) / (data.hi - data.lo || 1)) * (H - PAD_T - PAD_B);

  const geom = useMemo(() => {
    const hTotal = data.hRates.length, fTotal = data.fRates.length;
    const total = hTotal + fTotal;
    const histPts = data.hRates.map((v, i) => [xOf(i, total - 1), yOf(v)] as const);
    const fStartX = histPts.length ? histPts[histPts.length - 1][0] : PAD_L;
    const fPts = data.fRates.map((v, i) => [fStartX + (i * (W - PAD_R - fStartX)) / Math.max(fTotal - 1, 1), yOf(v)] as const);
    const line = (pts: readonly (readonly [number, number])[]) => pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
    const bandPts = data.fRates.map((v, i) => {
      const hN = ciHigh && ciHigh.length === forecast.length ? ciHigh[i] : v;
      return [fPts[i][0], yOf(hN)] as const;
    });
    const bandLow = data.fRates.map((v, i) => {
      const lN = ciLow && ciLow.length === forecast.length ? ciLow[i] : v;
      return [fPts[fPts.length - 1 - i][0], yOf(ciLow && ciLow.length === forecast.length ? ciLow[ciLow.length - 1 - i] : v)] as const;
    });
    const band = showBand && ciLow && ciHigh
      ? `${line(bandPts)} ${bandLow.map((p, i) => `${i === 0 ? 'L' : 'L'} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ')} Z`
      : '';
    const ticks = niceTicks(data.lo, data.hi, 4);
    const xLabels: { x: number; label: string }[] = [];
    const allDates = [...data.hDates, ...data.fDates];
    const nL = Math.min(6, allDates.length);
    for (let k = 0; k < nL; k++) {
      const idx = Math.round((k * (allDates.length - 1)) / Math.max(nL - 1, 1));
      xLabels.push({ x: PAD_L + (idx * (W - PAD_L - PAD_R)) / Math.max(allDates.length - 1, 1), label: fmtDate(allDates[idx]) });
    }
    return { histPath: line(histPts), fcPath: line(fPts), fPts, histPts, band, ticks, xLabels, total };
  }, [data, ciLow, ciHigh, showBand, forecast.length]);

  const lastF = forecast[forecast.length - 1];
  const lastY = geom.fPts.length ? geom.fPts[geom.fPts.length - 1][1] : H / 2;
  const lastX = geom.fPts.length ? geom.fPts[geom.fPts.length - 1][0] : W - PAD_R;
  const scrub = scrubIdx !== null && geom.fPts.length ? geom.fPts[Math.min(scrubIdx, geom.fPts.length - 1)] : null;

  const onScrub = (evt: { nativeEvent?: { locationX?: number } }) => {
    if (hideScrub || !geom.fPts.length) return;
    const x = evt.nativeEvent?.locationX ?? 0;
    if (x < geom.fPts[0][0] - 6) { setScrubIdx(null); return; }
    const rel = (x - geom.fPts[0][0]) / Math.max(lastX - geom.fPts[0][0], 1);
    setScrubIdx(Math.max(0, Math.min(forecast.length - 1, Math.round(rel * (forecast.length - 1)))));
  };

  return (
    <View>
      <Pressable onPress={onScrub} onMoveShouldSetResponder={() => true} onResponderMove={onScrub} onResponderRelease={onScrub}>
        <Svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
          <Defs>
            <LinearGradient id="bandGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={PALETTE.band} stopOpacity="0.28" />
              <Stop offset="1" stopColor={PALETTE.band} stopOpacity="0.06" />
            </LinearGradient>
          </Defs>
          {geom.ticks.map((t) => (
            <G key={`t${t}`}>
              <Line x1={PAD_L} x2={W - PAD_R} y1={yOf(t)} y2={yOf(t)} stroke={PALETTE.grid} strokeWidth="1" />
              <SvgText x={PAD_L - 6} y={yOf(t) + 4} fontSize="10" fill={PALETTE.axis} textAnchor="end">{t}</SvgText>
            </G>
          ))}
          {geom.xLabels.map((l, i) => (
            <SvgText key={`x${i}`} x={l.x} y={H - 8} fontSize="10" fill={PALETTE.axis} textAnchor="middle">{l.label}</SvgText>
          ))}
          {showBand && geom.band ? <Path d={geom.band} fill="url(#bandGrad)" /> : null}
          {data.hRates.length ? <Path d={geom.histPath} fill="none" stroke={PALETTE.history} strokeWidth="2" /> : null}
          {/* today divider */}
          {geom.fPts.length && data.hRates.length ? (
            <Line x1={geom.histPts[geom.histPts.length - 1][0]} x2={geom.histPts[geom.histPts.length - 1][0]} y1={PAD_T} y2={H - PAD_B} stroke={colors.divider} strokeWidth="1" strokeDasharray="3 3" />
          ) : null}
          <Path d={geom.fcPath} fill="none" stroke={PALETTE.accent} strokeWidth="2.4" />
          <Circle cx={lastX} cy={lastY} r="4" fill={PALETTE.accent} />
          {scrub ? (
            <G>
              <Line x1={scrub[0]} x2={scrub[0]} y1={PAD_T} y2={H - PAD_B} stroke={PALETTE.accent} strokeWidth="1" strokeDasharray="2 3" />
              <Circle cx={scrub[0]} cy={scrub[1]} r="4.5" fill={PALETTE.accent} stroke="#0B1220" strokeWidth="1.5" />
            </G>
          ) : null}
        </Svg>
      </Pressable>
      <View style={styles.legendRow}>
        <View style={styles.legendItem}><View style={[styles.dot, { backgroundColor: PALETTE.history }]} /><Text style={[styles.legendText, { color: colors.textSecondary }]}>History</Text></View>
        <View style={styles.legendItem}><View style={[styles.dot, { backgroundColor: PALETTE.accent }]} /><Text style={[styles.legendText, { color: colors.textSecondary }]}>Forecast</Text></View>
        {showBand && ciLow ? <View style={styles.legendItem}><View style={[styles.dot, { backgroundColor: PALETTE.band }]} /><Text style={[styles.legendText, { color: colors.textSecondary }]}>80% CI</Text></View> : null}
        {scrub ? (
          <Text style={[styles.legendText, { color: colors.text, marginLeft: 'auto', fontWeight: '700' }]}>
            {dates[Math.min(scrubIdx ?? 0, dates.length - 1)]}: ${forecast[Math.min(scrubIdx ?? 0, forecast.length - 1)].toFixed(2)} {unit}
          </Text>
        ) : (
          <Text style={[styles.legendText, { color: colors.text, marginLeft: 'auto', fontWeight: '700' }]}>{`+${(forecast.length)}d → $${lastF.toFixed(2)} ${unit}`}</Text>
        )}
      </View>
    </View>
  );
}

export function Spark({ values, color = PALETTE.accent, height = 36, width = 110 }: { values: number[]; color?: string; height?: number; width?: number }) {
  const d = useMemo(() => {
    if (!values.length) return '';
    const min = Math.min(...values), max = Math.max(...values);
    return values.map((v, i) => `${i === 0 ? 'M' : 'L'} ${(i * width) / Math.max(values.length - 1, 1)} ${height - 3 - ((v - min) / (max - min || 1)) * (height - 6)}`).join(' ');
  }, [values, height, width]);
  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <Path d={d} fill="none" stroke={color} strokeWidth="1.8" />
    </Svg>
  );
}

export function MultiLine({ series, labels, height = 220, unit = '' }: { series: { name: string; values: number[] }[]; labels?: string[]; height?: number; unit?: string }) {
  const { colors } = useTheme();
  const W = 860, H = height, PAD_L = 46, PAD_R = 12, PAD_T = 12, PAD_B = 24;
  const all = series.flatMap((s) => s.values);
  const lo = Math.min(...all) * 0.98, hi = Math.max(...all) * 1.02;
  const yOf = (v: number) => PAD_T + (1 - (v - lo) / (hi - lo || 1)) * (H - PAD_T - PAD_B);
  const ticks = niceTicks(lo, hi, 4);
  const maxLen = Math.max(...series.map((s) => s.values.length));
  return (
    <View>
      <Svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
        {ticks.map((t) => (
          <G key={t}>
            <Line x1={PAD_L} x2={W - PAD_R} y1={yOf(t)} y2={yOf(t)} stroke={PALETTE.grid} />
            <SvgText x={PAD_L - 6} y={yOf(t) + 4} fontSize="10" fill={PALETTE.axis} textAnchor="end">{t}</SvgText>
          </G>
        ))}
        {series.map((s, si) => {
          const step = s.values.length > 500 ? lttb([], s.values, 500) : s.values;
          const d = step.map((v, i) => `${i === 0 ? 'M' : 'L'} ${PAD_L + (i * (W - PAD_L - PAD_R)) / Math.max(step.length - 1, 1)} ${yOf(v)}`).join(' ');
          return <Path key={s.name} d={d} fill="none" stroke={PALETTE.series[si % PALETTE.series.length]} strokeWidth="2" />;
        })}
        {labels && labels.length ? [0, 0.33, 0.66, 1].map((f) => {
          const idx = Math.round(f * (maxLen - 1));
          return <SvgText key={f} x={PAD_L + (idx * (W - PAD_L - PAD_R)) / Math.max(maxLen - 1, 1)} y={H - 6} fontSize="10" fill={PALETTE.axis} textAnchor="middle">{labels[Math.min(idx, labels.length - 1)]}</SvgText>;
        }) : null}
      </Svg>
      <View style={styles.legendRow}>
        {series.map((s, si) => (
          <View key={s.name} style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: PALETTE.series[si % PALETTE.series.length] }]} />
            <Text style={[styles.legendText, { color: colors.textSecondary }]}>{s.name}</Text>
          </View>
        ))}
        <Text style={[styles.legendText, { color: colors.text, marginLeft: 'auto', fontWeight: '700' }]}>{unit}</Text>
      </View>
    </View>
  );
}

export function RankedBars({ items, unit = '$/t' }: { items: { label: string; value: number; sub?: string; color?: string; best?: boolean }[]; unit?: string }) {
  const { colors } = useTheme();
  const max = Math.max(...items.map((i) => i.value), 0.0001);
  return (
    <View style={{ gap: 10 }}>
      {items.map((it) => (
        <View key={it.label}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
            <Text style={{ color: colors.text, fontSize: 13, fontWeight: it.best ? '800' : '600' }}>
              {it.best ? '★ ' : ''}{it.label}
              {it.sub ? <Text style={{ color: colors.textMuted, fontWeight: '500' }}> · {it.sub}</Text> : null}
            </Text>
            <Text style={{ color: it.color ?? colors.text, fontWeight: '800', fontSize: 13 }}>{it.value.toLocaleString()} {unit}</Text>
          </View>
          <View style={{ height: 8, borderRadius: 4, backgroundColor: colors.cardAlt, overflow: 'hidden' }}>
            <View style={{ height: 8, width: `${Math.max((it.value / max) * 100, 2)}%`, borderRadius: 4, backgroundColor: it.color ?? PALETTE.accent }} />
          </View>
        </View>
      ))}
    </View>
  );
}

export function ProbBar({ probs, classes }: { probs: Record<string, number>; classes?: string[] }) {
  const { colors } = useTheme();
  const keys = classes ?? Object.keys(probs);
  const colorsMap: Record<string, string> = { HIGH: PALETTE.bad, MEDIUM: PALETTE.warn, LOW: PALETTE.good };
  return (
    <View>
      <View style={{ flexDirection: 'row', height: 14, borderRadius: 7, overflow: 'hidden' }}>
        {keys.map((k) => (
          <View key={k} style={{ width: `${(probs[k] ?? 0) * 100}%`, backgroundColor: colorsMap[k] ?? PALETTE.band }} />
        ))}
      </View>
      <View style={{ flexDirection: 'row', gap: 14, marginTop: 6 }}>
        {keys.map((k) => (
          <View key={k} style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: colorsMap[k] ?? PALETTE.band }]} />
            <Text style={[styles.legendText, { color: colors.textSecondary }]}>{k} {((probs[k] ?? 0) * 100).toFixed(1)}%</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export function DonutGauge({ value, max = 100, label, color }: { value: number; max?: number; label: string; color?: string }) {
  const { colors } = useTheme();
  const R = 40, C = 2 * Math.PI * R;
  const pct = Math.max(0, Math.min(1, value / max));
  const c = color ?? (pct > 0.7 ? PALETTE.bad : pct > 0.4 ? PALETTE.warn : PALETTE.good);
  return (
    <View style={{ alignItems: 'center', width: 116 }}>
      <Svg width={110} height={110} viewBox="0 0 110 110">
        <Circle cx="55" cy="55" r={R} stroke={colors.cardAlt} strokeWidth="10" fill="none" />
        <Circle cx="55" cy="55" r={R} stroke={c} strokeWidth="10" fill="none"
          strokeDasharray={`${(C * pct).toFixed(1)} ${C.toFixed(1)}`} strokeLinecap="round"
          transform="rotate(-90 55 55)" />
        <SvgText x="55" y="52" fontSize="20" fontWeight="800" fill={colors.text} textAnchor="middle">{Math.round(value)}</SvgText>
        <SvgText x="55" y="68" fontSize="9" fill={PALETTE.axis} textAnchor="middle">/ {max}</SvgText>
      </Svg>
      <Text style={{ color: colors.textSecondary, fontSize: 11, textAlign: 'center', marginTop: 2 }}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  legendRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 6, flexWrap: 'wrap' },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: 11 },
});
