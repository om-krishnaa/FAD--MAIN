import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Link, router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import * as SecureStore from 'expo-secure-store';

type SavedUser = {
  name?: string;
  email?: string;
  status?: string;
  role?: string;
};

export default function ProfileScreen() {
  const [user, setUser] = useState<SavedUser | null>(null);

  useFocusEffect(
    useCallback(() => {
      async function loadUser() {
        const savedUser = await SecureStore.getItemAsync('fad_user');

        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      }

      loadUser();
    }, [])
  );

  async function handleLogout() {
    await SecureStore.deleteItemAsync('fad_token');
    await SecureStore.deleteItemAsync('fad_user');
    setUser(null);
    router.replace('/login');
  }

  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {(user?.name || user?.email || 'F').charAt(0).toUpperCase()}
        </Text>
      </View>

      <Text style={styles.name}>{user?.name || 'FAD User'}</Text>
      <Text style={styles.email}>{user?.email || 'user@example.com'}</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Account Status</Text>
        <Text style={styles.value}>{user?.status || 'Active'}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Role</Text>
        <Text style={styles.value}>{user?.role || 'User'}</Text>
      </View>

      {user ? (
        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </Pressable>
      ) : (
        <Link href="/login" style={styles.loginLink}>
          Go to Login
        </Link>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  loginLink: {
    marginTop: 24,
    fontSize: 16,
    fontWeight: '800',
    color: '#2563eb',
  },
  logoutButton: {
    width: '100%',
    height: 52,
    marginTop: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#dc2626',
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#ffffff',
  },
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 80,
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563eb',
  },
  avatarText: {
    fontSize: 36,
    fontWeight: '800',
    color: '#ffffff',
  },
  name: {
    marginTop: 18,
    fontSize: 24,
    fontWeight: '800',
    color: '#0f172a',
  },
  email: {
    marginTop: 4,
    color: '#64748b',
  },
  card: {
    width: '100%',
    marginTop: 18,
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  label: {
    color: '#64748b',
  },
  value: {
    marginTop: 6,
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
});
