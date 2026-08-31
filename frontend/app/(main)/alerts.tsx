import React from 'react';
import { ActivityIndicator, Linking, StyleSheet, Text, View } from 'react-native';
import ScreenShell, { Card, PrimaryButton, SectionHeader } from '../../components/ScreenShell';
import { useTheme } from '../../constants/theme';
import { useAsync } from '../../hooks/useApi';
import { exportAlertsCsvUrl, getAlerts, type Alert } from '../../services/api';

export default function Alerts() {
  const { colors } = useTheme();
  const { data, loading, error, reload } = useAsync<{ alerts: Alert[]; count: number; generated_at: string }>(() => getAlerts(), []);
  const sevColor = (s: string) => (s === 'HIGH' ? colors.danger : s === 'MEDIUM' ? colors.warning : colors.success);

  return (
    <ScreenShell title="Risk Alerts" subtitle="Rule-triggered alert registry: congestion, market moves, volatility spikes, curated calendar (FR-09)" badge={`${data?.count ?? '…'} ACTIVE`} badgeColor={colors.warning}>
      <View style={{ flexDirection: 'row', gap: 10, marginBottom: 12 }}>
        <PrimaryButton label="Re-scan rules" onPress={reload} loading={loading} />
        <PrimaryButton label="Export CSV" variant="ghost" onPress={() => Linking.openURL(exportAlertsCsvUrl())} />
      </View>
      {error ? <Card><Text style={{ color: colors.danger }}>API unavailable: {error}</Text></Card> : null}
      {loading ? <Card><View style={{ alignItems: 'center', padding: 24 }}><ActivityIndicator color={colors.deepAccent} /></View></Card> : null}
      {data ? (
        <View style={{ gap: 10 }}>
          {data.alerts.map((a) => (
            <Card key={a.id}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 6 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <View style={{ backgroundColor: sevColor(a.severity) + '22', borderRadius: 7, paddingHorizontal: 9, paddingVertical: 3 }}>
                    <Text style={{ color: sevColor(a.severity), fontSize: 11, fontWeight: '900' }}>{a.severity}</Text>
                  </View>
                  <Text style={{ color: colors.primary, fontSize: 10, fontWeight: '800', letterSpacing: 1 }}>{a.category}</Text>
                </View>
                <Text style={{ color: colors.textMuted, fontSize: 10 }}>🧾 {a.source}</Text>
              </View>
              <Text style={{ color: colors.text, fontWeight: '800', fontSize: 15, marginTop: 8 }}>{a.title}</Text>
              <Text style={{ color: colors.textSecondary, fontSize: 12.5, marginTop: 3, lineHeight: 18 }}>{a.detail}</Text>
              <Text style={{ color: colors.textMuted, fontSize: 10, marginTop: 6 }}>⏱ {a.timestamp}</Text>
            </Card>
          ))}
          {!data.alerts.length ? (
            <SectionHeader eyebrow="ALL CLEAR" title="No rules currently firing" />
          ) : null}
        </View>
      ) : null}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({});
