import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import Animated, {
    FadeIn,
    FadeInDown,
} from 'react-native-reanimated';
import { useTheme } from '../constants/theme';

export default function LandingScreen() {
  const { colors } = useTheme();
  return (
    <LinearGradient
      colors={colors.background === '#FFFFFF' ? ['#FFFFFF', '#E0E4CC', '#A7DBD8'] : ['#06131F', '#0B2432', '#123B4A']}
      style={styles.container}
    >
      <View style={styles.orbOne} />
      <View style={styles.orbTwo} />

      <View style={styles.content}>
        <Animated.View entering={FadeIn.duration(700)} style={styles.logoContainer}>
          <View style={styles.logoGlow}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>F</Text>
            </View>
          </View>
          <Text style={styles.brand}>FREYNA</Text>
          <Text style={styles.subBrand}>Freight Intelligence &amp; Analytics</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(700)} style={styles.hero}>
          <Text style={styles.eyebrow}>AI-powered logistics</Text>
          <Text style={styles.title}>Predict.</Text>
          <Text style={styles.title}>Optimize.</Text>
          <Text style={styles.titleAccent}>Deliver.</Text>
          <Text style={styles.description}>
            Intelligent forecasting for routing, risk, vessel optimization, and profitable freight decisions.
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400).duration(700)} style={styles.visualCard}>
          <View style={styles.shipScene}>
            <View style={styles.glowRing} />
            <View style={styles.shipBody}>
              <View style={styles.shipDeck} />
              <View style={styles.shipBridge} />
              <View style={styles.shipChimney} />
            </View>
            <View style={styles.waveOne} />
            <View style={styles.waveTwo} />
            <View style={styles.waveThree} />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(600).duration(700)} style={styles.buttons}>
          <TouchableOpacity style={styles.primaryButton} onPress={() => router.push('/login')}>
            <Text style={styles.primaryText}>Get Started</Text>
            <Text style={styles.arrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={() => router.push('/login')}>
            <Text style={styles.secondaryText}>Login</Text>
          </TouchableOpacity>

          <Text style={styles.footerText}>Intelligent forecasting • Smarter logistics</Text>
        </Animated.View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  orbOne: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(57,216,232,0.12)',
    top: -40,
    right: -30,
  },
  orbTwo: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(93,168,255,0.10)',
    bottom: 100,
    left: -40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 64,
    paddingBottom: 36,
    justifyContent: 'space-between',
    zIndex: 1,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  logoGlow: {
    padding: 8,
    borderRadius: 22,
    backgroundColor: 'rgba(57,216,232,0.18)',
    shadowColor: '#39D8E8',
    shadowOpacity: 0.45,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 0 },
  },
  logo: {
    width: 70,
    height: 70,
    borderRadius: 20,
    backgroundColor: '#0C2B3B',
    borderWidth: 1,
    borderColor: 'rgba(57,216,232,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 34,
    fontWeight: '900',
    color: '#39D8E8',
  },
  brand: {
    marginTop: 14,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2.2,
    color: '#D9F6FF',
  },
  subBrand: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: '600',
    color: '#9DC8DA',
  },
  hero: {
    alignItems: 'center',
  },
  eyebrow: {
    color: '#7FE9FF',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  title: {
    fontSize: 42,
    fontWeight: '800',
    color: '#EEF9FF',
    lineHeight: 48,
  },
  titleAccent: {
    fontSize: 42,
    fontWeight: '800',
    color: '#39D8E8',
    lineHeight: 48,
  },
  description: {
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 21,
    color: '#CBE6F8',
    maxWidth: 320,
    marginTop: 16,
  },
  visualCard: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(10, 27, 37, 0.45)',
    borderWidth: 1,
    borderColor: 'rgba(130, 174, 200, 0.20)',
    borderRadius: 28,
    padding: 20,
    shadowColor: '#0B2133',
    shadowOpacity: 0.45,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 14 },
  },
  shipScene: {
    width: 300,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  glowRing: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 1,
    borderColor: 'rgba(57,216,232,0.32)',
    backgroundColor: 'rgba(57,216,232,0.06)',
  },
  shipBody: {
    position: 'relative',
    width: 150,
    height: 50,
    marginTop: 22,
  },
  shipDeck: {
    position: 'absolute',
    left: 14,
    top: 18,
    width: 110,
    height: 18,
    borderRadius: 12,
    backgroundColor: '#DFFAFF',
  },
  shipBridge: {
    position: 'absolute',
    left: 100,
    top: 6,
    width: 28,
    height: 18,
    borderRadius: 6,
    backgroundColor: '#91DFFF',
    borderWidth: 1,
    borderColor: '#B8E7F5',
  },
  shipChimney: {
    position: 'absolute',
    left: 24,
    top: 2,
    width: 18,
    height: 20,
    borderRadius: 4,
    backgroundColor: '#9FCBFF',
  },
  waveOne: {
    position: 'absolute',
    bottom: 8,
    left: 30,
    width: 200,
    height: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(57,216,232,0.35)',
  },
  waveTwo: {
    position: 'absolute',
    bottom: 18,
    left: 20,
    width: 220,
    height: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(121,168,206,0.20)',
  },
  waveThree: {
    position: 'absolute',
    bottom: 0,
    left: 10,
    width: 240,
    height: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(81,134,170,0.18)',
  },
  buttons: {
    alignItems: 'center',
    gap: 12,
  },
  primaryButton: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#39D8E8',
    borderRadius: 16,
    paddingVertical: 16,
    shadowColor: '#39D8E8',
    shadowOpacity: 0.35,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
  },
  primaryText: {
    color: '#041A24',
    fontWeight: '800',
    fontSize: 16,
  },
  arrow: {
    color: '#041A24',
    fontWeight: '800',
    fontSize: 18,
  },
  secondaryButton: {
    width: '100%',
    backgroundColor: 'rgba(14, 31, 40, 0.68)',
    borderWidth: 1,
    borderColor: 'rgba(130, 174, 200, 0.18)',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },
  secondaryText: {
    color: '#EAF7FF',
    fontWeight: '700',
    fontSize: 15,
  },
  footerText: {
    color: '#B8D5E8',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 6,
  },
});