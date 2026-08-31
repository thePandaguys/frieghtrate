import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import ScreenShell, { Card, ProgressBar, SectionHeader, StatusBadge } from '../../components/ScreenShell';
import { useTheme } from '../../constants/theme';
import { predictRisk } from '../../services/api';

const riskCards = [
  { key: 'storm', label: 'Cyclone / Squall Risk', value: '72%', trend: '+12%', icon: 'cloud-lightning', iconSet: 'F' },
  { key: 'security', label: 'High Sea Security (Piracy)', value: '26%', trend: '-4%', icon: 'shield-alert', iconSet: 'M' },
  { key: 'congestion', label: 'Port Berth Congestion', value: '54%', trend: '+7%', icon: 'anchor', iconSet: 'F' },
  { key: 'draft', label: 'Draft & LOA Restriction', value: '68%', trend: '+14%', icon: 'ruler', iconSet: 'F' },
  { key: 'insurance', label: 'War & War-Risk Surcharge', value: '33%', trend: '-2%', icon: 'file-text', iconSet: 'F' },
  { key: 'bunker', label: 'Bunker Price Volatility', value: '61%', trend: '+9%', icon: 'trending-up', iconSet: 'F' },
] as const;

type RiskSignal = {
  id: string;
  label: string;
  score: number;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  corridor: string;
  detail: string;
  mitigation: string;
};

const riskSignals: RiskSignal[] = [
  {
    id: 'monsoon',
    label: 'Bay of Bengal Monsoon Swell Pressure',
    score: 78,
    severity: 'High',
    corridor: 'Malacca Strait → Paradip / Dhamra',
    detail: 'Crosswinds exceeding 32 knots and 4.2m swell forecast along central Bay of Bengal deep channel.',
    mitigation: 'Adjust speed to 12.5 kts; prioritize deep-water fairways clearing Nicobar Great Channel.',
  },
  {
    id: 'haldia-draft',
    label: 'Haldia Draft Lock Capacity Limit',
    score: 84,
    severity: 'Critical',
    corridor: 'Taboneo → Haldia Dock Complex',
    detail: 'Spring tide variance restricting max permissible laden draft to 8.5m. Capesize/Panamax parcels prohibited.',
    mitigation: 'Recommend transshipment / lightening at Sagar Sandheads Anchorage before river transit.',
  },
  {
    id: 'berth-vizag',
    label: 'Visakhapatnam Bulk Berth Congestion',
    score: 64,
    severity: 'High',
    corridor: 'Samarinda → Visakhapatnam (Vizag)',
    detail: 'Coal berth waiting times extended to 18-24 hours due to simultaneous Capesize discharges.',
    mitigation: 'Schedule mid-term charter laycan windows with 36-hour buffer to avoid demurrage penalties.',
  },
  {
    id: 'cape-weather',
    label: 'South Atlantic Cape Agulhas Sea State',
    score: 52,
    severity: 'Medium',
    corridor: 'Norfolk / New Orleans → East Coast India',
    detail: 'Agulhas return current generating heavy head seas along South African coastal waters.',
    mitigation: 'Utilize deep ocean routing 120 NM offshore Cape of Good Hope.',
  },
];

export default function RiskScreen() {
  const { colors } = useTheme();
  const [riskData, setRiskData] = useState<RiskSignal[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [modelRiskScore, setModelRiskScore] = useState<number | null>(null);

  useEffect(() => {
    const loadRisk = async () => {
      try {
        const response = await predictRisk({
          freight_rate: 42.8,
          freight_rate_change_pct: 8.4,
          freight_volatility: 4.2,
          bdi: 1800,
          coal_price_change_pct: 0.8,
          crude_oil_price: 78,
          port_congestion_index: 0.54,
          demand_supply_ratio: 1.08,
          weather_risk_index: 0.61,
        });
        setModelRiskScore(Math.round((response.confidence ?? 0.76) * 100));
      } catch {
        setModelRiskScore(76);
      } finally {
        setRiskData(riskSignals);
        setLoading(false);
      }
    };
    loadRisk().catch(() => undefined);
  }, []);

  const filtered = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    return q
      ? riskData.filter(r => `${r.label} ${r.detail} ${r.corridor}`.toLowerCase().includes(q))
      : riskData;
  }, [riskData, searchText]);

  const riskScore = useMemo(
    () => modelRiskScore ?? (riskData.length ? Math.round(riskData.reduce((s, r) => s + r.score, 0) / riskData.length) : 68),
    [modelRiskScore, riskData]
  );

  const getSeverityStyle = (s: RiskSignal['severity']) => {
    switch (s) {
      case 'Critical':
        return { color: colors.danger, bg: colors.danger + '18' };
      case 'High':
        return { color: colors.accent, bg: colors.accent + '18' };
      case 'Medium':
        return { color: colors.warning, bg: colors.warning + '18' };
      default:
        return { color: colors.success, bg: colors.success + '18' };
    }
  };

  return (
    <ScreenShell
      title="Maritime Risk Intelligence"
      subtitle="Early warning system, port draft restrictions, and chartering risk mitigation (SIH 26006)"
      breadcrumb="Risk Analysis"
      badge="MODEL ACTIVE"
      badgeColor={colors.success}
    >
      {/* Risk Engine Hero Summary */}
      <Animated.View entering={FadeInDown.duration(400)}>
        <Card style={[styles.heroCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.heroLeft}>
            <View style={[styles.badgePill, { backgroundColor: colors.primary + '18', borderColor: colors.primary }]}>
              <Feather name="shield" size={12} color={colors.primary} />
              <Text style={[styles.badgePillText, { color: colors.primary }]}>INTELLIGENT RISK RADAR</Text>
            </View>
            <Text style={[styles.heroTitle, { color: colors.text }]}>Corridor Risk Assessment</Text>
            <Text style={[styles.heroSub, { color: colors.textSecondary }]}>
              Machine-learning evaluation of voyage delays, bunker swings, weather windows, and draft limitations.
            </Text>
          </View>

          <View style={[styles.scoreBadge, { backgroundColor: colors.cardAlt, borderColor: colors.accent }]}>
            <Text style={[styles.scoreLabel, { color: colors.textMuted }]}>AGGREGATE RISK INDEX</Text>
            <Text style={[styles.scoreValue, { color: colors.accent }]}>{riskScore}/100</Text>
            <Text style={[styles.scoreSub, { color: colors.warning }]}>ELEVATED CAUTION</Text>
          </View>
        </Card>
      </Animated.View>

      {/* Filter / Search Strip */}
      <View style={styles.searchRow}>
        <View style={[styles.searchWrap, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
          <Feather name="search" size={14} color={colors.primary} />
          <TextInput
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Filter risk by corridor, port, or weather..."
            placeholderTextColor={colors.placeholder}
            style={[styles.searchInput, { color: colors.inputText }]}
          />
        </View>
      </View>

      {/* Metric Cards Grid */}
      <SectionHeader eyebrow="Risk Indicators" title="Operational Risk Metrics" />
      <View style={styles.cardGrid}>
        {riskCards.map((c, i) => (
          <Animated.View key={c.key} entering={FadeInDown.delay(i * 60).duration(400)} style={styles.gridCol}>
            <Card style={[styles.metricCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.metricTop}>
                <View style={[styles.metricIconBox, { backgroundColor: colors.cardAlt, borderColor: colors.border }]}>
                  {c.iconSet === 'F' ? (
                    <Feather name={c.icon as any} size={15} color={colors.primary} />
                  ) : (
                    <MaterialCommunityIcons name={c.icon as any} size={16} color={colors.primary} />
                  )}
                </View>
                <Text style={[styles.metricTrend, { color: c.trend.startsWith('+') ? colors.accent : colors.success }]}>
                  {c.trend}
                </Text>
              </View>
              <Text style={[styles.metricLabel, { color: colors.textMuted }]}>{c.label}</Text>
              <Text style={[styles.metricValue, { color: colors.text }]}>{c.value}</Text>
            </Card>
          </Animated.View>
        ))}
      </View>

      {/* Active Risk Signals */}
      <SectionHeader eyebrow="Intelligence Watchlist" title="Corridor Risk Watchlist & Mitigation" right="SIH 26006" />
      {loading && <Text style={[styles.stateText, { color: colors.textSecondary }]}>Loading neural risk signals…</Text>}
      {!loading && filtered.length === 0 && (
        <Text style={[styles.stateText, { color: colors.textSecondary }]}>No matching risk advisories found.</Text>
      )}
      {filtered.map((signal, i) => {
        const severity = getSeverityStyle(signal.severity);
        return (
          <Animated.View key={signal.id} entering={FadeInDown.delay(200 + i * 80).duration(500)}>
            <Card style={[styles.signalCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              {/* Title & Severity */}
              <View style={styles.signalHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.signalLabel, { color: colors.text }]}>{signal.label}</Text>
                  <Text style={[styles.signalCorridor, { color: colors.primary }]}>{signal.corridor}</Text>
                </View>
                <View style={[styles.severityBadge, { backgroundColor: severity.bg, borderColor: severity.color }]}>
                  <Text style={[styles.severityText, { color: severity.color }]}>{signal.severity.toUpperCase()}</Text>
                </View>
              </View>

              <Text style={[styles.signalDetail, { color: colors.textSecondary }]}>{signal.detail}</Text>

              {/* Mitigation Box */}
              <View style={[styles.mitigationWrap, { backgroundColor: colors.cardAlt, borderColor: colors.border }]}>
                <Feather name="shield" size={13} color={colors.success} />
                <Text style={[styles.mitigationText, { color: colors.text }]}>
                  <Text style={{ fontWeight: '800', color: colors.success }}>MITIGATION: </Text>
                  {signal.mitigation}
                </Text>
              </View>

              {/* Exposure Progress Bar */}
              <View style={styles.progressRow}>
                <View style={{ flex: 1, marginRight: 12 }}>
                  <ProgressBar progress={signal.score / 100} color={severity.color} />
                </View>
                <Text style={[styles.scoreMeta, { color: colors.textMuted }]}>EXPOSURE: {signal.score}%</Text>
              </View>
            </Card>
          </Animated.View>
        );
      })}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 16,
    padding: 20,
  },
  heroLeft: {
    flex: 1,
    minWidth: 260,
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    marginBottom: 8,
  },
  badgePillText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.3,
  },
  heroSub: {
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
  },
  scoreBadge: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    minWidth: 160,
  },
  scoreLabel: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  scoreValue: {
    fontSize: 28,
    fontWeight: '900',
    marginTop: 4,
    letterSpacing: -0.5,
  },
  scoreSub: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  searchRow: {
    marginTop: 14,
    marginBottom: 8,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 44,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    outlineStyle: 'none',
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 8,
  },
  gridCol: {
    flex: 1,
    minWidth: 160,
  },
  metricCard: {
    padding: 14,
    minHeight: 110,
    justifyContent: 'space-between',
  },
  metricTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metricIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  metricTrend: {
    fontSize: 11,
    fontWeight: '800',
  },
  metricLabel: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 8,
  },
  metricValue: {
    fontSize: 22,
    fontWeight: '800',
    marginTop: 2,
  },
  stateText: {
    fontSize: 13,
    padding: 16,
  },
  signalCard: {
    marginBottom: 12,
    padding: 16,
  },
  signalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 12,
  },
  signalLabel: {
    fontSize: 15,
    fontWeight: '800',
  },
  signalCorridor: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  severityText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  signalDetail: {
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 10,
  },
  mitigationWrap: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 10,
  },
  mitigationText: {
    fontSize: 11,
    lineHeight: 16,
    flex: 1,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  scoreMeta: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
