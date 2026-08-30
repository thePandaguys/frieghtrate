import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View, useWindowDimensions } from 'react-native';
import Sidebar from '../../components/Sidebar';
import ScreenShell, { Card, SectionHeader } from '../../components/ScreenShell';
import { useTheme } from '../../constants/theme';
import { predictRisk } from '../../services/api';

const riskCards = [
  { key: 'storm', label: 'Storm risk', value: '72%', trend: '+12%' },
  { key: 'piracy', label: 'Piracy risk', value: '26%', trend: '-4%' },
  { key: 'delay', label: 'Delay risk', value: '48%', trend: '+8%' },
  { key: 'weather', label: 'Weather risk', value: '61%', trend: '+9%' },
  { key: 'congestion', label: 'Port congestion', value: '54%', trend: '+7%' },
  { key: 'insurance', label: 'Insurance risk', value: '33%', trend: '-2%' },
] as const;

type RiskSignal = { id: string; label: string; score: number; severity: 'Low' | 'Medium' | 'High' | 'Critical'; detail: string };

const riskSignals: RiskSignal[] = [
  { id: 'monsoon', label: 'Monsoon corridor pressure', score: 78, severity: 'High', detail: 'Strong crosswinds and swell risk for vessels approaching the South China Sea corridor.' },
  { id: 'insurgent', label: 'Transit security exposure', score: 42, severity: 'Medium', detail: 'Regional pressure and monitoring points increase route security checks.' },
  { id: 'berth', label: 'Berth congestion window', score: 64, severity: 'High', detail: 'Port dwell time rising above seasonal average at key discharge terminals.' },
  { id: 'weather', label: 'Weather volatility', score: 71, severity: 'High', detail: 'Wave height and wind velocity forecast to worsen by the end of the week.' },
];

export default function RiskScreen() {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const [riskData, setRiskData] = useState<RiskSignal[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [modelRiskScore, setModelRiskScore] = useState<number | null>(null);

  useEffect(() => {
    const loadRisk = async () => {
      try {
        const response = await predictRisk({
          freight_rate: 42.8, freight_rate_change_pct: 8.4, freight_volatility: 4.2, bdi: 1800,
          coal_price_change_pct: 0.8, crude_oil_price: 78, port_congestion_index: 0.54,
          demand_supply_ratio: 1.08, weather_risk_index: 0.61,
        });
        setModelRiskScore(Math.round((response.confidence ?? 0) * 100));
      } finally {
        setRiskData(riskSignals);
        setLoading(false);
      }
    };
    loadRisk().catch(() => undefined);
  }, []);

  const filtered = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    return q ? riskData.filter(r => `${r.label} ${r.detail}`.toLowerCase().includes(q)) : riskData;
  }, [riskData, searchText]);

  const riskScore = useMemo(() => modelRiskScore ?? (riskData.length ? Math.round(riskData.reduce((s, r) => s + r.score, 0) / riskData.length) : 0), [modelRiskScore, riskData]);

  const severityColor = (s: RiskSignal['severity']) => {
    if (s === 'Critical') return '#E53E3E';
    if (s === 'High') return colors.deepAccent;
    if (s === 'Medium') return colors.warning;
    return colors.success;
  };

  if (isMobile) {
    return (
      <ScreenShell title="Risk Analysis" subtitle="Operational risk intelligence and monitoring">
        <RiskContent colors={colors} riskScore={riskScore} riskCards={riskCards} filtered={filtered} loading={loading} searchText={searchText} setSearchText={setSearchText} severityColor={severityColor} />
      </ScreenShell>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={styles.shell}>
        <Sidebar />
        <View style={[styles.mainArea, { backgroundColor: colors.background }]}>
          <View style={[styles.topBar, { backgroundColor: colors.topBar, borderBottomColor: colors.topBarBorder }]}>
            <View>
              <Text style={[styles.eyebrow, { color: colors.primary }]}>FREYNA Freight Intelligence & Analytics</Text>
              <Text style={[styles.title, { color: colors.text }]}>Risk Analysis</Text>
            </View>
            <View style={[styles.searchWrap, { backgroundColor: colors.inputBg, borderColor: colors.primary }]}>
              <Feather name="search" size={14} color={colors.primary} />
              <TextInput value={searchText} onChangeText={setSearchText} placeholder="Search risks..." placeholderTextColor={colors.placeholder} style={[styles.searchInput, { color: colors.inputText }]} />
            </View>
          </View>
          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            <RiskContent colors={colors} riskScore={riskScore} riskCards={riskCards} filtered={filtered} loading={loading} searchText={searchText} setSearchText={setSearchText} severityColor={severityColor} />
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}

function RiskContent({ colors, riskScore, riskCards, filtered, loading, searchText, setSearchText, severityColor }: any) {
  return (
    <>
      {/* Hero */}
      <Card style={[styles.heroCard, { borderColor: colors.border }]}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.heroEyebrow, { color: colors.primary }]}>MARITIME RISK ENGINE</Text>
          <Text style={[styles.heroTitle, { color: colors.text }]}>Operational Risk Intelligence</Text>
        </View>
        <View style={[styles.scoreBadge, { backgroundColor: colors.deepAccent + '18', borderColor: colors.deepAccent }]}>
          <Text style={[styles.scoreLabel, { color: colors.textSecondary }]}>Risk Score</Text>
          <Text style={[styles.scoreValue, { color: colors.deepAccent }]}>{riskScore}</Text>
        </View>
      </Card>

      {/* Metric Cards */}
      <SectionHeader eyebrow="Risk Overview" title="Risk Metrics" />
      <View style={styles.cardGrid}>
        {riskCards.map((c: any) => (
          <Card key={c.key} style={styles.metricCard}>
            <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>{c.label}</Text>
            <Text style={[styles.metricValue, { color: colors.text }]}>{c.value}</Text>
            <Text style={[styles.metricTrend, { color: c.trend.startsWith('+') ? colors.deepAccent : colors.success }]}>{c.trend}</Text>
          </Card>
        ))}
      </View>

      {/* Watchlist */}
      <SectionHeader eyebrow="Live Intelligence" title="Risk Watchlist" />
      {loading && <Text style={[styles.stateText, { color: colors.textSecondary }]}>Loading risk intelligence…</Text>}
      {!loading && filtered.length === 0 && <Text style={[styles.stateText, { color: colors.textSecondary }]}>No matching risk events found.</Text>}
      {filtered.map((signal: RiskSignal) => (
        <Card key={signal.id} style={styles.signalCard}>
          <View style={styles.signalHeader}>
            <Text style={[styles.signalLabel, { color: colors.text }]}>{signal.label}</Text>
            <View style={[styles.severityBadge, { backgroundColor: severityColor(signal.severity) + '18', borderColor: severityColor(signal.severity) }]}>
              <Text style={[styles.severityText, { color: severityColor(signal.severity) }]}>{signal.severity}</Text>
            </View>
          </View>
          <Text style={[styles.signalDetail, { color: colors.textSecondary }]}>{signal.detail}</Text>
          <View style={[styles.progressTrack, { backgroundColor: colors.divider }]}>
            <View style={[styles.progressFill, { width: `${signal.score}%`, backgroundColor: severityColor(signal.severity) }]} />
          </View>
          <Text style={[styles.scoreMeta, { color: colors.textSecondary }]}>Exposure score: {signal.score}/100</Text>
        </Card>
      ))}

      {/* Chart */}
      <SectionHeader eyebrow="Analytics" title="Risk Distribution" />
      <Card>
        <View style={styles.chartBars}>
          {[42, 58, 76, 64, 88, 72, 91].map((h, i) => (
            <View key={i} style={[styles.chartBar, { height: h, backgroundColor: colors.primary, opacity: 0.6 + i * 0.06 }]} />
          ))}
        </View>
      </Card>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  shell: { flex: 1, flexDirection: 'row' },
  mainArea: { flex: 1, minWidth: 0 },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16, borderBottomWidth: 1 },
  eyebrow: { fontSize: 11, letterSpacing: 1.4, textTransform: 'uppercase', fontWeight: '700' },
  title: { fontSize: 24, fontWeight: '800', marginTop: 4 },
  searchWrap: { flexDirection: 'row', alignItems: 'center', gap: 8, width: 240, paddingHorizontal: 12, paddingVertical: 10, borderRadius: 20, borderWidth: 1.5 },
  searchInput: { flex: 1, fontSize: 13, fontWeight: '500' },
  content: { paddingHorizontal: 18, paddingVertical: 18 },
  heroCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  heroEyebrow: { fontSize: 11, letterSpacing: 1.4, fontWeight: '700', marginBottom: 6 },
  heroTitle: { fontSize: 26, fontWeight: '800' },
  scoreBadge: { minWidth: 100, paddingHorizontal: 14, paddingVertical: 12, borderRadius: 14, borderWidth: 1, alignItems: 'center' },
  scoreLabel: { fontSize: 10, letterSpacing: 1, textTransform: 'uppercase' },
  scoreValue: { fontSize: 28, fontWeight: '800', marginTop: 4 },
  cardGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  metricCard: { width: '31%', minWidth: 100 },
  metricLabel: { fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', fontWeight: '700' },
  metricValue: { fontSize: 24, fontWeight: '800', marginTop: 8 },
  metricTrend: { fontSize: 12, fontWeight: '700', marginTop: 6 },
  stateText: { fontSize: 13, padding: 16 },
  signalCard: { marginBottom: 10 },
  signalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  signalLabel: { fontSize: 14, fontWeight: '700', flex: 1 },
  severityBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 20, borderWidth: 1 },
  severityText: { fontSize: 11, fontWeight: '700' },
  signalDetail: { fontSize: 13, lineHeight: 19, marginBottom: 10 },
  progressTrack: { height: 6, borderRadius: 3, overflow: 'hidden', marginBottom: 6 },
  progressFill: { height: 6, borderRadius: 3 },
  scoreMeta: { fontSize: 10, letterSpacing: 1, textTransform: 'uppercase' },
  chartBars: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, height: 120 },
  chartBar: { flex: 1, borderRadius: 8 },
});
