import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Animated, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ScreenShell, { Card, PrimaryButton, SectionHeader } from '../../components/ScreenShell';
import { useTheme } from '../../constants/theme';

const POLICY_DATA = {
  currentPolicy: {
    title: 'Balanced Chartering',
    description: 'Maintain a balanced exposure between freight cost, vessel availability, and operational risk.',
    confidence: '91.8%',
  },
  recommendations: [
    { title: 'Secure Near-Term Capacity',  description: 'Lock required vessel capacity within the current favorable market window.',                    priority: 'HIGH',   type: 'MARKET' },
    { title: 'Maintain Fleet Flexibility', description: 'Avoid excessive long-term commitments while freight conditions remain dynamic.',               priority: 'MEDIUM', type: 'FLEET' },
    { title: 'Monitor Route Risk',         description: 'Increase monitoring of weather, congestion, and route disruption indicators.',                 priority: 'MEDIUM', type: 'RISK' },
  ],
  parameters: [
    { label: 'COST PRIORITY',    value: '72%' },
    { label: 'RISK TOLERANCE',   value: 'MEDIUM' },
    { label: 'FLEET FLEXIBILITY', value: 'HIGH' },
  ],
};

export default function Policy() {
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState('RECOMMENDED');
  const fadeAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
  }, []);

  return (
    <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
      <ScreenShell title="Policy Center" subtitle="Configure and monitor chartering strategy" badge="ACTIVE" badgeColor={colors.success}>

        {/* Active Policy Card */}
        <Card style={[styles.policyCard, { borderColor: colors.deepAccent, borderLeftWidth: 5, borderLeftColor: colors.deepAccent }]}>
          <View style={styles.policyCardTop}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.policyEyebrow, { color: colors.primary }]}>CURRENT STRATEGY</Text>
              <Text style={[styles.policyTitle, { color: colors.text }]}>{POLICY_DATA.currentPolicy.title}</Text>
            </View>
            <View style={[styles.aiBadge, { backgroundColor: colors.deepAccent }]}>
              <Text style={styles.aiBadgeText}>AI</Text>
            </View>
          </View>
          <Text style={[styles.policyDesc, { color: colors.textSecondary }]}>{POLICY_DATA.currentPolicy.description}</Text>
          <View style={[styles.policyBottom, { borderTopColor: colors.divider }]}>
            <View>
              <Text style={[styles.smallLabel, { color: colors.textMuted }]}>AI CONFIDENCE</Text>
              <Text style={[styles.confidence, { color: colors.success }]}>{POLICY_DATA.currentPolicy.confidence}</Text>
            </View>
            <View style={[styles.activePill, { backgroundColor: colors.successBg, borderColor: colors.success }]}>
              <View style={[styles.activeDot, { backgroundColor: colors.success }]} />
              <Text style={[styles.activeText, { color: colors.success }]}>POLICY ACTIVE</Text>
            </View>
          </View>
        </Card>

        {/* Tabs */}
        <View style={[styles.tabsWrap, { backgroundColor: colors.cardAlt, borderColor: colors.border }]}>
          {['RECOMMENDED', 'PARAMETERS'].map(tab => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[styles.tab, activeTab === tab && { backgroundColor: colors.deepAccent }]}
              activeOpacity={0.8}
            >
              <Text style={[styles.tabText, { color: activeTab === tab ? '#FFFFFF' : colors.textMuted }]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recommendations */}
        {activeTab === 'RECOMMENDED' && (
          <>
            <SectionHeader eyebrow="AI Decision Layer" title="Recommended Actions" right="03" />
            {POLICY_DATA.recommendations.map((rec, i) => {
              const isHigh = rec.priority === 'HIGH';
              const priorityColor = isHigh ? colors.deepAccent : colors.warning;
              return (
                <Card key={i} style={styles.recCard}>
                  <View style={[styles.recBar, { backgroundColor: priorityColor }]} />
                  <View style={{ flex: 1 }}>
                    <View style={styles.recTitleRow}>
                      <Text style={[styles.recTitle, { color: colors.text }]}>{rec.title}</Text>
                      <View style={[styles.priorityBadge, { backgroundColor: priorityColor + '18', borderColor: priorityColor }]}>
                        <Text style={[styles.priorityText, { color: priorityColor }]}>{rec.priority}</Text>
                      </View>
                    </View>
                    <Text style={[styles.recDesc, { color: colors.textSecondary }]}>{rec.description}</Text>
                    <View style={styles.recMeta}>
                      <Text style={[styles.recType, { color: colors.primary }]}>{rec.type}</Text>
                      <View style={styles.aiVerified}>
                        <View style={[styles.aiVerifiedDot, { backgroundColor: colors.success }]} />
                        <Text style={[styles.aiVerifiedText, { color: colors.textMuted }]}>AI VERIFIED</Text>
                      </View>
                    </View>
                  </View>
                </Card>
              );
            })}
          </>
        )}

        {/* Parameters */}
        {activeTab === 'PARAMETERS' && (
          <>
            <SectionHeader eyebrow="Strategy Configuration" title="Policy Parameters" />
            {POLICY_DATA.parameters.map((p, i) => (
              <Card key={i} style={styles.paramCard}>
                <View>
                  <Text style={[styles.smallLabel, { color: colors.textMuted }]}>{p.label}</Text>
                  <Text style={[styles.paramValue, { color: colors.deepAccent }]}>{p.value}</Text>
                </View>
                <View style={[styles.configuredBadge, { backgroundColor: colors.successBg, borderColor: colors.success }]}>
                  <View style={[styles.configDot, { backgroundColor: colors.success }]} />
                  <Text style={[styles.configText, { color: colors.success }]}>CONFIGURED</Text>
                </View>
              </Card>
            ))}

            {/* Risk Scale */}
            <Card>
              <View style={styles.scaleHeader}>
                <View>
                  <Text style={[styles.smallLabel, { color: colors.textMuted }]}>RISK TOLERANCE</Text>
                  <Text style={[styles.paramValue, { color: colors.text }]}>Medium</Text>
                </View>
                <Text style={[styles.scaleValue, { color: colors.primary }]}>BALANCED</Text>
              </View>
              <View style={[styles.scaleTrack, { backgroundColor: colors.divider }]}>
                <View style={[styles.scaleLow,    { backgroundColor: colors.success + '60' }]} />
                <View style={[styles.scaleMedium, { backgroundColor: colors.primary }]} />
                <View style={[styles.scaleHigh,   { backgroundColor: colors.deepAccent + '60' }]} />
              </View>
              <View style={styles.scaleLabels}>
                {['LOW', 'MEDIUM', 'HIGH'].map(l => (
                  <Text key={l} style={[styles.scaleLabel, { color: l === 'MEDIUM' ? colors.primary : colors.textMuted }]}>{l}</Text>
                ))}
              </View>
            </Card>
          </>
        )}

        {/* Impact */}
        <SectionHeader eyebrow="Strategy Impact" title="Expected Outcome" />
        <Card>
          <View style={styles.impactGrid}>
            {[
              { label: 'COST CONTROL',      value: 'HIGH',   color: colors.success },
              { label: 'FLEXIBILITY',        value: 'HIGH',   color: colors.success },
              { label: 'MARKET EXPOSURE',    value: 'MEDIUM', color: colors.warning },
              { label: 'OPERATIONAL RISK',   value: 'LOW',    color: colors.primary },
            ].map(item => (
              <View key={item.label} style={[styles.impactItem, { borderTopColor: colors.divider }]}>
                <Text style={[styles.impactLabel, { color: colors.textMuted }]}>{item.label}</Text>
                <View style={styles.impactValueRow}>
                  <View style={[styles.impactDot, { backgroundColor: item.color }]} />
                  <Text style={[styles.impactValue, { color: item.color }]}>{item.value}</Text>
                </View>
              </View>
            ))}
          </View>
        </Card>

        {/* Forecast Link */}
        <TouchableOpacity
          style={[styles.forecastBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() => router.push('/(main)/forecast')}
          activeOpacity={0.85}
        >
          <View style={[styles.forecastIconWrap, { backgroundColor: colors.primary + '18' }]}>
            <Text style={[styles.forecastIconText, { color: colors.primary }]}>↗</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.forecastTitle, { color: colors.text }]}>Review Market Forecast</Text>
            <Text style={[styles.forecastSub, { color: colors.textSecondary }]}>Validate policy against projected freight movement</Text>
          </View>
          <Text style={[styles.forecastArrow, { color: colors.deepAccent }]}>→</Text>
        </TouchableOpacity>

      </ScreenShell>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  policyCard: { borderRadius: 18, overflow: 'hidden' },
  policyCardTop: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  policyEyebrow: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  policyTitle: { fontSize: 20, fontWeight: '800', marginTop: 3 },
  aiBadge: { width: 40, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  aiBadgeText: { color: '#FFFFFF', fontSize: 12, fontWeight: '800' },
  policyDesc: { fontSize: 13, lineHeight: 20, marginBottom: 14 },
  policyBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 14, borderTopWidth: 1 },
  smallLabel: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  confidence: { fontSize: 20, fontWeight: '800', marginTop: 3 },
  activePill: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20, borderWidth: 1 },
  activeDot: { width: 6, height: 6, borderRadius: 3 },
  activeText: { fontSize: 11, fontWeight: '700' },
  tabsWrap: { flexDirection: 'row', borderRadius: 14, padding: 4, borderWidth: 1, marginBottom: 4 },
  tab: { flex: 1, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  tabText: { fontSize: 12, fontWeight: '700', letterSpacing: 0.5 },
  recCard: { flexDirection: 'row', gap: 12, paddingVertical: 14 },
  recBar: { width: 4, borderRadius: 2, minHeight: 70 },
  recTitleRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 6 },
  recTitle: { fontSize: 14, fontWeight: '700', flex: 1, paddingRight: 8 },
  priorityBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 20, borderWidth: 1 },
  priorityText: { fontSize: 10, fontWeight: '700' },
  recDesc: { fontSize: 13, lineHeight: 19 },
  recMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  recType: { fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  aiVerified: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  aiVerifiedDot: { width: 5, height: 5, borderRadius: 3 },
  aiVerifiedText: { fontSize: 10, fontWeight: '600' },
  paramCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14 },
  paramValue: { fontSize: 18, fontWeight: '800', marginTop: 4 },
  configuredBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20, borderWidth: 1 },
  configDot: { width: 6, height: 6, borderRadius: 3 },
  configText: { fontSize: 11, fontWeight: '700' },
  scaleHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 14 },
  scaleValue: { fontSize: 12, fontWeight: '700' },
  scaleTrack: { height: 8, borderRadius: 4, overflow: 'hidden', flexDirection: 'row', marginBottom: 8 },
  scaleLow: { width: '33%' },
  scaleMedium: { width: '34%' },
  scaleHigh: { width: '33%' },
  scaleLabels: { flexDirection: 'row', justifyContent: 'space-between' },
  scaleLabel: { fontSize: 11, fontWeight: '600' },
  impactGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  impactItem: { width: '50%', paddingVertical: 12, borderTopWidth: 1 },
  impactLabel: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  impactValueRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 5 },
  impactDot: { width: 6, height: 6, borderRadius: 3 },
  impactValue: { fontSize: 14, fontWeight: '700' },
  forecastBtn: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderRadius: 16, borderWidth: 1, marginTop: 4 },
  forecastIconWrap: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  forecastIconText: { fontSize: 20, fontWeight: '800' },
  forecastTitle: { fontSize: 14, fontWeight: '700' },
  forecastSub: { fontSize: 12, marginTop: 3 },
  forecastArrow: { fontSize: 22 },
});
