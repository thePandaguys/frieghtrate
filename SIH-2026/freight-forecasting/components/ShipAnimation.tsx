import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, LayoutChangeEvent, StyleSheet, Text, View } from 'react-native';
import Svg, { Defs, G, LinearGradient, Path, Rect, Stop } from 'react-native-svg';
import { useTheme } from '../constants/theme';

export default function ShipAnimation({
  origin,
  destination,
  isAnalyzing,
}: {
  origin: string;
  destination: string;
  isAnalyzing: boolean;
}) {
  const { colors } = useTheme();
  const [trackWidth, setTrackWidth] = useState(0);
  const shipProgress = useRef(new Animated.Value(0)).current;
  const wavePulse = useRef(new Animated.Value(0)).current;
  const floatValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const bobbing = Animated.loop(
      Animated.sequence([
        Animated.timing(floatValue, {
          toValue: -5,
          duration: 1100,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(floatValue, {
          toValue: 0,
          duration: 1100,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );

    bobbing.start();
    return () => bobbing.stop();
  }, [floatValue]);

  useEffect(() => {
    if (!isAnalyzing) {
      shipProgress.setValue(0);
      wavePulse.setValue(0);
      return;
    }

    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(wavePulse, {
          toValue: 1,
          duration: 600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(wavePulse, {
          toValue: 0,
          duration: 600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );

    pulse.start();

    Animated.parallel([
      Animated.timing(shipProgress, {
        toValue: 1,
        duration: 2400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(wavePulse, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ]).start();

    return () => pulse.stop();
  }, [isAnalyzing, shipProgress, wavePulse]);

  const moveX = shipProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, Math.max(trackWidth - 155, 180)],
  });

  const glowOpacity = wavePulse.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.12, 0.9, 0.22],
  });

  const handleLayout = (event: LayoutChangeEvent) => {
    setTrackWidth(event.nativeEvent.layout.width);
  };

  return (
    <View style={styles.container} onLayout={handleLayout}>
      <View style={styles.routeLabels}>
        <Text style={[styles.portLabel, { color: colors.textSecondary }]}>{origin}</Text>
        <Text style={[styles.portLabel, { color: colors.textSecondary }]}>{destination}</Text>
      </View>

      <View style={[styles.routeTrack, { backgroundColor: colors.card, borderColor: colors.tint }]}>
        <Animated.View
          pointerEvents="none"
          style={[styles.routeGlow, { opacity: glowOpacity, width: trackWidth * 0.92 }]}
        />
        <View style={styles.routeLine} />

        <Animated.View
          pointerEvents="none"
          style={[
            styles.shipWrap,
            {
              transform: [{ translateX: moveX }, { translateY: floatValue }],
            },
          ]}
        >
          <View style={styles.glowTrail} />
          <Svg width={170} height={82} viewBox="0 0 170 82">
            <Defs>
              <LinearGradient id="shipHullGlow" x1="0" y1="0" x2="1" y2="0">
                <Stop offset="0%" stopColor="#EAF9FF" />
                <Stop offset="40%" stopColor="#C7E6F8" />
                <Stop offset="100%" stopColor="#9FCFE1" />
              </LinearGradient>
            </Defs>

            <G>
              <Path d="M8 49H118L134 58H122L116 70H48L36 58H8V49Z" fill="url(#shipHullGlow)" />
              <Path d="M60 32H104L118 49H46L60 32Z" fill="#DDEAF8" />
              <Rect x="67" y="26" width="20" height="13" rx="2" fill="#EAF9FF" />
              <Rect x="90" y="26" width="14" height="13" rx="2" fill="#BFE6F9" />
              <Rect x="52" y="36" width="18" height="12" rx="2" fill="#9FF0FF" opacity={0.9} />
              <Rect x="72" y="36" width="18" height="12" rx="2" fill="#6BCFE8" opacity={0.95} />
              <Rect x="92" y="36" width="17" height="12" rx="2" fill="#28B7D8" opacity={0.9} />
              <Rect x="109" y="36" width="11" height="12" rx="2" fill="#0E6D92" opacity={0.9} />
              <Path d="M18 49H35L40 58H12L18 49Z" fill="#EAF9FF" opacity={0.72} />
              <Path d="M0 58C22 54, 40 58, 52 60C63 62, 80 62, 92 60C106 58, 118 54, 134 58" stroke="rgba(57,216,232,0.75)" strokeWidth="2" fill="none" strokeLinecap="round" />
              <Path d="M12 64C28 60, 45 66, 60 64C75 62, 96 64, 114 60C127 58, 142 60, 150 64" stroke="rgba(124, 228, 255, 0.52)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            </G>
          </Svg>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
    marginTop: 18,
  },
  routeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  portLabel: {
    color: '#A9C8D9',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  routeTrack: {
    position: 'relative',
    height: 120,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: 'rgba(12, 30, 42, 0.82)',
    borderWidth: 1,
    borderColor: 'rgba(118, 146, 168, 0.18)',
  },
  routeGlow: {
    position: 'absolute',
    height: 18,
    borderRadius: 20,
    left: 12,
    top: 52,
    backgroundColor: 'rgba(57, 216, 232, 0.16)',
    shadowColor: '#39D8E8',
    shadowOpacity: 0.35,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 0 },
  },
  routeLine: {
    position: 'absolute',
    left: 12,
    right: 12,
    top: 60,
    height: 3,
    borderRadius: 5,
    backgroundColor: 'rgba(57, 216, 232, 0.9)',
  },
  shipWrap: {
    position: 'absolute',
    left: 16,
    bottom: 18,
    shadowColor: '#55D8F7',
    shadowOpacity: 0.25,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 0 },
  },
  glowTrail: {
    position: 'absolute',
    left: -32,
    top: 30,
    width: 42,
    height: 8,
    borderRadius: 10,
    backgroundColor: 'rgba(57, 216, 232, 0.26)',
    shadowColor: '#39D8E8',
    shadowOpacity: 0.5,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
  },
});
