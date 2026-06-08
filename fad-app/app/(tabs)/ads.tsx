import { useCallback, useMemo, useState } from 'react';
import {
  Alert,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

import AppButton from '@/common/AppButton';
import AppInput from '@/common/AppInput';
import EmptyState from '@/common/EmptyState';
import Loader from '@/common/Loader';
import Screen from '@/common/Screen';
import { deleteAds, getAdsList, updateAdStatus } from '@/actions/ads';
import { Ad } from '@/types';

export default function AdsScreen() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [selectedAd, setSelectedAd] = useState<Ad | null>(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(false);

  async function loadAds() {
    const token = await SecureStore.getItemAsync('fad_token');

    if (!token) return;

    try {
      setLoading(true);
      const response = await getAdsList(token);
      setAds(response || []);
    } catch (error) {
      console.error('Error loading ads:', error);
      Alert.alert('Error', 'Could not load ads.');
    } finally {
      setLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      loadAds();
    }, [])
  );

  const filteredAds = useMemo(() => {
    return ads.filter((ad) => {
      const matchesSearch =
        ad.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ad.description?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = filterStatus === 'all' || ad.status === filterStatus;

      return matchesSearch && matchesStatus;
    });
  }, [ads, searchTerm, filterStatus]);

  function handleViewAd(ad: Ad) {
    setSelectedAd(ad);
    setViewModalVisible(true);
  }

  async function handleToggleStatus(ad: Ad) {
    const token = await SecureStore.getItemAsync('fad_token');

    if (!token) return;

    const nextStatus = ad.status === 'active' ? 'paused' : 'active';

    try {
      await updateAdStatus(ad.id, nextStatus, token);
      await loadAds();
    } catch (error) {
      console.error('Error updating ad status:', error);
      Alert.alert('Error', 'Could not update ad status.');
    }
  }

  function handleDeleteAd(ad: Ad) {
    Alert.alert('Delete Ad', `Are you sure you want to delete "${ad.title}"?`, [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const token = await SecureStore.getItemAsync('fad_token');

          if (!token) return;

          try {
            await deleteAds(ad.id, token);
            await loadAds();
          } catch (error) {
            console.error('Error deleting ad:', error);
            Alert.alert('Error', 'Could not delete ad.');
          }
        },
      },
    ]);
  }

  return (
    <Screen title="Ads" subtitle="Manage campaigns, status, and performance.">
      <AppInput
        placeholder="Search ads"
        value={searchTerm}
        onChangeText={setSearchTerm}
      />

      <View style={styles.filters}>
        {['all', 'active', 'paused', 'completed', 'draft'].map((status) => (
          <Pressable
            key={status}
            style={[
              styles.filterChip,
              filterStatus === status && styles.filterChipActive,
            ]}
            onPress={() => setFilterStatus(status)}
          >
            <Text
              style={[
                styles.filterText,
                filterStatus === status && styles.filterTextActive,
              ]}
            >
              {status}
            </Text>
          </Pressable>
        ))}
      </View>

      {loading ? (
        <Loader message="Loading ads..." />
      ) : filteredAds.length ? (
        <View style={styles.list}>
          {filteredAds.map((ad) => {
            const budget = Number(ad.budget || 0);
            const spent = Number(ad.spent_amount || 0);
            const profit = budget - spent;

            return (
              <View key={ad.id} style={styles.card}>
                <View style={styles.cardHeader}>
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

                <Text style={styles.description} numberOfLines={2}>
                  {ad.description || 'No description available.'}
                </Text>

                <View style={styles.metaGrid}>
                  <Text style={styles.metaText}>
                    Type: <Text style={styles.metaValue}>{ad.ad_type}</Text>
                  </Text>
                  <Text style={styles.metaText}>
                    Views: <Text style={styles.metaValue}>{ad.actual_views || 0}</Text>
                  </Text>
                  <Text style={styles.metaText}>
                    Budget: <Text style={styles.metaValue}>Rs {ad.budget || 0}</Text>
                  </Text>
                  <Text style={styles.metaText}>
                    Profit: <Text style={styles.profitValue}>Rs {profit || 0}</Text>
                  </Text>
                </View>

                <View style={styles.actions}>
                  <AppButton
                    title="View"
                    variant="secondary"
                    onPress={() => handleViewAd(ad)}
                    style={styles.actionButton}
                  />

                  <AppButton
                    title={ad.status === 'active' ? 'Pause' : 'Activate'}
                    onPress={() => handleToggleStatus(ad)}
                    style={styles.actionButton}
                  />

                  <AppButton
                    title="Delete"
                    variant="danger"
                    onPress={() => handleDeleteAd(ad)}
                    style={styles.actionButton}
                  />
                </View>
              </View>
            );
          })}
        </View>
      ) : (
        <EmptyState
          title="No ads found"
          message="Ads matching your search and filter will appear here."
        />
      )}

      <Modal
        visible={viewModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setViewModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{selectedAd?.title || 'Ad Details'}</Text>

            <View style={styles.modalSection}>
              <Text style={styles.modalLabel}>Description</Text>
              <Text style={styles.modalValue}>
                {selectedAd?.description || 'No description available.'}
              </Text>
            </View>

            <View style={styles.modalGrid}>
              <View style={styles.modalStat}>
                <Text style={styles.modalLabel}>Type</Text>
                <Text style={styles.modalValue}>{selectedAd?.ad_type || '-'}</Text>
              </View>

              <View style={styles.modalStat}>
                <Text style={styles.modalLabel}>Status</Text>
                <Text style={styles.modalValue}>{selectedAd?.status || '-'}</Text>
              </View>

              <View style={styles.modalStat}>
                <Text style={styles.modalLabel}>Views</Text>
                <Text style={styles.modalValue}>{selectedAd?.actual_views || 0}</Text>
              </View>

              <View style={styles.modalStat}>
                <Text style={styles.modalLabel}>Budget</Text>
                <Text style={styles.modalValue}>Rs {selectedAd?.budget || 0}</Text>
              </View>

              <View style={styles.modalStat}>
                <Text style={styles.modalLabel}>Paid to Users</Text>
                <Text style={styles.modalValue}>Rs {selectedAd?.spent_amount || 0}</Text>
              </View>

              <View style={styles.modalStat}>
                <Text style={styles.modalLabel}>Profit</Text>
                <Text style={styles.modalProfit}>
                  Rs{' '}
                  {Number(selectedAd?.budget || 0) -
                    Number(selectedAd?.spent_amount || 0)}
                </Text>
              </View>
            </View>

            <AppButton
              title="Close"
              variant="secondary"
              onPress={() => setViewModalVisible(false)}
              style={styles.closeButton}
            />
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  filters: {
    marginTop: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  filterChipActive: {
    borderColor: 'rgba(96, 165, 250, 0.55)',
    backgroundColor: 'rgba(37, 99, 235, 0.35)',
  },
  filterText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#d1d5db',
    textTransform: 'capitalize',
  },
  filterTextActive: {
    color: '#ffffff',
  },
  list: {
    marginTop: 18,
    gap: 14,
  },
  card: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  adTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: '900',
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
  description: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
    color: '#d1d5db',
  },
  metaGrid: {
    marginTop: 14,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  metaText: {
    width: '47%',
    fontSize: 13,
    color: '#d1d5db',
  },
  metaValue: {
    fontWeight: '900',
    color: '#ffffff',
  },
  profitValue: {
    fontWeight: '900',
    color: '#4ade80',
  },
  actions: {
    marginTop: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  actionButton: {
    minWidth: '30%',
    flex: 1,
    minHeight: 46,
  },
  modalOverlay: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
  },
  modalCard: {
    maxHeight: '86%',
    padding: 20,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    backgroundColor: '#111827',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#ffffff',
  },
  modalSection: {
    marginTop: 18,
  },
  modalLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#93c5fd',
    textTransform: 'uppercase',
  },
  modalValue: {
    marginTop: 5,
    fontSize: 15,
    lineHeight: 21,
    color: '#ffffff',
    textTransform: 'capitalize',
  },
  modalGrid: {
    marginTop: 18,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  modalStat: {
    width: '47%',
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  modalProfit: {
    marginTop: 5,
    fontSize: 15,
    fontWeight: '900',
    color: '#4ade80',
  },
  closeButton: {
    marginTop: 22,
  },
});