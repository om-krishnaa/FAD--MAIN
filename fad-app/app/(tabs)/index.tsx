import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function DashboardScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Dashboard</Text>
      <Text style={styles.subtitle}>Welcome back to FAD</Text>

      <View style={styles.statsGrid}>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Available Ads</Text>
          <Text style={styles.cardValue}>12</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Earnings</Text>
          <Text style={styles.cardValue}>Rs. 0</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Completed</Text>
          <Text style={styles.cardValue}>0</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Pending</Text>
          <Text style={styles.cardValue}>0</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <Text style={styles.emptyText}>No activity yet.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    padding: 20,
    paddingTop: 60,
  },
  heading: {
    fontSize: 30,
    fontWeight: '800',
    color: '#0f172a',
  },
  subtitle: {
    marginTop: 6,
    fontSize: 16,
    color: '#64748b',
  },
  statsGrid: {
    marginTop: 24,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  card: {
    width: '47%',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cardLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  cardValue: {
    marginTop: 8,
    fontSize: 24,
    fontWeight: '800',
    color: '#2563eb',
  },
  section: {
    marginTop: 28,
    backgroundColor: '#ffffff',
    padding: 18,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  emptyText: {
    marginTop: 12,
    color: '#64748b',
  },
});