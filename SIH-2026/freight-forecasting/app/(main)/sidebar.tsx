import React, { useEffect } from 'react';
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';

import { router } from 'expo-router';

const { width } = Dimensions.get('window');

const menuItems = [
  {
    title: 'Command Center',
    description: 'Overview and voyage intelligence',
    route: '/(main)/dashboard',
  },
  {
    title: 'Freight Forecast',
    description: '40-day freight prediction',
    route: '/(main)/forecast',
  },
  {
    title: 'Market Entry',
    description: 'Identify optimal chartering windows',
  },
  {
    title: 'Vessel Optimizer',
    description: 'Match vessel to voyage',
  },
  {
    title: 'Port Compatibility',
    description: 'Port and vessel compatibility',
  },
  {
    title: 'Cost Optimizer',
    description: 'Optimize voyage economics',
  },
  {
    title: 'Contract Optimizer',
    description: 'Evaluate contract strategies',
  },
  {
    title: 'Idle Time Manager',
    description: 'Reduce vessel idle time',
  },
  {
    title: 'Risk Analysis',
    description: 'Operational and market risks',
    route: '/(main)/alerts',
  },
  {
    title: 'Scenario Simulator',
    description: 'Test market scenarios',
  },
  {
    title: 'Roadmap',
    description: 'System development roadmap',
  },
  {
    title: 'AI System Settings',
    description: 'Configure intelligence engine',
  },
];

export default function Sidebar({
  onClose,
}: {
  onClose?: () => void;
}) {
    const slideX = useSharedValue(width);

  useEffect(() => {
    slideX.value = withTiming(0, {
      duration: 350,
    });
  }, []);

  const sidebarAnimation = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: slideX.value,
        },
      ],
    };
  });

  const closeSidebar = () => {
    slideX.value = withTiming(
      width,
      {
        duration: 280,
      },
      () => {
        if (onClose) {
          onClose();
        }
      }
    );
  };
  return (
    <View style={styles.overlay}>
<Animated.View
  style={[
    styles.sidebar,
    sidebarAnimation,
  ]}
>
        {/* HEADER */}

        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>
              FREYNA
            </Text>

            <Text style={styles.title}>
              Command Menu
            </Text>
          </View>

          <TouchableOpacity
            style={styles.closeButton}
            onPress={closeSidebar}
          >
            <Text style={styles.closeText}>
              ×
            </Text>
          </TouchableOpacity>
        </View>

        {/* SYSTEM STATUS */}

        <View style={styles.statusBox}>
          <View style={styles.statusDot} />

          <View>
            <Text style={styles.statusTitle}>
              AI SYSTEM ONLINE
            </Text>

            <Text style={styles.statusDescription}>
              Intelligence engine operational
            </Text>
          </View>
        </View>

        {/* MENU */}

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.menu}
        >
          {menuItems.map((item, index) => {
            const isActive =
              item.title === 'Command Center';

            return (
              <TouchableOpacity
                key={item.title}
                style={[
                  styles.menuItem,
                  isActive && styles.activeItem,
                ]}
                activeOpacity={0.8}
                onPress={() => {
                  if (item.route) {
                    router.push(item.route as any);
                  }

                  closeSidebar();
                  
                }}
              >
                <View
                  style={[
                    styles.itemIndicator,
                    isActive && styles.activeIndicator,
                  ]}
                />

                <View style={styles.itemContent}>
                  <Text
                    style={[
                      styles.itemTitle,
                      isActive && styles.activeTitle,
                    ]}
                  >
                    {item.title}
                  </Text>

                  <Text style={styles.itemDescription}>
                    {item.description}
                  </Text>
                </View>

                <Text style={styles.itemArrow}>
                  →
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* FOOTER */}

        <View style={styles.footer}>
          <Text style={styles.footerTitle}>
            FREYNA
          </Text>

          <Text style={styles.footerText}>
            Freight Intelligence System
          </Text>

          <Text style={styles.version}>
            SYSTEM VERSION 1.0
          </Text>
        </View>

      </Animated.View>

      </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(2, 10, 16, 0.72)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },

  sidebar: {
    width: '86%',
    maxWidth: 390,
    height: '100%',
    backgroundColor: '#06131F',
    borderLeftWidth: 1,
    borderLeftColor: '#1B5364',
    paddingTop: 55,
    paddingHorizontal: 18,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  eyebrow: {
    color: '#3ED3E4',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1.5,
  },

  title: {
    color: '#F0F9FA',
    fontSize: 21,
    fontWeight: '900',
    marginTop: 5,
  },

  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#0B2532',
    borderWidth: 1,
    borderColor: '#19495A',
    justifyContent: 'center',
    alignItems: 'center',
  },

  closeText: {
    color: '#9CB5BE',
    fontSize: 25,
    fontWeight: '300',
    marginTop: -2,
  },

  statusBox: {
    marginTop: 22,
    padding: 13,
    borderRadius: 13,
    backgroundColor: '#09242F',
    borderWidth: 1,
    borderColor: '#174A59',
    flexDirection: 'row',
    alignItems: 'center',
  },

  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#38E49A',
    marginRight: 10,
  },

  statusTitle: {
    color: '#38E49A',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.6,
  },

  statusDescription: {
    color: '#64828D',
    fontSize: 8,
    marginTop: 3,
  },

  menu: {
    paddingTop: 18,
    paddingBottom: 20,
  },

  menuItem: {
    minHeight: 62,
    borderRadius: 13,
    marginBottom: 7,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#081C28',
    borderWidth: 1,
    borderColor: '#102F3D',
  },

  activeItem: {
    backgroundColor: '#0B2D39',
    borderColor: '#1B6A78',
  },

  itemIndicator: {
    width: 3,
    height: 30,
    borderRadius: 2,
    backgroundColor: '#193A46',
    marginRight: 11,
  },

  activeIndicator: {
    backgroundColor: '#3ED3E4',
  },

  itemContent: {
    flex: 1,
  },

  itemTitle: {
    color: '#B5CBD2',
    fontSize: 10,
    fontWeight: '800',
  },

  activeTitle: {
    color: '#EAF9FA',
  },

  itemDescription: {
    color: '#54717C',
    fontSize: 7,
    marginTop: 4,
  },

  itemArrow: {
    color: '#53727D',
    fontSize: 16,
    marginLeft: 8,
  },

  footer: {
    borderTopWidth: 1,
    borderTopColor: '#143642',
    paddingTop: 15,
    paddingBottom: 20,
  },

  footerTitle: {
    color: '#3ED3E4',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1,
  },

  footerText: {
    color: '#66828D',
    fontSize: 8,
    marginTop: 4,
  },

  version: {
    color: '#3E5963',
    fontSize: 7,
    marginTop: 7,
  },
});
