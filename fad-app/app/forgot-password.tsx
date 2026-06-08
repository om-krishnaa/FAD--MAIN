import { Link, router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { apiRequest } from '@/lib/api';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleRequestReset() {
    if (!email) {
      Alert.alert('Missing email', 'Please enter your email address.');
      return;
    }

    try {
      setLoading(true);

      const data = await apiRequest('/auth/request-reset', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });

      if (!data.success) {
        Alert.alert('Reset failed', data.message || 'Something went wrong.');
        return;
      }

      Alert.alert('Code sent', data.message || 'Reset code sent to your email.');
      router.push({
        pathname: '/reset-password',
        params: { email },
      });
    } catch {
      Alert.alert('Error', 'Could not connect to server.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.logo}>FAD</Text>
        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.subtitle}>
          Enter your email to receive a reset code
        </Text>

        <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            placeholderTextColor="#94a3b8"
          />
        </View>

        <Pressable style={styles.button} onPress={handleRequestReset} disabled={loading}>
          <Text style={styles.buttonText}>
            {loading ? 'Sending...' : 'Send Reset Code'}
          </Text>
        </Pressable>

        <Link
          href={{ pathname: '/reset-password', params: { email } }}
          style={styles.linkButton}>
          I already have a code
        </Link>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Remember password?</Text>
          <Link href="/login" style={styles.link}>
            Login
          </Link>
        </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#111827',
  },
  card: {
    padding: 28,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  logo: {
    fontSize: 42,
    fontWeight: '900',
    color: '#3b82f6',
    textAlign: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#3b82f6',
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 32,
    fontSize: 15,
    color: '#d1d5db',
    textAlign: 'center',
  },
  form: {
    gap: 18,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#d1d5db',
  },
  input: {
    height: 52,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#6b7280',
    backgroundColor: '#ffffff',
    fontSize: 16,
    color: '#0f172a',
  },
  button: {
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563eb',
    marginTop: 6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#ffffff',
  },
  linkButton: {
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '800',
    color: '#60a5fa',
  },
  footer: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  footerText: {
    color: '#d1d5db',
  },
  link: {
    fontWeight: '800',
    color: '#60a5fa',
  },
});
