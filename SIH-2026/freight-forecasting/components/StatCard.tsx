import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';

type StatCardProps = {
  title: string;
  value: string;
  change?: string;
  icon?: string;
};

export default function StatCard({
  title,
  value,
  change,
  icon,
}: StatCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <Text style={styles.title}>{title}</Text>

        {icon && <Text style={styles.icon}>{icon}</Text>}
      </View>

      <Text style={styles.value}>{value}</Text>

      {change && (
        <Text style={styles.change}>
          {change}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    width: '48%',
  },

  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  title: {
    fontSize: 13,
    color: Colors.secondaryText,
    fontWeight: '500',
  },

  icon: {
    fontSize: 20,
  },

  value: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginTop: 10,
  },

  change: {
    fontSize: 12,
    color: Colors.success,
    marginTop: 6,
    fontWeight: '600',
  },
});
