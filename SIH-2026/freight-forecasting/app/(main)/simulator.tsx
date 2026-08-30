import { router } from 'expo-router';
import React, { useMemo, useRef, useState } from 'react';
import { Animated, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import ScreenShell, { Card, PrimaryButton, SectionHeader } from '../../components/ScreenShell';
import { useTheme } from '../../constants/theme';

const DEFAULTS = { freightRate: 42.8, fuelPrice: 680, distance: 8400, cargo: 85000, vesselAge: 8 };

export default function Simulator() {
  const { colors } = useTheme();
  const [freightRate, setFreightRate] = useState(DEFAULTS.freightRate.toString());
  const [fuelPrice, setFuelPrice]     = useState(DEFAULTS.fuelPrice.toString());
  const [distance, setDistance]       = useState(DEFAULTS.distance.toString());
  const [cargo, setCargo]             = useState(DEFAULTS.cargo.toString());
  const [vesselAge, setVesselAge]     = useState(DEFAULTS.vesselAge.toString());
  const [simulated, setSimulated]     = useState(false);
  const resultAnim = useRef(new Animated.Value(0)).current;

  const simulation = useMemo(() => {
    const rate = Number(freightRate) || 0;
    const fuel = Number(fuelPrice) || 0;
    const dist = Number(distance) || 0;
    const cargoAmt = Number(cargo) || 0;
    const age = Number(vesselAge) || 0;
    const baseRevenue = rate * cargoAmt;
    const fuelCost = dist * (fuel / 100);
    const opCost = baseRevenue * 0.18;
    const agePenalty = Math.max(0, age - 10) * 0.012;
    const cost = fuelCost + opCost;
    const profit = baseRevenue - cost - baseRevenue * agePenalty;
    const margin = baseRevenue > 0 ? (profit / baseRevenue) * 100 : 0;
    return { revenue: baseRevenue, cost, profit, margin };
  }, [freightRate, fuelPrice, distance, cargo, vesselAge]);

  const runSimulation = () => {
    setSimulated(false);
    resultAnim.setValue(0);
    setTimeout(() => {
      setSimulated(true);
      Animated.spring(resultAnim, { toValue: 1, friction: 7, tension: 55, useNativeDriver: true }).start();
    }, 450);
  };

  const fmt = (v: number) => {
    if (!Number.isFinite(v)) return '$0';
    if (v >= 1e6) return `$${(v / 1e6).toFixed(2)}M`;
    if (v >= 1e3) return `$${(v / 1e3).toFixed(1)}K`;
    return `$${Math.round(v)}`;
  };

  const resultScale = resultAnim.interpolate({ inputRange: [0, 1], outputRange: [0.96, 1] });

  return (
    <ScreenShell title="Voyage Simulator" subtitle="Model freight scenarios before committing capital" badge="SIM" badgeColor={colors.primary}>
      {/* Engine Card */}
      <SectionHeader eyebrow="Scenario Engine" title="Simulation Parameters" />
      <Card>
        <Text style={[styles.desc, { color: colors.textSecondary }]}>
          Adjust the operating assumptions below to estimate voyage economics and expected margin.
        </Text>

        <View style={styles.inputRow}>
          <SimInput label="FREIGHT RATE" value={freightRate} suffix="$/MT" onChange={setFreightRate} colors={colors} />
          <SimInput label="FUEL PRICE"   value={fuelPrice}   suffix="$/MT" onChange={setFuelPrice}   colors={colors} />
        </View>
        <View style={styles.inputRow}>
          <SimInput label="ROUTE DISTANCE" value={distance} suffix="NM"    onChange={setDistance} colors={colors} />
          <SimInput label="CARGO"          value={cargo}    suffix="MT"    onChange={setCargo}    colors={colors} />
        </View>
        <SimInput label="VESSEL AGE" value={vesselAge} suffix="YEARS" onChange={setVesselAge} colors={colors} />

        <PrimaryButton label="RUN SIMULATION →" onPress={runSimulation} icon="cpu" />
      </Card>

      {/* Result */}
      {simulated && (
        <Animated.View style={{ opacity: resultAnim, transform: [{ scale: resultScale }] }}>
          <Card style={[styles.resultCard, { borderColor: colors.deepAccent, borderWidth: 2 }]}>
            <View style={styles.resultHeader}>
              <View>
                <Text style={[styles.resultEyebrow, { color: colors.primary }]}>SIMULATION OUTPUT</Text>
                <Text style={[styles.resultTitle, { color: colors.text }]}>Projected Voyage Economics</Text>
              </View>
              <View style={[styles.completeBadge, { backgroundColor: colors.successBg, borderColor: colors.success }]}>
                <View style={[styles.completeDot, { backgroundColor: colors.success }]} />
                <Text style={[styles.completeText, { color: colors.success }]}>COMPLETE</Text>
              </View>
            </View>

            <View style={[styles.mainResult, { borderBottomColor: colors.divider }]}>
              <Text style={[styles.mainLabel, { color: colors.textMuted }]}>ESTIMATED PROFIT</Text>
              <Text style={[styles.mainValue, { color: colors.deepAccent }]}>{fmt(simulation.profit)}</Text>
              <View style={[styles.marginBadge, { backgroundColor: colors.successBg, borderColor: colors.success }]}>
                <Text style={[styles.marginText, { color: colors.success }]}>{simulation.margin.toFixed(1)}% MARGIN</Text>
              </View>
            </View>

            <View style={styles.resultGrid}>
              {[
                { l: 'EST. REVENUE', v: fmt(simulation.revenue) },
                { l: 'EST. COST',    v: fmt(simulation.cost) },
                { l: 'CARGO',        v: `${Number(cargo) || 0} MT` },
                { l: 'DISTANCE',     v: `${Number(distance) || 0} NM` },
              ].map(m => (
                <View key={m.l} style={[styles.resultMetric, { borderBottomColor: colors.divider }]}>
                  <Text style={[styles.metricLabel, { color: colors.textMuted }]}>{m.l}</Text>
                  <Text style={[styles.metricValue, { color: colors.text }]}>{m.v}</Text>
                </View>
              ))}
            </View>

            <View style={[styles.verdictCard, { backgroundColor: colors.successBg, borderColor: colors.success }]}>
              <View style={[styles.verdictIcon, { backgroundColor: colors.success }]}>
                <Text style={styles.verdictCheck}>✓</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.verdictTitle, { color: colors.text }]}>Favorable Scenario</Text>
                <Text style={[styles.verdictDesc, { color: colors.textSecondary }]}>
                  Current assumptions indicate a positive voyage margin. Validate against the latest forecast and market risk before execution.
                </Text>
              </View>
            </View>
          </Card>
        </Animated.View>
      )}

      {/* Scenario Guide */}
      <SectionHeader eyebrow="Decision Support" title="Scenario Guide" right="03" />
      {[
        { title: 'BASE CASE',    desc: 'Use current market assumptions as the reference scenario.', num: '01' },
        { title: 'HIGH FREIGHT', desc: 'Test profitability if freight rates increase.',              num: '02' },
        { title: 'HIGH COST',    desc: 'Stress-test the voyage against increased operating costs.',  num: '03' },
      ].map(s => (
        <Card key={s.title} style={styles.scenarioCard}>
          <View style={[styles.scenarioNum, { backgroundColor: colors.deepAccent + '18' }]}>
            <Text style={[styles.scenarioNumText, { color: colors.deepAccent }]}>{s.num}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.scenarioTitle, { color: colors.text }]}>{s.title}</Text>
            <Text style={[styles.scenarioDesc, { color: colors.textSecondary }]}>{s.desc}</Text>
          </View>
          <Text style={[styles.scenarioArrow, { color: colors.primary }]}>→</Text>
        </Card>
      ))}

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
          <Text style={[styles.forecastTitle, { color: colors.text }]}>Compare With Forecast</Text>
          <Text style={[styles.forecastSub, { color: colors.textSecondary }]}>Use AI freight projections to validate your scenario</Text>
        </View>
        <Text style={[styles.forecastArrow, { color: colors.deepAccent }]}>→</Text>
      </TouchableOpacity>
    </ScreenShell>
  );
}

function SimInput({ label, value, suffix, onChange, colors }: { label: string; value: string; suffix: string; onChange: (v: string) => void; colors: any }) {
  return (
    <View style={styles.inputContainer}>
      <Text style={[styles.inputLabel, { color: colors.textMuted }]}>{label}</Text>
      <View style={[styles.inputBox, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder }]}>
        <TextInput
          value={value}
          onChangeText={onChange}
          keyboardType="numeric"
          style={[styles.input, { color: colors.inputText }]}
          placeholder="0"
          placeholderTextColor={colors.placeholder}
        />
        <Text style={[styles.inputSuffix, { color: colors.textMuted }]}>{suffix}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  desc: { fontSize: 13, lineHeight: 19, marginBottom: 12 },
  inputRow: { flexDirection: 'row', gap: 10 },
  inputContainer: { flex: 1, marginTop: 12 },
  inputLabel: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 },
  inputBox: { height: 48, borderRadius: 12, borderWidth: 1.5, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12 },
  input: { flex: 1, fontSize: 14, fontWeight: '700', paddingVertical: 0 },
  inputSuffix: { fontSize: 11, fontWeight: '600', marginLeft: 6 },
  resultCard: { borderRadius: 18 },
  resultHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  resultEyebrow: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  resultTitle: { fontSize: 18, fontWeight: '800', marginTop: 3 },
  completeBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20, borderWidth: 1 },
  completeDot: { width: 6, height: 6, borderRadius: 3 },
  completeText: { fontSize: 11, fontWeight: '700' },
  mainResult: { alignItems: 'center', paddingVertical: 20, borderBottomWidth: 1, marginBottom: 8 },
  mainLabel: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  mainValue: { fontSize: 36, fontWeight: '800', marginTop: 4 },
  marginBadge: { flexDirection: 'row', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, marginTop: 8 },
  marginText: { fontSize: 12, fontWeight: '700' },
  resultGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  resultMetric: { width: '50%', paddingVertical: 12, borderBottomWidth: 1 },
  metricLabel: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  metricValue: { fontSize: 14, fontWeight: '700', marginTop: 4 },
  verdictCard: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 12, borderWidth: 1, marginTop: 12 },
  verdictIcon: { width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  verdictCheck: { color: '#FFFFFF', fontSize: 18, fontWeight: '800' },
  verdictTitle: { fontSize: 14, fontWeight: '700', marginBottom: 3 },
  verdictDesc: { fontSize: 12, lineHeight: 18 },
  scenarioCard: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14 },
  scenarioNum: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  scenarioNumText: { fontSize: 13, fontWeight: '800' },
  scenarioTitle: { fontSize: 13, fontWeight: '700' },
  scenarioDesc: { fontSize: 12, marginTop: 3 },
  scenarioArrow: { fontSize: 20 },
  forecastBtn: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderRadius: 16, borderWidth: 1, marginTop: 4 },
  forecastIconWrap: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  forecastIconText: { fontSize: 20, fontWeight: '800' },
  forecastTitle: { fontSize: 14, fontWeight: '700' },
  forecastSub: { fontSize: 12, marginTop: 3 },
  forecastArrow: { fontSize: 22 },
});
