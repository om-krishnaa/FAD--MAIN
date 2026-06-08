import { useCallback, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

import Screen from '@/common/Screen';
import AppButton from '@/common/AppButton';

type SavedUser = {
  name?: string;
  email?: string;
  role?: string;
  status?: string;
};

export default function SettingsScreen() {
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
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await SecureStore.deleteItemAsync('fad_token');
          await SecureStore.deleteItemAsync('fad_user');
          setUser(null);
          router.replace('/login');
        },
      },
    ]);
  }

  return (
    <Screen title="Settings" subtitle="Manage your profile and admin tools">
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {(user?.name || user?.email || 'A').charAt(0).toUpperCase()}
          </Text>
        </View>

        <View style={styles.profileInfo}>
          <Text style={styles.name}>{user?.name || 'Admin User'}</Text>
          <Text style={styles.email}>{user?.email || 'admin@example.com'}</Text>
          <Text style={styles.role}>{user?.role || 'admin'}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Admin Tools</Text>

        <Pressable style={styles.item} onPress={() => router.push('/(tabs)/users')}>
          <Text style={styles.itemTitle}>Users Management</Text>
          <Text style={styles.itemText}>
            View users, update roles, and manage account access.
          </Text>
        </Pressable>

        <Pressable style={styles.item} onPress={() => router.push('/(tabs)/security')}>
          <Text style={styles.itemTitle}>Security</Text>
          <Text style={styles.itemText}>
            Review blocked users and manage platform security settings.
          </Text>
        </Pressable>
      </View>

      <AppButton
        title="Logout"
        variant="danger"
        onPress={handleLogout}
        style={styles.logoutButton}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  profileCard: {
    padding: 18,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563eb',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#ffffff',
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '800',
    color: '#ffffff',
  },
  email: {
    marginTop: 4,
    fontSize: 14,
    color: '#d1d5db',
  },
  role: {
    marginTop: 8,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    overflow: 'hidden',
    backgroundColor: 'rgba(37, 99, 235, 0.22)',
    borderWidth: 1,
    borderColor: 'rgba(96, 165, 250, 0.45)',
    fontSize: 12,
    fontWeight: '800',
    color: '#60a5fa',
    textTransform: 'capitalize',
  },
  section: {
    marginTop: 26,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#ffffff',
  },
  item: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#ffffff',
  },
  itemText: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
    color: '#d1d5db',
  },
  logoutButton: {
    marginTop: 28,
  },
});