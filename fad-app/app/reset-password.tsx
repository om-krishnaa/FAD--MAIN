import { Link, router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { apiRequest } from '@/lib/api';

export default function ResetPasswordScreen() {
  const params = useLocalSearchParams<{ email?: string }>();
  const [email, setEmail] = useState(params.email || '');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleResetPassword() {
    if (!email || !token || !newPassword) {
      Alert.alert('Missing fields', 'Please enter email, code, and new password.');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Weak password', 'Password must be at least 6 characters.');
      return;
    }

    try {
      setLoading(true);

      const data = await apiRequest('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ email, token, newPassword }),
      });

      if (!data.success) {
        Alert.alert('Reset failed', data.message || 'Something went wrong.');
        return;
      }

      Alert.alert('Success', data.message || 'Password reset successful.');
      router.replace('/login');
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
        <Text style={styles.title}>Enter Reset Code</Text>
        <Text style={styles.subtitle}>
          Enter the reset code and your new password
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

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Reset Code</Text>
          <TextInput
            placeholder="Enter reset code"
            keyboardType="number-pad"
            value={token}
            onChangeText={setToken}
            maxLength={6}
            style={styles.input}
            placeholderTextColor="#94a3b8"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>New Password</Text>
          <TextInput
            placeholder="Enter new password"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
            style={styles.input}
            placeholderTextColor="#94a3b8"
          />
        </View>

        <Pressable style={styles.button} onPress={handleResetPassword} disabled={loading}>
          <Text style={styles.buttonText}>
            {loading ? 'Updating...' : 'Update Password'}
          </Text>
        </Pressable>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Back to</Text>
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
