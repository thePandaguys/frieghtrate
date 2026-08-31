import { router } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
    FadeIn,
    ZoomIn,
} from 'react-native-reanimated';

import { Colors } from '../constants/colors';
import { useTheme } from '../constants/theme';

export default function SplashScreen() {
  const { colors } = useTheme();
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/landing');
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>

      <Animated.View
        entering={ZoomIn.duration(700)}
        style={[styles.logo, { backgroundColor: colors.tint }]}
      >
        <Text style={styles.logoText}>
          F
        </Text>
      </Animated.View>

      <Animated.View
        entering={FadeIn.delay(400).duration(700)}
      >
        <Text style={styles.brand}>
          FREYNA
        </Text>

        <Text style={[styles.tagline, { color: colors.text }]}>
          Freight Intelligence &amp; Analytics
        </Text>
      </Animated.View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },

  logo: {
    width: 90,
    height: 90,
    borderRadius: 28,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },

  logoText: {
    fontSize: 48,
    fontWeight: '900',
    color: Colors.primary,
  },

  brand: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 3,
    textAlign: 'center',
    marginTop: 18,
  },

  tagline: {
    color: '#DBEAFE',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 7,
  },
});