import { Feather, Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import React from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    useWindowDimensions,
} from 'react-native';
import { useTheme } from '../constants/theme';

const cargoOptions = [
  'Coal',
  'Iron Ore',
  'Grain',
  'Crude Oil',
  'LNG',
  'Containers',
  'Fertilizer',
  'Steel',
  'Cement',
  'Bauxite',
] as const;

const vesselOptions = ['Handysize', 'Supramax', 'Panamax', 'Capesize'] as const;

const contractOptions = [
  'Spot Charter',
  'Time Charter',
  'Voyage Charter',
  'Contract of Affreightment',
] as const;

export const originOptions = [
  'Gladstone',
  'Newcastle',
  'Hay Point',
  'Samarinda (Muara Berau)',
  'Balikpapan',
  'Taboneo (Banjarmasin)',
  'Maputo (Matola Coal)',
  'Beira',
  'Vostochny',
  'Taman Bulk Terminal',
  'Norfolk (Hampton Roads)',
  'New Orleans / Convent',
];

export const destinationOptions = [
  'Paradip',
  'Visakhapatnam (Vizag)',
  'Gangavaram',
  'Dhamra',
  'Gopalpur',
  'Haldia Dock Complex',
  'Sagar / Sandheads Anchorage',
];

export default function VoyagePlanner({
  origin,
  destination,
  cargo,
  quantity,
  vessel,
  contract,
  onOriginChange,
  onDestinationChange,
  onCargoChange,
  onQuantityChange,
  onVesselChange,
  onContractChange,
  onAnalyze,
  isAnalyzing,
}: {
  origin: string;
  destination: string;
  cargo: string;
  quantity: string;
  vessel: string;
  contract: string;
  onOriginChange: (value: string) => void;
  onDestinationChange: (value: string) => void;
  onCargoChange: (value: string) => void;
  onQuantityChange: (value: string) => void;
  onVesselChange: (value: string) => void;
  onContractChange: (value: string) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
}) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const { colors } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Text style={[styles.heading, { color: colors.text }]}>Voyage Planner</Text>
      <Text style={[styles.subHeading, { color: colors.textMuted }]}>Configure voyage details for AI freight forecasting</Text>

      <View style={[styles.row, isMobile && styles.mobileRow]}>
        <View style={styles.inputBox}>
          <Text style={[styles.label, { color: colors.primary }]}>Origin</Text>
          <View style={[styles.pickerWrap, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder }]}>
            <Picker selectedValue={origin} onValueChange={onOriginChange} dropdownIconColor={colors.primary} style={[styles.picker, { color: colors.inputText, backgroundColor: colors.inputBg }]}>
              {originOptions.map((option) => (
                <Picker.Item key={option} label={option} value={option} />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.inputBox}>
          <Text style={[styles.label, { color: colors.primary }]}>Destination</Text>
          <View style={[styles.pickerWrap, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder }]}>
            <Picker selectedValue={destination} onValueChange={onDestinationChange} dropdownIconColor={colors.primary} style={[styles.picker, { color: colors.inputText, backgroundColor: colors.inputBg }]}>
              {destinationOptions.map((option) => (
                <Picker.Item key={option} label={option} value={option} />
              ))}
            </Picker>
          </View>
        </View>
      </View>

      <View style={[styles.row, isMobile && styles.mobileRow]}>
        <View style={styles.inputBox}>
          <Text style={[styles.label, { color: colors.primary }]}>Cargo Type</Text>
          <View style={[styles.pickerWrap, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder }]}>
            <Picker selectedValue={cargo} onValueChange={onCargoChange} dropdownIconColor={colors.primary} style={[styles.picker, { color: colors.inputText, backgroundColor: colors.inputBg }]}>
              {cargoOptions.map((option) => (
                <Picker.Item key={option} label={option} value={option} />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.inputBox}>
          <Text style={[styles.label, { color: colors.primary }]}>Cargo Quantity</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.inputText }]}
            value={quantity}
            onChangeText={onQuantityChange}
            keyboardType="numeric"
            placeholder="75000"
            placeholderTextColor="#6F8A94"
          />
        </View>
      </View>

      <View style={[styles.row, isMobile && styles.mobileRow]}>
        <View style={styles.inputBox}>
          <Text style={[styles.label, { color: colors.primary }]}>Vessel Class</Text>
          <View style={[styles.pickerWrap, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder }]}>
            <Picker selectedValue={vessel} onValueChange={onVesselChange} dropdownIconColor={colors.primary} style={[styles.picker, { color: colors.inputText, backgroundColor: colors.inputBg }]}>
              {vesselOptions.map((option) => (
                <Picker.Item key={option} label={option} value={option} />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.inputBox}>
          <Text style={[styles.label, { color: colors.primary }]}>Contract Type</Text>
          <View style={[styles.pickerWrap, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder }]}>
            <Picker selectedValue={contract} onValueChange={onContractChange} dropdownIconColor={colors.primary} style={[styles.picker, { color: colors.inputText, backgroundColor: colors.inputBg }]}>
              {contractOptions.map((option) => (
                <Picker.Item key={option} label={option} value={option} />
              ))}
            </Picker>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: colors.accent },
          isAnalyzing && styles.buttonDisabled,
        ]}
        onPress={onAnalyze}
        disabled={isAnalyzing}
        activeOpacity={0.85}
      >
        <Feather name={isAnalyzing ? "loader" : "zap"} size={16} color="#FFFFFF" />
        <Text style={styles.buttonText}>{isAnalyzing ? 'Executing Model Inference…' : 'Execute Voyage Analysis'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  heading: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  subHeading: {
    marginTop: 4,
    marginBottom: 16,
    fontSize: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 12,
  },
  mobileRow: {
    flexDirection: 'column',
    gap: 10,
  },
  inputBox: {
    flex: 1,
  },
  label: {
    fontWeight: '700',
    marginBottom: 6,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  pickerWrap: {
    borderRadius: 10,
    borderWidth: 1,
    overflow: 'hidden',
  },
  picker: {
    minHeight: 44,
  },
  input: {
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    fontSize: 13,
    fontWeight: '600',
  },
  button: {
    borderRadius: 12,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 8,
    gap: 8,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
    letterSpacing: 0.3,
  },
});
