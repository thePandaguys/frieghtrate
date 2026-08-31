import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ScreenShell, { Card, SectionHeader } from '../../components/ScreenShell';
import { useTheme } from '../../constants/theme';
import { useAsync } from '../../hooks/useApi';
import { getPorts, getSnapshot, type PortInfo, type Snapshot } from '../../services/api';

export default function Routes() {
  const { colors } = useTheme();
  const ports = useAsync<{ ports: PortInfo[] }>(() => getPorts(), []);
  const snap = useAsync<Snapshot>(() => getSnapshot(), []);
  const [tab, setTab] = useState<'destination' | 'origin'>('destination');
  const list = (ports.data?.ports ?? []).filter((p) => p.role === tab);
  const congOf = (id: string) => snap.data?.port_congestion.find((c) => c.port_id === id);

  return (
    <ScreenShell title="Port & Route Intelligence" subtitle="Physical constraint cards: draft / LOA / beam / handling — with source and as-of date (capability 6, FR-13 editable)" badge="PORT DB" badgeColor={colors.primary}>
      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
        {(['destination', 'origin'] as const).map((t) => (
          <Text key={t} onPress={() => setTab(t)}
            style={[styles.tab, tab === t && { backgroundColor: colors.deepAccent, color: '#FFF' }]}>
            {t === 'destination' ? 'India East Coast — discharge' : 'Loading origins — overseas'}
          </Text>
        ))}
      </View>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
        {list.map((p) => {
          const c = congOf(p.id);
          return (
            <Card key={p.id} style={{ width: 390, flex: 1, minWidth: 340, maxWidth: 430 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View>
                  <Text style={{ color: colors.text, fontWeight: '900', fontSize: 15 }}>{p.name}</Text>
                  <Text style={{ color: colors.textMuted, fontSize: 11 }}>{p.country} · {p.berths} berths · {p.handling_rate_tph.toLocaleString()} t/h</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  {c ? (
                    <>
                      <Text style={{ color: c.congestion_index > 60 ? colors.danger : c.congestion_index > 40 ? colors.warning : colors.success, fontWeight: '900', fontSize: 15 }}>
                        {c.congestion_index.toFixed(0)}/100
                      </Text>
                      <Text style={{ color: colors.textMuted, fontSize: 10 }}>congestion · ~{c.waiting_hours.toFixed(0)}h wait</Text>
                    </>
                  ) : null}
                </View>
              </View>
              <View style={[styles.specGrid, { borderTopColor: colors.border }]}>
                {[
                  ['MAX DRAFT', `${p.max_draft_m} m`],
                  ['MAX LOA', `${p.max_loa_m} m`],
                  ['MAX BEAM', `${p.max_beam_m} m`],
                  ['MAX VESSEL', `${(p.max_dwt / 1000).toFixed(0)}k DWT`],
                ].map(([k, v]) => (
                  <View key={k} style={styles.specCell}>
                    <Text style={{ color: colors.textMuted, fontSize: 9, fontWeight: '800', letterSpacing: 0.8 }}>{k}</Text>
                    <Text style={{ color: colors.text, fontSize: 15, fontWeight: '800' }}>{v}</Text>
                  </View>
                ))}
              </View>
              {p.channel_notes ? <Text style={{ color: colors.textSecondary, fontSize: 11, marginTop: 8, lineHeight: 15 }}>⚓ {p.channel_notes}</Text> : null}
              <Text style={{ color: colors.textMuted, fontSize: 10, marginTop: 8, opacity: 0.8 }}>📎 {p.source} · as-of {p.as_of}</Text>
            </Card>
          );
        })}
      </View>
      {ports.loading ? <Card><Text style={{ color: colors.textMuted }}>Loading port table…</Text></Card> : null}
      {ports.error ? <Card><Text style={{ color: colors.danger }}>API unavailable: {ports.error}</Text></Card> : null}

      <SectionHeader eyebrow="DATA ADMIN (FR-13)" title="Port constraint edits are audited" />
      <Card>
        <Text style={{ color: colors.textMuted, fontSize: 12, lineHeight: 18 }}>
          Port constraint values are served by <Text style={{ fontFamily: 'monospace' }}>GET /api/ports</Text> and can be updated by a data administrator via
          <Text style={{ fontFamily: 'monospace' }}> PATCH /api/ports/&#123;id&#125;</Text> — every change is logged with old values retained (<Text style={{ fontFamily: 'monospace' }}>GET /api/ports/audit</Text>). This keeps the feasibility rule engine (FR-05) in sync with published draft circulars.
        </Text>
      </Card>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  tab: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 9, backgroundColor: 'rgba(127,127,127,0.12)', fontSize: 12, fontWeight: '800', overflow: 'hidden' },
  specGrid: { flexDirection: 'row', borderTopWidth: 1, marginTop: 12, paddingTop: 10 },
  specCell: { flex: 1 },
});
