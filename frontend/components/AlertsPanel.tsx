import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../constants/theme';

interface Alert {
  id: string;
  type: 'ai' | 'weather' | 'market' | 'port' | 'ais' | 'risk';
  title: string;
  message: string;
  time: string;
  priority: 'high' | 'medium' | 'low';
  icon: string;
  iconSet: 'F' | 'M';
}

interface AlertsPanelProps {
  alerts?: Alert[];
}

export function AlertsPanel({ alerts }: AlertsPanelProps) {
  const { colors } = useTheme();

  const defaultAlerts: Alert[] = [
    { id: '1', type: 'ai', title: 'Route Anomaly', message: 'Crosswind band increased across the North Sea corridor.', time: '22m ago', priority: 'high', icon: 'zap', iconSet: 'F' },
    { id: '2', type: 'weather', title: 'Storm Watch', message: 'Squall cluster forming near the English Channel.', time: '1h ago', priority: 'high', icon: 'cloud-lightning', iconSet: 'F' },
    { id: '3', type: 'market', title: 'Freight Rebound', message: 'Dry bulk index rising after port congestion relief.', time: '3h ago', priority: 'medium', icon: 'trending-up', iconSet: 'F' },
    { id: '4', type: 'port', title: 'Port Congestion', message: 'Rotterdam terminal waiting times extended by 18 hours.', time: '5h ago', priority: 'medium', icon: 'anchor', iconSet: 'F' },
    { id: '5', type: 'ais', title: 'AIS Telemetry', message: 'Capesize MV Samudra Ratna passed Singapore waypoints.', time: '6h ago', priority: 'low', icon: 'ship-wheel', iconSet: 'M' },
    { id: '6', type: 'risk', title: 'High Sea Security', message: 'Advisory zone updated for Bab-el-Mandeb Strait.', time: '8h ago', priority: 'high', icon: 'shield-alert', iconSet: 'M' },
  ];

  const displayAlerts = alerts || defaultAlerts;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return colors.danger;
      case 'medium':
        return colors.warning;
      default:
        return colors.primary;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border, shadowColor: colors.shadow }]}>
      <View style={[styles.headerRow, { borderBottomColor: colors.divider }]}>
        <Text style={[styles.title, { color: colors.text }]}>Intelligence Feed</Text>
        <View style={[styles.liveBadge, { backgroundColor: colors.success + '15', borderColor: colors.success }]}>
          <View style={[styles.liveDot, { backgroundColor: colors.success }]} />
          <Text style={[styles.liveBadgeText, { color: colors.success }]}>ACTIVE STREAM</Text>
        </View>
      </View>

      <ScrollView style={styles.alertsList} showsVerticalScrollIndicator={false}>
        {displayAlerts.map((alert) => {
          const pColor = getPriorityColor(alert.priority);
          return (
            <View key={alert.id} style={[styles.alertItem, { borderBottomColor: colors.divider }]}>
              <View style={[styles.iconBox, { backgroundColor: colors.cardAlt, borderColor: colors.border }]}>
                {alert.iconSet === 'F' ? (
                  <Feather name={alert.icon as any} size={15} color={pColor} />
                ) : (
                  <MaterialCommunityIcons name={alert.icon as any} size={16} color={pColor} />
                )}
              </View>

              <View style={styles.content}>
                <View style={styles.header}>
                  <Text style={[styles.alertTitle, { color: colors.text }]}>{alert.title}</Text>
                  <View style={[styles.priority, { backgroundColor: pColor + '15', borderColor: pColor + '40' }]}>
                    <Text style={[styles.priorityText, { color: pColor }]}>{alert.priority.toUpperCase()}</Text>
                  </View>
                </View>

                <Text style={[styles.message, { color: colors.textSecondary }]}>{alert.message}</Text>
                <Text style={[styles.time, { color: colors.textMuted }]}>{alert.time}</Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  liveBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  alertsList: {
    maxHeight: 400,
  },
  alertItem: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    alignItems: 'flex-start',
    gap: 12,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  alertTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  priority: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
  },
  priorityText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  message: {
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 4,
  },
  time: {
    fontSize: 10,
    fontWeight: '600',
  },
});
