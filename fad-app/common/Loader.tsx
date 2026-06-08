import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

type LoaderProps = {
  message?: string;
};

export default function Loader({ message = 'Loading...' }: LoaderProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator color="#2563eb" />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  text: {
    fontSize: 14,
    color: '#64748b',
  },
});