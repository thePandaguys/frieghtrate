import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useTheme } from '../constants/theme';

export default function LoginScreen() {
  const { colors } = useTheme();
  return (
    <LinearGradient colors={colors.background === '#FFFFFF' ? ['#FFFFFF', '#E0E4CC', '#A7DBD8'] : ['#06131F', '#0B2432', '#123B4A']} style={styles.container}>
      <View style={styles.orbOne} />
      <View style={styles.orbTwo} />

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backText}>←</Text>
            <Text style={styles.backLabel}>Back</Text>
          </TouchableOpacity>

          <Animated.View entering={FadeIn.duration(600)} style={styles.logoContainer}>
            <View style={styles.logoGlow}>
              <View style={styles.logo}>
                <Text style={styles.logoText}>F</Text>
              </View>
            </View>
            <Text style={styles.brand}>FREYNA</Text>
            <Text style={styles.subBrand}>Freight Intelligence &amp; Analytics</Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(150).duration(600)} style={styles.titleContainer}>
            <Text style={styles.title}>Welcome back</Text>
            <Text style={styles.subtitle}>Sign in to access your maritime intelligence dashboard.</Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(300).duration(600)} style={styles.formCard}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              placeholder="Enter your email"
              placeholderTextColor="#8CAEC1"
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
            />

            <Text style={styles.label}>Password</Text>
            <TextInput
              placeholder="Enter your password"
              placeholderTextColor="#8CAEC1"
              secureTextEntry
              style={styles.input}
            />

            <View style={styles.rowBetween}>
              <TouchableOpacity style={styles.rememberWrap}>
                <View style={styles.checkbox} />
                <Text style={styles.rememberText}>Remember Me</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text style={styles.forgot}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.loginButton} onPress={() => router.replace('/(main)/dashboard')}>
              <Text style={styles.loginText}>Sign In</Text>
              <Text style={styles.arrow}>→</Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(450).duration(600)} style={styles.demoCard}>
            <Text style={styles.demoIcon}>💡</Text>
            <View style={styles.demoContent}>
              <Text style={styles.demoTitle}>Demo Mode</Text>
              <Text style={styles.demoText}>Use any email and password to explore the prototype.</Text>
            </View>
          </Animated.View>

          <Text style={styles.footer}>Freight Intelligence System • v1.0.0</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, position: 'relative' },
  orbOne: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(57,216,232,0.12)',
    top: -40,
    left: -20,
  },
  orbTwo: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(93,168,255,0.10)',
    bottom: -60,
    right: -40,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 52,
    paddingBottom: 30,
    justifyContent: 'center',
    zIndex: 1,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: 18,
  },
  backText: { fontSize: 28, color: '#EAF7FF', marginRight: 6 },
  backLabel: { fontSize: 13, color: '#CFEAF8' },
  logoContainer: { alignItems: 'center', marginTop: 6, marginBottom: 26 },
  logoGlow: {
    padding: 8,
    borderRadius: 22,
    backgroundColor: 'rgba(57,216,232,0.18)',
    shadowColor: '#39D8E8',
    shadowOpacity: 0.35,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 0 },
  },
  logo: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: '#0C2B3B',
    borderWidth: 1,
    borderColor: 'rgba(57,216,232,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: { fontSize: 30, fontWeight: '900', color: '#39D8E8' },
  brand: { fontSize: 12, fontWeight: '800', letterSpacing: 2.3, color: '#D9F6FF', marginTop: 14 },
  subBrand: { marginTop: 6, fontSize: 12, color: '#9DC8DA', fontWeight: '600' },
  titleContainer: { alignItems: 'center', marginBottom: 16 },
  title: { fontSize: 32, fontWeight: '800', color: '#EEF9FF', marginBottom: 8 },
  subtitle: { color: '#CBE6F8', fontSize: 14, textAlign: 'center', maxWidth: 300 },
  formCard: {
    backgroundColor: 'rgba(10, 27, 37, 0.68)',
    borderWidth: 1,
    borderColor: 'rgba(130, 174, 200, 0.20)',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#06131F',
    shadowOpacity: 0.38,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 16 },
  },
  label: { color: '#DBF6FF', fontSize: 12, fontWeight: '700', marginBottom: 10 },
  input: {
    backgroundColor: 'rgba(14, 31, 40, 0.82)',
    borderWidth: 1,
    borderColor: 'rgba(130, 174, 200, 0.18)',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#EAF7FF',
    fontSize: 15,
    marginBottom: 16,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  rememberWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkbox: {
    width: 14,
    height: 14,
    borderRadius: 4,
    backgroundColor: 'rgba(57,216,232,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(57,216,232,0.45)',
  },
  rememberText: { color: '#CBE6F8', fontSize: 12, fontWeight: '600' },
  forgot: { color: '#39D8E8', fontSize: 12, fontWeight: '700' },
  loginButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#39D8E8',
    borderRadius: 16,
    paddingVertical: 16,
    shadowColor: '#39D8E8',
    shadowOpacity: 0.30,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 12 },
  },
  loginText: { color: '#041A24', fontWeight: '800', fontSize: 16 },
  arrow: { color: '#041A24', fontWeight: '800', fontSize: 18 },
  demoCard: {
    marginTop: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(14, 31, 40, 0.72)',
    borderWidth: 1,
    borderColor: 'rgba(130, 174, 200, 0.18)',
    borderRadius: 18,
    padding: 14,
  },
  demoIcon: { fontSize: 22 },
  demoContent: { flex: 1 },
  demoTitle: { color: '#EAF7FF', fontWeight: '700', fontSize: 13, marginBottom: 4 },
  demoText: { color: '#CFEAF8', fontSize: 12, lineHeight: 18 },
  footer: { marginTop: 18, textAlign: 'center', color: '#B8D5E8', fontSize: 11 },
});