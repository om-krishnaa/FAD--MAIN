import { router, useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { BackHandler, StyleSheet, View } from 'react-native';

import AppButton from '@/common/AppButton';
import EmptyState from '@/common/EmptyState';
import Screen from '@/common/Screen';

export default function SecurityScreen() {
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
      title="Security"
      subtitle="Review blocked users and manage platform security settings."
    >
      {/* <View style={styles.actions}>
        <AppButton
          title="Back to Settings"
          variant="ghost"
          onPress={() => router.replace('/(tabs)/settings')}
        />
      </View> */}

      <EmptyState
        title="No security data loaded yet"
        message="Blocked users and security controls will appear here after we connect this screen to the backend."
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