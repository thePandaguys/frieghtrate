import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../constants/theme';

const ORANGE = '#FF7A00';

const cargoOptions = ['Coal', 'Iron Ore', 'Grain', 'Crude Oil', 'LNG', 'Containers', 'Fertilizer', 'Steel'];
const vesselOptions = ['Handysize', 'Supramax', 'Panamax', 'Capesize'];
const contractOptions = ['Spot Charter', 'Time Charter', 'Voyage Charter', 'Contract of Affreightment'];
const originOptions = ['Qingdao', 'Singapore', 'Houston', 'Jebel Ali', 'Rotterdam', 'Busan'];
const destinationOptions = ['Hamburg', 'Los Angeles', 'Dubai', 'Ningbo', 'Santos', 'Long Beach'];

function FieldLabel({ label }: { label: string }) {
  return <Text style={s.label}>{label}</Text>;
}

function PickerField({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  const { colors } = useTheme();
  return (
    <View style={s.field}>
      <FieldLabel label={label} />
      <View style={[s.pickerWrap, { backgroundColor: colors.inputBg, borderColor: 'rgba(0,212,255,0.3)' }]}>
        <Picker selectedValue={value} onValueChange={onChange} dropdownIconColor={ORANGE}
          style={[s.picker, { color: colors.inputText, backgroundColor: colors.inputBg }]}>
          {options.map(o => <Picker.Item key={o} label={o} value={o} />)}
        </Picker>
      </View>
    </View>
  );
}

export default function MobileVoyagePlanner({
  origin, destination, cargo, quantity, vessel, contract,
  onOriginChange, onDestinationChange, onCargoChange, onQuantityChange,
  onVesselChange, onContractChange, onAnalyze, isAnalyzing,
}: {
  origin: string; destination: string; cargo: string; quantity: string;
  vessel: string; contract: string;
  onOriginChange: (v: string) => void; onDestinationChange: (v: string) => void;
  onCargoChange: (v: string) => void; onQuantityChange: (v: string) => void;
  onVesselChange: (v: string) => void; onContractChange: (v: string) => void;
  onAnalyze: () => void; isAnalyzing: boolean;
}) {
  const { colors } = useTheme();
  return (
    <View style={[s.card, { backgroundColor: colors.card, borderColor: 'rgba(0,212,255,0.2)' }]}>
      <View style={s.header}>
        <View style={s.headerIcon}>
          <Ionicons name="navigate" size={16} color={ORANGE} />
        </View>
        <View>
          <Text style={[s.title, { color: colors.text }]}>Voyage Planner</Text>
          <Text style={[s.sub, { color: colors.textMuted }]}>Configure for AI freight forecasting</Text>
        </View>
      </View>

      <View style={s.row}>
        <PickerField label="Origin" value={origin} options={originOptions} onChange={onOriginChange} />
        <PickerField label="Destination" value={destination} options={destinationOptions} onChange={onDestinationChange} />
      </View>
      <View style={s.row}>
        <PickerField label="Cargo Type" value={cargo} options={cargoOptions} onChange={onCargoChange} />
        <View style={s.field}>
          <FieldLabel label="Quantity (MT)" />
          <TextInput
            style={[s.input, { backgroundColor: colors.inputBg, borderColor: 'rgba(0,212,255,0.3)', color: colors.inputText }]}
            value={quantity} onChangeText={onQuantityChange}
            keyboardType="numeric" placeholder="75000" placeholderTextColor="#6F8A94"
          />
        </View>
      </View>
      <View style={s.row}>
        <PickerField label="Vessel Class" value={vessel} options={vesselOptions} onChange={onVesselChange} />
        <PickerField label="Contract Type" value={contract} options={contractOptions} onChange={onContractChange} />
      </View>

      <TouchableOpacity
        style={[s.btn, isAnalyzing && s.btnAnalyzing]}
        onPress={onAnalyze} activeOpacity={0.88}
      >
        <Ionicons name={isAnalyzing ? 'pulse' : 'analytics'} size={18} color="#fff" />
        <Text style={s.btnText}>{isAnalyzing ? 'Analyzing Voyage…' : 'Analyze Voyage'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  card: { borderRadius: 20, borderWidth: 1, padding: 16, marginBottom: 16 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 },
  headerIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(255,122,0,0.15)', alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 16, fontWeight: '800' },
  sub: { fontSize: 11, marginTop: 1 },
  row: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  field: { flex: 1 },
  label: { color: '#00D4FF', fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 5 },
  pickerWrap: { borderRadius: 12, borderWidth: 1, overflow: 'hidden' },
  picker: { minHeight: 44 },
  input: { borderRadius: 12, paddingHorizontal: 12, height: 44, borderWidth: 1, fontSize: 13 },
  btn: { backgroundColor: ORANGE, borderRadius: 16, height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 4, shadowColor: ORANGE, shadowOpacity: 0.4, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 6 },
  btnAnalyzing: { opacity: 0.8 },
  btnText: { color: '#fff', fontSize: 15, fontWeight: '800' },
});
