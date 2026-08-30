import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { useTheme } from '../constants/theme';

interface Alert {
  id: string;
  type: 'ai' | 'weather' | 'market' | 'port' | 'ais' | 'risk';
  title: string;
  message: string;
  time: string;
  priority: 'high' | 'medium' | 'low';
  icon: string;
}

interface AlertsPanelProps {
  alerts?: Alert[];
}

export function AlertsPanel({ alerts }: AlertsPanelProps) {
  const { colors } = useTheme();

  const defaultAlerts: Alert[] = [
    { id: '1', type: 'ai', title: 'AI Alert', message: 'Freight rates predicted to rise 8% next week', time: '2 hrs ago', priority: 'high', icon: '🤖' },
    { id: '2', type: 'weather', title: 'Weather', message: 'Storm warning near Strait of Malacca', time: '4 hrs ago', priority: 'high', icon: '⛈️' },
    { id: '3', type: 'market', title: 'Market News', message: 'Port of Rotterdam reaches 92% capacity', time: '6 hrs ago', priority: 'medium', icon: '📊' },
    { id: '4', type: 'port', title: 'Port Delays', message: 'Singapore port delays: +3.2 hours average', time: '8 hrs ago', priority: 'medium', icon: '⚓' },
    { id: '5', type: 'ais', title: 'AIS Update', message: 'Vessel MV Explorer position updated', time: '30 mins ago', priority: 'low', icon: '📍' },
    { id: '6', type: 'risk', title: 'Risk Alert', message: 'High piracy risk: Gulf of Aden route', time: '1 hr ago', priority: 'high', icon: '⚠️' },
  ];

  const displayAlerts = alerts || defaultAlerts;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return colors.danger;
      case 'medium':
        return colors.warning;
      default:
        return colors.info;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Text style={[styles.title, { color: colors.text }]}>Intelligence Alerts</Text>

      <ScrollView style={styles.alertsList} showsVerticalScrollIndicator={false}>
        {displayAlerts.map((alert) => (
          <View key={alert.id} style={[styles.alertItem, { borderBottomColor: colors.border }]}>
            <View style={[styles.iconBox, { backgroundColor: colors.cardAlt }]}>
              <Text style={styles.icon}>{alert.icon}</Text>
            </View>

            <View style={styles.content}>
              <View style={styles.header}>
                <Text style={[styles.alertTitle, { color: colors.text }]}>{alert.title}</Text>
                <View style={[styles.priority, { backgroundColor: getPriorityColor(alert.priority) + '20' }]}>
                  <Text style={[styles.priorityText, { color: getPriorityColor(alert.priority) }]}>{alert.priority}</Text>
                </View>
              </View>

              <Text style={[styles.message, { color: colors.textSecondary }]}>{alert.message}</Text>
              <Text style={[styles.time, { color: colors.textMuted }]}>{alert.time}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    padding: 16,
    borderBottomWidth: 1,
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
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 20,
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
    fontWeight: '600',
  },
  priority: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  priorityText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  message: {
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 4,
  },
  time: {
    fontSize: 11,
  },
});
