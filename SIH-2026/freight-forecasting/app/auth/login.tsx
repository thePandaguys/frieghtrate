import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useTheme } from '../../constants/theme';

export default function LoginScreen() {
  const { colors } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.replace('/(main)/dashboard');
    }, 1400);
  };

  return (
    <KeyboardAvoidingView style={[styles.root, { backgroundColor: colors.background }]} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Ocean gradient header */}
        <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
          <View style={[styles.brandMark, { backgroundColor: colors.deepAccent }]}>
            <Text style={styles.brandMarkText}>F</Text>
          </View>
          <View>
            <Text style={[styles.brandName, { color: colors.text }]}>FREYNA</Text>
            <Text style={[styles.brandSub, { color: colors.textMuted }]}>Freight Intelligence & Analytics</Text>
          </View>
        </View>

        {/* Hero strip */}
        <View style={[styles.heroStrip, { backgroundColor: colors.deepAccent }]}>
          <Text style={styles.heroTitle}>Ocean Freight Intelligence</Text>
          <Text style={styles.heroSub}>AI-powered maritime analytics platform</Text>
          <View style={styles.heroBadges}>
            {['AI Forecasting', 'Route Optimization', 'Risk Analysis'].map(b => (
              <View key={b} style={styles.heroBadge}>
                <Text style={styles.heroBadgeText}>{b}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Login card */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, shadowColor: colors.shadow }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Sign In</Text>
          <Text style={[styles.cardSub, { color: colors.textMuted }]}>Access your freight intelligence workspace</Text>

          <View style={styles.form}>
            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: colors.primary }]}>EMAIL ADDRESS</Text>
              <View style={[styles.inputWrap, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder }]}>
                <Feather name="mail" size={16} color={colors.primary} />
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="operator@freyna.io"
                  placeholderTextColor={colors.placeholder}
                  style={[styles.input, { color: colors.inputText }]}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: colors.primary }]}>PASSWORD</Text>
              <View style={[styles.inputWrap, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder }]}>
                <Feather name="lock" size={16} color={colors.primary} />
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter your password"
                  placeholderTextColor={colors.placeholder}
                  style={[styles.input, { color: colors.inputText }]}
                  secureTextEntry={!showPassword}
                />
                <Pressable onPress={() => setShowPassword(v => !v)}>
                  <Feather name={showPassword ? 'eye-off' : 'eye'} size={16} color={colors.textMuted} />
                </Pressable>
              </View>
            </View>

            <Pressable
              onPress={handleLogin}
              disabled={loading}
              style={({ pressed }) => [styles.loginBtn, { backgroundColor: colors.deepAccent, opacity: pressed || loading ? 0.85 : 1 }]}
            >
              <Feather name="log-in" size={18} color="#FFFFFF" />
              <Text style={styles.loginBtnText}>{loading ? 'SIGNING IN…' : 'SIGN IN TO FREYNA'}</Text>
            </Pressable>

            <Pressable style={styles.forgotRow}>
              <Text style={[styles.forgotText, { color: colors.primary }]}>Forgot password?</Text>
            </Pressable>
          </View>
        </View>

        {/* Stats strip */}
        <View style={[styles.statsStrip, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {[
            { value: '486', label: 'Vessels Tracked' },
            { value: '91.8%', label: 'AI Accuracy' },
            { value: '28', label: 'Active Routes' },
          ].map(s => (
            <View key={s.label} style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.deepAccent }]}>{s.value}</Text>
              <Text style={[styles.statLabel, { color: colors.textMuted }]}>{s.label}</Text>
            </View>
          ))}
        </View>

        <Text style={[styles.footer, { color: colors.textMuted }]}>FREYNA v1.0 • Freight Intelligence Platform</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { flexGrow: 1, paddingBottom: 40 },

  header: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    paddingHorizontal: 24, paddingVertical: 20, borderBottomWidth: 1,
  },
  brandMark: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  brandMarkText: { color: '#FFFFFF', fontSize: 24, fontWeight: '800' },
  brandName: { fontSize: 22, fontWeight: '800', letterSpacing: 0.3 },
  brandSub: { fontSize: 11, fontWeight: '600', marginTop: 2 },

  heroStrip: {
    paddingHorizontal: 24, paddingVertical: 28,
  },
  heroTitle: { color: '#FFFFFF', fontSize: 26, fontWeight: '800', marginBottom: 6 },
  heroSub: { color: 'rgba(255,255,255,0.8)', fontSize: 14, marginBottom: 16 },
  heroBadges: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  heroBadge: {
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)',
  },
  heroBadgeText: { color: '#FFFFFF', fontSize: 11, fontWeight: '700' },

  card: {
    margin: 20, borderRadius: 20, borderWidth: 1, padding: 24,
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 1, shadowRadius: 16, elevation: 4,
  },
  cardTitle: { fontSize: 24, fontWeight: '800', marginBottom: 4 },
  cardSub: { fontSize: 13, marginBottom: 24 },

  form: { gap: 16 },
  fieldGroup: { gap: 6 },
  label: { fontSize: 10, fontWeight: '700', letterSpacing: 1.2, textTransform: 'uppercase' },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    height: 52, borderRadius: 14, borderWidth: 1.5, paddingHorizontal: 14,
  },
  input: { flex: 1, fontSize: 14, fontWeight: '500' },

  loginBtn: {
    height: 56, borderRadius: 16, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 8,
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  loginBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '800', letterSpacing: 0.5 },

  forgotRow: { alignItems: 'center', paddingVertical: 4 },
  forgotText: { fontSize: 13, fontWeight: '600' },

  statsStrip: {
    flexDirection: 'row', marginHorizontal: 20, borderRadius: 16, borderWidth: 1,
    paddingVertical: 16,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 22, fontWeight: '800' },
  statLabel: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 4 },

  footer: { textAlign: 'center', fontSize: 11, fontWeight: '600', letterSpacing: 0.8, marginTop: 20 },
});
