import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useMemo, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import ScreenShell, { Card, PrimaryButton, SectionHeader } from '../../components/ScreenShell';
import { useTheme } from '../../constants/theme';

const DEFAULTS = {
  freightRate: 43.5,
  fuelPrice: 620,
  distance: 5620,
  cargo: 75000,
  vesselAge: 7,
};

export default function Simulator() {
  const { colors } = useTheme();
  const [freightRate, setFreightRate] = useState(DEFAULTS.freightRate.toString());
  const [fuelPrice, setFuelPrice] = useState(DEFAULTS.fuelPrice.toString());
  const [distance, setDistance] = useState(DEFAULTS.distance.toString());
  const [cargo, setCargo] = useState(DEFAULTS.cargo.toString());
  const [vesselAge, setVesselAge] = useState(DEFAULTS.vesselAge.toString());
  const [simulated, setSimulated] = useState(false);
  const resultAnim = useRef(new Animated.Value(0)).current;

  const simulation = useMemo(() => {
    const rate = Number(freightRate) || 0;
    const fuel = Number(fuelPrice) || 0;
    const dist = Number(distance) || 0;
    const cargoAmt = Number(cargo) || 0;
    const age = Number(vesselAge) || 0;

    const baseRevenue = rate * cargoAmt;
    const fuelCost = dist * (fuel / 85); // Realistic bulk fuel consumption
    const portDischargeDues = 185000; // Paradip / Vizag port handling dues
    const opCost = baseRevenue * 0.14 + portDischargeDues;
    const agePenalty = Math.max(0, age - 10) * 0.015;
    const cost = fuelCost + opCost;
    const profit = baseRevenue - cost - baseRevenue * agePenalty;
    const margin = baseRevenue > 0 ? (profit / baseRevenue) * 100 : 0;
    return { revenue: baseRevenue, cost, profit, margin, fuelCost, portDues: portDischargeDues };
  }, [freightRate, fuelPrice, distance, cargo, vesselAge]);

  const runSimulation = () => {
    setSimulated(false);
    resultAnim.setValue(0);
    setTimeout(() => {
      setSimulated(true);
      Animated.spring(resultAnim, { toValue: 1, friction: 7, tension: 55, useNativeDriver: true }).start();
    }, 350);
  };

  const fmt = (v: number) => {
    if (!Number.isFinite(v)) return '$0';
    if (v >= 1e6) return `$${(v / 1e6).toFixed(2)}M`;
    if (v >= 1e3) return `$${(v / 1e3).toFixed(1)}K`;
    return `$${Math.round(v)}`;
  };

  const resultScale = resultAnim.interpolate({ inputRange: [0, 1], outputRange: [0.96, 1] });

  return (
    <ScreenShell
      title="Voyage Economics Simulator"
      subtitle="Multi-parameter financial model for bulk chartering and procurement (SIH 26006)"
      breadcrumb="Voyage Simulator"
      badge="FINANCIAL ENGINE"
      badgeColor={colors.success}
    >
      {/* Simulation Inputs */}
      <SectionHeader eyebrow="Scenario Parameters" title="Voyage Operational Inputs" />
      <Card style={[styles.inputCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.desc, { color: colors.textSecondary }]}>
          Simulate charter gross margins, bunker sensitivity, and port turnaround fees for overseas shipments to East Coast India.
        </Text>

        <View style={styles.inputGrid}>
          <SimInput label="CHARTER RATE ($/MT)" value={freightRate} suffix="$/MT" onChange={setFreightRate} colors={colors} />
          <SimInput label="BUNKER PRICE ($/MT)" value={fuelPrice} suffix="$/MT" onChange={setFuelPrice} colors={colors} />
          <SimInput label="VOYAGE DISTANCE (NM)" value={distance} suffix="NM" onChange={setDistance} colors={colors} />
          <SimInput label="PARCEL CARGO (MT)" value={cargo} suffix="MT" onChange={setCargo} colors={colors} />
          <SimInput label="VESSEL AGE (YEARS)" value={vesselAge} suffix="YRS" onChange={setVesselAge} colors={colors} />
        </View>

        <PrimaryButton label="SIMULATE VOYAGE SCENARIO" onPress={runSimulation} icon="cpu" />
      </Card>

      {/* Result Card */}
      {simulated && (
        <Animated.View style={{ opacity: resultAnim, transform: [{ scale: resultScale }] }}>
          <Card style={[styles.resultCard, { backgroundColor: colors.cardAlt, borderColor: colors.primary }]}>
            <View style={styles.resultHeader}>
              <View>
                <Text style={[styles.resultEyebrow, { color: colors.primary }]}>PRO FORMA FINANCIAL OUTPUT</Text>
                <Text style={[styles.resultTitle, { color: colors.text }]}>Voyage Profitability & Risk Margin</Text>
              </View>
              <View style={[styles.completeBadge, { backgroundColor: colors.success + '18', borderColor: colors.success }]}>
                <Feather name="check-circle" size={13} color={colors.success} />
                <Text style={[styles.completeText, { color: colors.success }]}>SIMULATED</Text>
              </View>
            </View>

            <View style={[styles.mainResult, { borderBottomColor: colors.divider }]}>
              <View>
                <Text style={[styles.mainLabel, { color: colors.textMuted }]}>PROJECTED NET PROFIT</Text>
                <Text style={[styles.mainProfit, { color: simulation.profit >= 0 ? colors.success : colors.danger }]}>
                  {fmt(simulation.profit)}
                </Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={[styles.mainLabel, { color: colors.textMuted }]}>NET PROFIT MARGIN</Text>
                <Text style={[styles.mainMargin, { color: simulation.margin >= 15 ? colors.success : colors.warning }]}>
                  {simulation.margin.toFixed(1)}%
                </Text>
              </View>
            </View>

            <View style={styles.breakdownGrid}>
              {[
                { l: 'GROSS FREIGHT REVENUE', v: fmt(simulation.revenue), c: colors.text },
                { l: 'TOTAL VOYAGE BUNKER', v: fmt(simulation.fuelCost), c: colors.accent },
                { l: 'PORT HANDLING DUES', v: fmt(simulation.portDues), c: colors.textSecondary },
                { l: 'TOTAL EXPEDITION COST', v: fmt(simulation.cost), c: colors.textSecondary },
              ].map(b => (
                <View key={b.l} style={styles.breakdownCol}>
                  <Text style={[styles.breakdownLabel, { color: colors.textMuted }]}>{b.l}</Text>
                  <Text style={[styles.breakdownValue, { color: b.c }]}>{b.v}</Text>
                </View>
              ))}
            </View>
          </Card>
        </Animated.View>
      )}

      {/* Decision Support Guide */}
      <SectionHeader eyebrow="Decision Support" title="Voyage Sensitivity Profiles" />
      {[
        { title: 'BASE CASE (AUSTRALIA → PARADIP)', desc: 'Panamax bulk carrier with 75K MT coking coal at index forward rate.', num: '01' },
        { title: 'BUNKER SURGE SENSITIVITY (+15%)', desc: 'Stress-test voyage margin against Rotterdam/Singapore VLSFO fuel spikes.', num: '02' },
        { title: 'LIGHTENING & TRANSSHIPMENT OPTION', desc: 'Lightening at Sagar Sandheads before entering draft-constrained Haldia lock.', num: '03' },
      ].map(s => (
        <Card key={s.title} style={[styles.scenarioCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.scenarioNum, { backgroundColor: colors.primary + '18' }]}>
            <Text style={[styles.scenarioNumText, { color: colors.primary }]}>{s.num}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.scenarioTitle, { color: colors.text }]}>{s.title}</Text>
            <Text style={[styles.scenarioDesc, { color: colors.textSecondary }]}>{s.desc}</Text>
          </View>
          <Feather name="arrow-right" size={16} color={colors.primary} />
        </Card>
      ))}
    </ScreenShell>
  );
}

function SimInput({ label, value, suffix, onChange, colors }: any) {
  return (
    <View style={styles.inputWrap}>
      <Text style={[styles.inputLabel, { color: colors.textMuted }]}>{label}</Text>
      <View style={[styles.inputBox, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
        <TextInput
          value={value}
          onChangeText={onChange}
          keyboardType="numeric"
          style={[styles.inputText, { color: colors.inputText }]}
        />
        <Text style={[styles.inputSuffix, { color: colors.textMuted }]}>{suffix}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inputCard: {
    padding: 18,
    marginBottom: 12,
  },
  desc: {
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 14,
  },
  inputGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  inputWrap: {
    flex: 1,
    minWidth: 160,
  },
  inputLabel: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 42,
  },
  inputText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    outlineStyle: 'none',
  },
  inputSuffix: {
    fontSize: 10,
    fontWeight: '800',
  },
  resultCard: {
    padding: 18,
    marginTop: 12,
    marginBottom: 14,
    borderWidth: 1.5,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  resultEyebrow: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '900',
    marginTop: 2,
  },
  completeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  completeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  mainResult: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    marginBottom: 14,
  },
  mainLabel: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  mainProfit: {
    fontSize: 26,
    fontWeight: '900',
    marginTop: 2,
    letterSpacing: -0.5,
  },
  mainMargin: {
    fontSize: 22,
    fontWeight: '900',
    marginTop: 2,
  },
  breakdownGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  breakdownCol: {
    flex: 1,
    minWidth: 140,
  },
  breakdownLabel: {
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  breakdownValue: {
    fontSize: 14,
    fontWeight: '800',
    marginTop: 2,
  },
  scenarioCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    marginBottom: 10,
  },
  scenarioNum: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scenarioNumText: {
    fontSize: 12,
    fontWeight: '800',
  },
  scenarioTitle: {
    fontSize: 13,
    fontWeight: '800',
  },
  scenarioDesc: {
    fontSize: 11,
    lineHeight: 16,
    marginTop: 2,
  },
});
