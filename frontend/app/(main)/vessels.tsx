import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ScreenShell, { Card, SectionHeader } from '../../components/ScreenShell';
import { useTheme } from '../../constants/theme';
import { useAsync } from '../../hooks/useApi';
import { getMeta, type Meta } from '../../services/api';

export default function Vessels() {
  const { colors } = useTheme();
  const meta = useAsync<Meta>(() => getMeta(), []);
  return (
    <ScreenShell title="Vessel Class Intelligence" subtitle="Physical specs feeding the feasibility engine (FR-05)" badge="FLEET DB" badgeColor={colors.primary}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
        {(meta.data?.vessel_classes ?? []).map((v) => (
          <Card key={v.name} style={{ width: 380, flex: 1, minWidth: 330, maxWidth: 430 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ color: colors.text, fontWeight: '900', fontSize: 16 }}>{v.name}</Text>
              <Text style={{ color: colors.primary, fontSize: 11, fontWeight: '800' }}>{v.geared ? 'GEARED ✓' : 'GEARLESS'}</Text>
            </View>
            <View style={[styles.grid, { borderTopColor: colors.border }]}>
              {[
                ['DWT RANGE', `${(v.dwt_range[0] / 1000).toFixed(0)}k–${(v.dwt_range[1] / 1000).toFixed(0)}k t`],
                ['FULL DRAFT', `${v.draft_full_m} m`],
                ['LOA', `${v.loa_m} m`],
                ['BEAM', `${v.beam_m} m`],
              ].map(([k, val]) => (
                <View key={k} style={styles.cell}>
                  <Text style={{ color: colors.textMuted, fontSize: 9, fontWeight: '800', letterSpacing: 0.8 }}>{k}</Text>
                  <Text style={{ color: colors.text, fontSize: 15, fontWeight: '800' }}>{val}</Text>
                </View>
              ))}
            </View>
          </Card>
        ))}
      </View>
      {meta.loading ? <Card><Text style={{ color: colors.textMuted }}>Loading…</Text></Card> : null}
      <SectionHeader eyebrow="USAGE" title="Where these specs apply" />
      <Card>
        <Text style={{ color: colors.textMuted, fontSize: 12.5, lineHeight: 19 }}>
          The Vessel Optimizer screens every class against the port constraint table (draft, LOA, beam, gear) for the selected load/discharge pair, then ranks feasible options by delivered cost using the forecast rate, ML idle-hour prediction and demurrage-risk provision. Source: UNCTAD / Clarksons typical specifications.
        </Text>
      </Card>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', borderTopWidth: 1, marginTop: 12, paddingTop: 10 },
  cell: { flex: 1 },
});
