import { ScrollView, StyleSheet, Text, View } from 'react-native';

const ads = [
  { id: 1, title: 'Watch product video', reward: 'Rs. 10' },
  { id: 2, title: 'Visit campaign page', reward: 'Rs. 15' },
  { id: 3, title: 'Complete brand task', reward: 'Rs. 20' },
];

export default function AdsScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Ads</Text>
      <Text style={styles.subtitle}>Available earning tasks</Text>

      {ads.map((ad) => (
        <View key={ad.id} style={styles.card}>
          <View>
            <Text style={styles.title}>{ad.title}</Text>
            <Text style={styles.meta}>Available now</Text>
          </View>

          <Text style={styles.reward}>{ad.reward}</Text>
        </View>
      ))}
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
    marginBottom: 24,
    fontSize: 16,
    color: '#64748b',
  },
  card: {
    marginBottom: 14,
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  meta: {
    marginTop: 4,
    color: '#64748b',
  },
  reward: {
    fontSize: 16,
    fontWeight: '800',
    color: '#16a34a',
  },
});