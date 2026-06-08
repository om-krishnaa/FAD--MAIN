import { useCallback, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { VideoView, useVideoPlayer } from 'expo-video';

import EmptyState from '@/common/EmptyState';
import Loader from '@/common/Loader';
import Screen from '@/common/Screen';
import SectionCard from '@/components/dashboard/SectionCard';
import StatCard from '@/components/dashboard/StatCard';
import { getDashboardAnalytics } from '@/actions/analytics';
import { DashboardStats } from '@/types';

type SavedUser = {
  id?: number;
  name?: string;
  email?: string;
  role?: 'user' | 'admin' | 'super_admin';
};

const rotatingWords = ['happening', 'growing', 'advancing', 'exciting'];

export default function DashboardScreen() {
  const [user, setUser] = useState<SavedUser | null>(null);
  const [analytics, setAnalytics] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);
  const videoPlayer = useVideoPlayer(
  require('@/assets/videos/hospital.mp4'),
  (player) => {
    player.loop = true;
    player.muted = true;
  }
);
  useFocusEffect(
    useCallback(() => {
      let mounted = true;
      const interval = setInterval(() => {
        setWordIndex((prev) => (prev + 1) % rotatingWords.length);
      }, 2500);

      async function loadDashboard() {
        const savedUser = await SecureStore.getItemAsync('fad_user');
        const token = await SecureStore.getItemAsync('fad_token');

        if (savedUser && mounted) {
          setUser(JSON.parse(savedUser));
        }

        if (!token) return;

        try {
          setLoading(true);
          const response = await getDashboardAnalytics(token);

          if (mounted) {
            setAnalytics(response);
          }
        } catch (error) {
          console.error('Error fetching dashboard analytics:', error);
          if (mounted) {
            setAnalytics(null);
          }
        } finally {
          if (mounted) {
            setLoading(false);
          }
        }
      }

      loadDashboard();

      return () => {
        mounted = false;
        clearInterval(interval);
      };
    }, [])
  );

  const isSuperAdmin = user?.role === 'super_admin';

  if (loading) {
    return (
      <Screen title="Dashboard" subtitle="Loading dashboard data...">
        <Loader message="Loading dashboard..." />
      </Screen>
    );
  }

  return (
    <Screen title="Dashboard" subtitle="Welcome back to FAD">
      <View style={styles.heroCard}>
        <Text style={styles.heroTitle}>Welcome back!</Text>
        <Text style={styles.heroText}>
          Here's what's{' '}
          <Text style={styles.rotatingWord}>{rotatingWords[wordIndex]}</Text>{' '}
          with FAD today.
        </Text>
      </View>
      <View style={styles.videoCard}>
  <VideoView
    player={videoPlayer}
    style={styles.video}
    nativeControls
    contentFit="cover"
  />
</View>

      <View style={styles.statsGrid}>
        {isSuperAdmin ? (
          <StatCard
            title="Total Users"
            value={analytics?.totalUsers ?? '-'}
            accent="blue"
          />
        ) : null}

        <StatCard
          title="Active Ads"
          value={analytics?.activeAds ?? '-'}
          accent="green"
        />

        <StatCard
          title={isSuperAdmin ? 'Total Revenue' : 'Total Budget'}
          value={analytics ? `Rs ${analytics.totalRevenue}` : '-'}
          accent="purple"
        />

        <StatCard
          title="Ad Views Today"
          value={analytics?.adViewsToday ?? '-'}
          accent="orange"
        />
      </View>

      <SectionCard title="Recent Ad Performance">
        {analytics?.recentAds?.length ? (
          analytics.recentAds.map((ad) => {
            const budget = Number(ad.budget || 0);
            const spent = Number(ad.spent_amount || 0);
            const profit = budget - spent;

            return (
              <View key={ad.id} style={styles.adItem}>
                <View style={styles.adHeader}>
                  <Text style={styles.adTitle}>{ad.title}</Text>
                  <Text
                    style={[
                      styles.statusBadge,
                      ad.status === 'active' && styles.activeBadge,
                    ]}
                  >
                    {ad.status}
                  </Text>
                </View>

                <View style={styles.adStatsGrid}>
                  <Text style={styles.adStat}>
                    Views: <Text style={styles.adStatValue}>{ad.actual_views || 0}</Text>
                  </Text>
                  <Text style={styles.adStat}>
                    Budget: <Text style={styles.adStatValue}>Rs {ad.budget || 0}</Text>
                  </Text>
                  <Text style={styles.adStat}>
                    Paid: <Text style={styles.adStatValue}>Rs {ad.spent_amount || 0}</Text>
                  </Text>
                  <Text style={styles.adStat}>
                    Profit: <Text style={styles.profitValue}>Rs {profit || 0}</Text>
                  </Text>
                </View>
              </View>
            );
          })
        ) : (
          <EmptyState
            title="No recent ads yet"
            message="Recent ad performance will appear here once ads are active."
          />
        )}
      </SectionCard>

      {isSuperAdmin ? (
        <View style={styles.systemSection}>
          <SectionCard title="System Status">
            <View style={styles.statusRow}>
              <View style={[styles.statusDot, styles.greenDot]} />
              <Text style={styles.statusTitle}>Mobile App</Text>
              <Text style={styles.onlineText}>Online</Text>
            </View>

            <View style={styles.statusRow}>
              <View style={[styles.statusDot, styles.redDot]} />
              <Text style={styles.statusTitle}>Backend API</Text>
              <Text style={styles.offlineText}>Not Made</Text>
            </View>

            <View style={styles.statusRow}>
              <View style={[styles.statusDot, styles.greenDot]} />
              <Text style={styles.statusTitle}>Payment System</Text>
              <Text style={styles.onlineText}>Online</Text>
            </View>

            <View style={styles.statusRow}>
              <View style={[styles.statusDot, styles.yellowDot]} />
              <Text style={styles.statusTitle}>Database</Text>
              <Text style={styles.warningText}>Maintenance</Text>
            </View>
          </SectionCard>
        </View>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  videoCard: {
  height: 190,
  marginBottom: 18,
  overflow: 'hidden',
  borderRadius: 16,
  borderWidth: 1,
  borderColor: 'rgba(255, 255, 255, 0.18)',
  backgroundColor: '#000000',
},
video: {
  width: '100%',
  height: '100%',
},
  heroCard: {
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(96, 165, 250, 0.35)',
    backgroundColor: 'rgba(37, 99, 235, 0.16)',
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#ffffff',
  },
  heroText: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22,
    color: '#d1d5db',
  },
  rotatingWord: {
    color: '#ffffff',
    fontWeight: '900',
    backgroundColor: '#2563eb',
  },
  statsGrid: {
    marginTop: 22,
    marginBottom: 22,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  systemSection: {
    marginTop: 22,
  },
  adItem: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.14)',
    backgroundColor: 'rgba(17, 24, 39, 0.38)',
  },
  adHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  adTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '800',
    color: '#ffffff',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 999,
    overflow: 'hidden',
    backgroundColor: 'rgba(148, 163, 184, 0.18)',
    fontSize: 12,
    fontWeight: '800',
    color: '#d1d5db',
    textTransform: 'capitalize',
  },
  activeBadge: {
    backgroundColor: 'rgba(34, 197, 94, 0.18)',
    color: '#4ade80',
  },
  adStatsGrid: {
    marginTop: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  adStat: {
    width: '47%',
    fontSize: 13,
    color: '#d1d5db',
  },
  adStatValue: {
    fontWeight: '900',
    color: '#ffffff',
  },
  profitValue: {
    fontWeight: '900',
    color: '#4ade80',
  },
  statusRow: {
    minHeight: 48,
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(17, 24, 39, 0.38)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  greenDot: {
    backgroundColor: '#22c55e',
  },
  redDot: {
    backgroundColor: '#ef4444',
  },
  yellowDot: {
    backgroundColor: '#eab308',
  },
  statusTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '800',
    color: '#ffffff',
  },
  onlineText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#4ade80',
  },
  offlineText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#f87171',
  },
  warningText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#facc15',
  },
});