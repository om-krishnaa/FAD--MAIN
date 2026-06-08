import { router, useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { BackHandler, StyleSheet, View } from 'react-native';

import AppButton from '@/common/AppButton';
import EmptyState from '@/common/EmptyState';
import Screen from '@/common/Screen';

export default function UsersScreen() {
  useFocusEffect(
    useCallback(() => {
      const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
        router.replace('/(tabs)/settings');
        return true;
      });

      return () => subscription.remove();
    }, [])
  );

  return (
    <Screen
      title="Users Management"
      subtitle="View users, update roles, and manage account access."
    >


      <EmptyState
        title="No user data loaded yet"
        message="The user list will appear here after we connect this screen to the backend."
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  actions: {
    marginBottom: 18,
    alignItems: 'flex-start',
  },
});