import { useCallback, useState, useEffect } from "react";
import { Alert, StyleSheet, Text, View, Pressable, Modal } from "react-native";
import { WebView } from "react-native-webview";
import { useFocusEffect } from "expo-router";
import * as SecureStore from "expo-secure-store";

import { getAds, createViewAd } from "@/actions/ads";
import { getDashboardAnalytics } from "@/actions/analytics";
import { getMyReferrals } from "@/actions/referrals";
import { getUser } from "@/actions/users";
import EmptyState from "@/common/EmptyState";
import Loader from "@/common/Loader";
import Screen from "@/common/Screen";
import SectionCard from "@/components/dashboard/SectionCard";
import StatCard from "@/components/dashboard/StatCard";
import AppButton from "@/common/AppButton";
import { Ad, DashboardStats, Referral, User } from "@/types";

export default function DashboardScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [availableAds, setAvailableAds] = useState<Ad[]>([]);
  const [analytics, setAnalytics] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [activePlayAd, setActivePlayAd] = useState<Ad | null>(null);
  const [playerModalVisible, setPlayerModalVisible] = useState(false);

  const [countdown, setCountdown] = useState(15);
  const [canClose, setCanClose] = useState(false);

  const isAdmin = user?.role === "admin" || user?.role === "super_admin";
  const isSuperAdmin = user?.role === "super_admin";

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (playerModalVisible && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setCanClose(true);
    }
    return () => clearInterval(timer);
  }, [playerModalVisible, countdown]);

  function formatCurrency(value?: string | number) {
    return `Rs ${value || 0}`;
  }

  function profit(ad: Ad) {
    return Number(ad.budget || 0) - Number(ad.spent_amount || 0);
  }

  async function loadDashboard() {
    const token = await SecureStore.getItemAsync("fad_token");
    if (!token) return;

    try {
      setLoading(true);
      const userResponse = await getUser(token);
      setUser(userResponse);

      if (
        userResponse.role === "admin" ||
        userResponse.role === "super_admin"
      ) {
        const dashboardResponse = await getDashboardAnalytics(token);
        setAnalytics(dashboardResponse);
        setReferrals([]);
        setAvailableAds([]);
      } else {
        const [referralsResponse, adsResponse] = await Promise.all([
          getMyReferrals(token),
          getAds(token),
        ]);
        setReferrals(referralsResponse || []);
        setAvailableAds(adsResponse || []);
        setAnalytics(null);
      }
    } catch (error) {
      console.error("Error loading dashboard:", error);
      Alert.alert("Error", "Could not load dashboard.");
    } finally {
      setLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      loadDashboard();
    }, []),
  );

  function handlePlayAd(ad: Ad) {
    const BACKEND_BASE_URL = "http://192.168.1.80:5000";
    let rawPath =
      (ad as any).content_url ||
      ad.file_url ||
      ad.video_url ||
      (ad as any).file ||
      (ad as any).video;

    if (!rawPath) {
      Alert.alert(
        "Unavailable",
        "This ad container does not have explicit source media attached.",
      );
      return;
    }

    let normalizedPath = rawPath.replace(/\\/g, "/");
    let finalUri = normalizedPath;

    if (finalUri.includes("localhost") || finalUri.includes("127.0.0.1")) {
      finalUri = finalUri
        .replace("localhost:5000", "192.168.1.80:5000")
        .replace("127.0.0.1:5000", "192.168.1.80:5000");
    } else if (
      normalizedPath.startsWith("/") ||
      (!normalizedPath.startsWith("http://") &&
        !normalizedPath.startsWith("https://"))
    ) {
      const cleanPath = normalizedPath.startsWith("/")
        ? normalizedPath
        : `/${normalizedPath}`;
      finalUri = `${BACKEND_BASE_URL}${cleanPath}`;
    }

    setCountdown(15);
    setCanClose(false);
    setActivePlayAd({
      ...ad,
      file_url: finalUri,
    });
    setPlayerModalVisible(true);
  }

  async function handleCloseStream() {
    if (!canClose || !activePlayAd || !user) return;

    try {
      const token = await SecureStore.getItemAsync("fad_token");
      if (token) {
        await createViewAd(
          {
            user_id: user.id,
            campaign_id: activePlayAd.id,
            view_duration: 15,
            full_duration: 15,
            completion_percentage: 100,
            is_completed: true,
            device_type: "mobile",
            ip_address: "127.0.0.1",
          } as any,
          token,
        );
      }
    } catch (error) {
      console.error("Error recording ad view:", error);
    } finally {
      setPlayerModalVisible(false);
      setActivePlayAd(null);
      loadDashboard();
    }
  }

  if (loading) {
    return (
      <Screen title="Dashboard" subtitle="Loading your account...">
        <Loader message="Loading dashboard..." />
      </Screen>
    );
  }

  if (isAdmin) {
    return (
      <Screen title="Dashboard" subtitle="Welcome back to FAD">
        <View style={styles.adminHero}>
          <Text style={styles.adminHeroLabel}>Admin Overview</Text>
          <Text style={styles.adminHeroTitle}>Today with FAD</Text>
          <Text style={styles.adminHeroText}>
            Track ads, revenue, views, and platform activity from one place.
          </Text>
        </View>

        <View style={styles.statsGrid}>
          {isSuperAdmin ? (
            <StatCard
              title="Total Users"
              value={analytics?.totalUsers?.toLocaleString() || "-"}
              accent="blue"
            />
          ) : null}

          <StatCard
            title="Active Ads"
            value={analytics?.activeAds?.toLocaleString() || "-"}
            accent="green"
          />

          {isSuperAdmin && (
            <StatCard
              title="Total Revenue"
              value={analytics ? formatCurrency(analytics.totalRevenue) : "-"}
              accent="purple"
            />
          )}

          <StatCard
            title="Ad Views Today"
            value={analytics?.adViewsToday?.toLocaleString() || "-"}
            accent="orange"
          />
        </View>

        <SectionCard title="Recent Ad Performance">
          {analytics?.recentAds?.length ? (
            analytics.recentAds.map((ad) => (
              <View key={ad.id} style={styles.adCard}>
                <View style={styles.adHeader}>
                  <Text style={styles.adTitle}>{ad.title}</Text>
                  <Text
                    style={[
                      styles.statusBadge,
                      ad.status === "active"
                        ? styles.statusActive
                        : styles.statusInactive,
                    ]}
                  >
                    {ad.status}
                  </Text>
                </View>

                <View style={styles.adminMetaGrid}>
                  <View style={styles.adminMetaItem}>
                    <Text style={styles.adMeta}>Views</Text>
                    <Text style={styles.adMetaValue}>
                      {ad.actual_views || 0}
                    </Text>
                  </View>

                  <View style={styles.adminMetaItem}>
                    <Text style={styles.adMeta}>Budget</Text>
                    <Text style={styles.adMetaValue}>
                      {formatCurrency(ad.budget)}
                    </Text>
                  </View>

                  <View style={styles.adminMetaItem}>
                    <Text style={styles.adMeta}>Paid to Users</Text>
                    <Text style={styles.adMetaValue}>
                      {formatCurrency(ad.spent_amount)}
                    </Text>
                  </View>

                  <View style={styles.adminMetaItem}>
                    <Text style={styles.adMeta}>Profit</Text>
                    <Text style={styles.profitValue}>
                      {formatCurrency(profit(ad))}
                    </Text>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <EmptyState
              title="No ad performance yet"
              message="Recent ad performance will appear here."
            />
          )}
        </SectionCard>

        {isSuperAdmin ? (
          <View style={styles.sectionGap}>
            <SectionCard title="System Status">
              <View style={styles.statusRow}>
                <View style={styles.statusLeft}>
                  <View style={[styles.statusDot, styles.dotGreen]} />
                  <Text style={styles.statusText}>Mobile App</Text>
                </View>
                <Text style={styles.onlineText}>Online</Text>
              </View>

              <View style={styles.statusRow}>
                <View style={styles.statusLeft}>
                  <View style={[styles.statusDot, styles.dotRed]} />
                  <Text style={styles.statusText}>Backend API</Text>
                </View>
                <Text style={styles.offlineText}>Not Made</Text>
              </View>

              <View style={styles.statusRow}>
                <View style={styles.statusLeft}>
                  <View style={[styles.statusDot, styles.dotGreen]} />
                  <Text style={styles.statusText}>Payment System</Text>
                </View>
                <Text style={styles.onlineText}>Online</Text>
              </View>

              <View style={styles.statusRow}>
                <View style={styles.statusLeft}>
                  <View style={[styles.statusDot, styles.dotYellow]} />
                  <Text style={styles.statusText}>Database</Text>
                </View>
                <Text style={styles.maintenanceText}>Maintenance</Text>
              </View>
            </SectionCard>
          </View>
        ) : null}
      </Screen>
    );
  }

  return (
    <Screen title="Dashboard" subtitle="Welcome back to FAD">
      <View style={styles.walletCard}>
        <Text style={styles.walletLabel}>Available Balance</Text>
        <Text style={styles.walletValue}>
          Rs {user?.current_balance || "0"}
        </Text>
        <Text style={styles.walletText}>
          Watch ads, invite referrals, and request payouts from Payments.
        </Text>
      </View>

      <View style={styles.statsGrid}>
        <StatCard
          title="Total Earned"
          value={`Rs ${user?.total_earned || "0"}`}
          accent="green"
        />
        <StatCard
          title="Ads Watched"
          value={user?.ads_watched_count || 0}
          accent="blue"
        />
        <StatCard title="Referrals" value={referrals.length} accent="purple" />
        <StatCard
          title="Status"
          value={user?.status || "active"}
          accent="orange"
        />
      </View>

      <SectionCard title="Available Ads">
        {availableAds.length ? (
          availableAds.slice(0, 3).map((ad) => (
            <Pressable
              key={ad.id}
              style={({ pressed }) => [
                styles.adCard,
                pressed && { opacity: 0.85, transform: [{ scale: 0.99 }] },
              ]}
              onPress={() => handlePlayAd(ad)}
            >
              <View style={styles.adHeader}>
                <Text style={styles.adTitle}>{ad.title}</Text>
                <Text style={styles.adType}>{ad.ad_type}</Text>
              </View>

              <Text style={styles.adDescription} numberOfLines={2}>
                {ad.description || "Watch this ad and earn rewards."}
              </Text>

              <View style={styles.adMetaRow}>
                <Text style={styles.adMeta}>
                  Views:{" "}
                  <Text style={styles.adMetaValue}>{ad.actual_views || 0}</Text>
                </Text>

                <Text style={styles.adMeta}>
                  Reward:{" "}
                  <Text style={styles.adMetaValue}>
                    Rs{" "}
                    {(ad as any).earnings_per_view ||
                      (ad as any).cost_per_view ||
                      0}
                  </Text>
                </Text>
              </View>
              <Text style={styles.playHintText}>▶ Tap to Watch & Earn</Text>
            </Pressable>
          ))
        ) : (
          <View style={styles.gameCard}>
            <Text style={styles.gameTitle}>No Ads Left for Today</Text>
            <Text style={styles.gameSubtitle}>
              Play while new ads become available.
            </Text>

            <View style={styles.gameFrame}>
              <WebView
                source={{ uri: "https://funhtml5games.com?embed=flappy" }}
                style={styles.gameWebView}
                javaScriptEnabled
                domStorageEnabled
                startInLoadingState
                scalesPageToFit
                scrollEnabled={false}
                nestedScrollEnabled={false}
                automaticallyAdjustContentInsets={false}
                setBuiltInZoomControls={false}
                setDisplayZoomControls={false}
              />
            </View>
          </View>
        )}
      </SectionCard>

      <Modal
        visible={playerModalVisible}
        animationType="slide"
        onRequestClose={() => {
          if (canClose) handleCloseStream();
        }}
      >
        <View style={{ flex: 1, backgroundColor: "#111827" }}>
          <View style={styles.playerHeaderContainer}>
            <Text style={styles.playerStreamTitle} numberOfLines={1}>
              Viewing: {activePlayAd?.title}
            </Text>
            <AppButton
              title={canClose ? "Close Stream" : `Wait ${countdown}s`}
              variant="secondary"
              disabled={!canClose}
              style={[styles.playerCloseButton, !canClose && { opacity: 0.5 }]}
              onPress={handleCloseStream}
            />
          </View>

          {activePlayAd && (
            <WebView
              originWhitelist={["*"]}
              source={{ uri: activePlayAd.file_url }}
              javaScriptEnabled
              domStorageEnabled
              allowsFullscreenVideo
              allowsInlineMediaPlayback
              mediaPlaybackRequiresUserAction={false}
              startInLoadingState
              style={{ flex: 1, backgroundColor: "#000000" }}
            />
          )}
        </View>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  adminHero: {
    padding: 20,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(96, 165, 250, 0.35)",
    backgroundColor: "rgba(37, 99, 235, 0.22)",
  },
  adminHeroLabel: {
    fontSize: 13,
    fontWeight: "900",
    color: "#93c5fd",
  },
  adminHeroTitle: {
    marginTop: 8,
    fontSize: 32,
    fontWeight: "900",
    color: "#ffffff",
  },
  adminHeroText: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
    color: "#d1d5db",
  },
  walletCard: {
    padding: 20,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(96, 165, 250, 0.35)",
    backgroundColor: "rgba(37, 99, 235, 0.22)",
  },
  walletLabel: {
    fontSize: 14,
    fontWeight: "800",
    color: "#dbeafe",
  },
  walletValue: {
    marginTop: 8,
    fontSize: 36,
    fontWeight: "900",
    color: "#ffffff",
  },
  walletText: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
    color: "#d1d5db",
  },
  statsGrid: {
    marginTop: 22,
    marginBottom: 22,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  sectionGap: {
    marginTop: 22,
  },
  adCard: {
    padding: 14,
    borderRadius: 12,
    backgroundColor: "rgba(17, 24, 39, 0.38)",
    marginBottom: 10,
  },
  adHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  adTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: "900",
    color: "#ffffff",
  },
  adType: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 999,
    overflow: "hidden",
    backgroundColor: "rgba(96, 165, 250, 0.18)",
    fontSize: 12,
    fontWeight: "900",
    color: "#60a5fa",
    textTransform: "capitalize",
  },
  statusBadge: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 999,
    overflow: "hidden",
    fontSize: 12,
    fontWeight: "900",
    textTransform: "capitalize",
  },
  statusActive: {
    backgroundColor: "rgba(34, 197, 94, 0.16)",
    color: "#4ade80",
  },
  statusInactive: {
    backgroundColor: "rgba(156, 163, 175, 0.16)",
    color: "#d1d5db",
  },
  adDescription: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
    color: "#d1d5db",
  },
  adMetaRow: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  playHintText: {
    color: "#60a5fa",
    fontWeight: "bold",
    fontSize: 12,
    marginTop: 8,
    textAlign: "right",
  },
  adminMetaGrid: {
    marginTop: 12,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  adminMetaItem: {
    width: "47%",
    padding: 10,
    borderRadius: 10,
    backgroundColor: "rgba(255, 255, 255, 0.06)",
  },
  adMeta: {
    fontSize: 13,
    color: "#d1d5db",
  },
  adMetaValue: {
    marginTop: 4,
    fontWeight: "900",
    color: "#ffffff",
  },
  profitValue: {
    marginTop: 4,
    fontWeight: "900",
    color: "#4ade80",
  },
  statusRow: {
    padding: 13,
    borderRadius: 12,
    backgroundColor: "rgba(17, 24, 39, 0.38)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  statusLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
  },
  dotGreen: {
    backgroundColor: "#22c55e",
  },
  dotRed: {
    backgroundColor: "#ef4444",
  },
  dotYellow: {
    backgroundColor: "#eab308",
  },
  statusText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#ffffff",
  },
  onlineText: {
    fontSize: 13,
    fontWeight: "900",
    color: "#4ade80",
  },
  offlineText: {
    fontSize: 13,
    fontWeight: "900",
    color: "#f87171",
  },
  maintenanceText: {
    fontSize: 13,
    fontWeight: "900",
    color: "#facc15",
  },
  gameCard: {
    marginHorizontal: -18,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(96, 165, 250, 0.32)",
    backgroundColor: "#bfdbfe",
  },
  gameTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#111827",
    textAlign: "center",
  },
  gameSubtitle: {
    marginTop: 4,
    marginBottom: 10,
    fontSize: 13,
    fontWeight: "700",
    color: "#374151",
    textAlign: "center",
  },
  gameFrame: {
    width: "100%",
    height: 520,
    overflow: "hidden",
    borderRadius: 12,
    backgroundColor: "#bfdbfe",
  },
  gameWebView: {
    width: "100%",
    height: 520,
    backgroundColor: "#bfdbfe",
  },
  playerHeaderContainer: {
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 14,
    backgroundColor: "#1f2937",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  playerStreamTitle: {
    flex: 1,
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  playerCloseButton: {
    height: 38,
    paddingHorizontal: 14,
  },
});
