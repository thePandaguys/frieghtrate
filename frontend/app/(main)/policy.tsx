import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ScreenShell, { Card, SectionHeader } from '../../components/ScreenShell';
import { useTheme } from '../../constants/theme';
import { useAsync } from '../../hooks/useApi';
import { getOrigins, getRefreshStatus, getPortAudit, type OriginSupply } from '../../services/api';

/** Origin Supply Watch (FR-10) + data provenance & refresh status (FR-15). */
export default function OriginsAndData() {
  const { colors } = useTheme();
  const origins = useAsync<{ origins: OriginSupply[]; as_of: string }>(() => getOrigins(), []);
  const refresh = useAsync<{ at: string; mode: string; stale: boolean }>(() => getRefreshStatus(), []);
  const audit = useAsync<{ audit: { port_id: string; at: string; changes: Record<string, { old: number; new: number }>; source: string }[] }>(() => getPortAudit(), []);

  return (
    <ScreenShell title="Origin Supply Watch & Data Sources" subtitle="Curated national stats with citations (FR-10) and pipeline freshness (FR-15)" badge="PROVENANCE" badgeColor={colors.primary}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
        {(origins.data?.origins ?? []).map((o) => (
          <Card key={o.origin_id + o.metric} style={{ width: 400, flex: 1, minWidth: 340, maxWidth: 440 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ color: colors.text, fontWeight: '900', fontSize: 15 }}>{o.country}</Text>
              <Text style={{ color: o.trend === 'rising' ? colors.success : o.trend.includes('decline') || o.trend.includes('constrained') ? colors.danger : colors.warning, fontSize: 11, fontWeight: '800' }}>{o.trend.toUpperCase()}</Text>
            </View>
            <Text style={{ color: colors.textSecondary, fontSize: 12, marginTop: 4 }}>{o.metric}</Text>
            <Text style={{ color: colors.deepAccent, fontSize: 20, fontWeight: '900', marginVertical: 6 }}>{o.value}</Text>
            <Text style={{ color: colors.textSecondary, fontSize: 11.5, lineHeight: 16 }}>⚠ {o.disruption}</Text>
            <Text style={{ color: colors.textMuted, fontSize: 10, marginTop: 8, opacity: 0.85 }}>📎 {o.source} · as-of {o.as_of}</Text>
          </Card>
        ))}
      </View>
      {origins.loading ? <Card><Text style={{ color: colors.textMuted }}>Loading…</Text></Card> : null}

      <SectionHeader eyebrow="PIPELINE (FR-15)" title="Data freshness" />
      <Card>
        <View style={styles.line}>
          <Text style={{ color: colors.textSecondary, fontSize: 12 }}>Market-data mode</Text>
          <Text style={{ color: colors.text, fontWeight: '800', fontSize: 12 }}>{refresh.data?.mode ?? '…'}</Text>
        </View>
        <View style={styles.line}>
          <Text style={{ color: colors.textSecondary, fontSize: 12 }}>Last refresh</Text>
          <Text style={{ color: refresh.data?.stale ? colors.warning : colors.success, fontWeight: '800', fontSize: 12 }}>
            {refresh.data?.at ?? '…'} {refresh.data?.stale ? '· STALE — run POST /api/admin/refresh' : '· fresh'}
          </Text>
        </View>
        <Text style={{ color: colors.textMuted, fontSize: 11, marginTop: 10, lineHeight: 16 }}>
          Reference curves are calibrated to published norms and anchored to today's date on every refresh. Live-feed adapters (EIA, MODI, BDI licensed feeds) plug into the same schema without UI changes.
        </Text>
      </Card>

      <SectionHeader eyebrow="AUDIT TRAIL (FR-13)" title={`Port-table edits (${audit.data?.audit.length ?? 0})`} />
      <Card>
        {(audit.data?.audit ?? []).slice().reverse().map((a, i) => (
          <View key={i} style={{ marginBottom: 8 }}>
            <Text style={{ color: colors.text, fontWeight: '800', fontSize: 12 }}>⚙ {a.port_id} · {a.at} · {a.source}</Text>
            {Object.entries(a.changes).map(([k, v]) => (
              <Text key={k} style={{ color: colors.textMuted, fontSize: 11, fontFamily: 'monospace' }}>{k}: {String(v.old)} → {String(v.new)}</Text>
            ))}
          </View>
        ))}
        {!audit.data?.audit.length ? <Text style={{ color: colors.textMuted, fontSize: 12 }}>No manual edits yet — PATCH /api/ports/&#123;id&#125; writes here with old values retained.</Text> : null}
      </Card>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  line: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 },
});
