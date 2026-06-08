import { StyleSheet, Text, View } from 'react-native';

type StatCardProps = {
  title: string;
  value: string | number;
  accent?: 'blue' | 'green' | 'purple' | 'orange';
};

const accentColors = {
  blue: '#60a5fa',
  green: '#4ade80',
  purple: '#c084fc',
  orange: '#fb923c',
};

export default function StatCard({ title, value, accent = 'blue' }: StatCardProps) {
  return (
    <View style={styles.card}>
      <View style={[styles.iconDot, { backgroundColor: accentColors[accent] }]} />
      <Text style={styles.label}>{title}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48%',
    minHeight: 118,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  iconDot: {
    width: 28,
    height: 28,
    borderRadius: 9,
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    color: '#d1d5db',
  },
  value: {
    marginTop: 8,
    fontSize: 22,
    fontWeight: '900',
    color: '#ffffff',
  },
});