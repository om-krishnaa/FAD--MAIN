import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function PaymentsScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Payments</Text>
      <Text style={styles.subtitle}>Track your earnings and withdrawals</Text>

      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Available Balance</Text>
        <Text style={styles.balanceValue}>Rs. 0</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment History</Text>
        <Text style={styles.emptyText}>No payments yet.</Text>
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
  balanceCard: {
    marginTop: 24,
    padding: 22,
    backgroundColor: '#2563eb',
    borderRadius: 14,
  },
  balanceLabel: {
    color: '#dbeafe',
    fontSize: 15,
  },
  balanceValue: {
    marginTop: 8,
    color: '#ffffff',
    fontSize: 34,
    fontWeight: '800',
  },
  section: {
    marginTop: 24,
    padding: 18,
    backgroundColor: '#ffffff',
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