import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import type { AppNotification, FeedItem } from "@sinity/shared";
import type { RootStackParamList } from "../navigation/types";
import { colors } from "../theme";
import { AppHeader } from "../components/AppHeader";
import { BottomNav } from "../components/BottomNav";
import { ListState } from "../components/ListState";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";
import { feedTag, feedTime, loadFeedReadIds, markFeedRead, openFeedItem, useFeed } from "../lib/feed";

type Props = NativeStackScreenProps<RootStackParamList, "Notifications">;

// Teg nomlari feedTag() qaytaradigan label'lar bilan bir xil.
const filters = ["전체", "공지", "소식", "일자리", "건강", "교육", "생활"] as const;

type Mode = "feed" | "mine";

// Shaxsiy bildirishnoma turiga qarab tegishli ekranga o'tkazadi.
function openPersonal(navigation: Props["navigation"], n: AppNotification) {
  switch (n.type) {
    case "comment":
    case "like":
      if (n.refId) navigation.navigate("PostDetail", { postId: n.refId });
      break;
    case "ad_approved":
    case "ad_rejected":
      navigation.navigate("MyAds");
      break;
    case "listing_approved":
    case "listing_rejected":
      navigation.navigate("MyListings");
      break;
    case "inquiry_answered":
      navigation.navigate("Inquiry");
      break;
  }
}

const personalLabel: Record<AppNotification["type"], { label: string; color: string }> = {
  comment: { label: "댓글", color: "#3d5ee1" },
  like: { label: "좋아요", color: "#e2536b" },
  ad_approved: { label: "광고", color: "#1a9a5a" },
  ad_rejected: { label: "광고", color: "#d4483f" },
  announcement: { label: "공지", color: "#e2536b" },
  inquiry_answered: { label: "문의", color: "#7a5cd6" },
  listing_approved: { label: "공고", color: "#1a9a5a" },
  listing_rejected: { label: "공고", color: "#d4483f" },
};

export function NotificationsScreen({ navigation }: Props) {
  const { user } = useAuth();
  const [mode, setMode] = useState<Mode>("feed");
  const [mine, setMine] = useState<AppNotification[] | null>(null);
  const { items, loading, error } = useFeed(50);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]>("전체");
  const visibleItems = items.filter((item) => activeFilter === "전체" || feedTag(item).label === activeFilter);

  // Bosh sahifadan ochilgan yangilik ham o'qilgan bo'ladi, shuning uchun har safar qaytganda qayta o'qiladi.
  useFocusEffect(
    useCallback(() => {
      loadFeedReadIds().then(setReadIds);
      if (user) api.get<AppNotification[]>("/notifications").then(setMine).catch(() => setMine([]));
    }, [user])
  );

  const mineUnread = (mine ?? []).filter((n) => !n.isRead).length;

  async function readPersonal(ids: string[]) {
    setMine((cur) => (cur ?? []).map((n) => (ids.includes(n.id) ? { ...n, isRead: true } : n)));
    await Promise.all(ids.map((id) => api.patch(`/notifications/${id}/read`).catch(() => {})));
  }

  function saveRead(ids: string[]) {
    setReadIds((current) => new Set([...current, ...ids]));
    markFeedRead(ids);
  }

  function openItem(item: FeedItem) {
    saveRead([item.id]);
    openFeedItem(navigation, item);
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={[]}>
      <AppHeader unreadCount={items.filter((i) => !readIds.has(i.id)).length + mineUnread} />
      <View style={styles.header}>
        <Pressable accessibilityLabel="뒤로" hitSlop={12} onPress={() => navigation.goBack()}>
          <MaterialIcons name="chevron-left" size={28} color={colors.navy} />
        </Pressable>
        <Text style={styles.headerTitle}>알림</Text>
        <Pressable
          accessibilityLabel="모두 읽음"
          hitSlop={12}
          onPress={() => (mode === "mine" ? readPersonal((mine ?? []).filter((n) => !n.isRead).map((n) => n.id)) : saveRead(visibleItems.map((i) => i.id)))}
        >
          <Text style={styles.markAll}>모두 읽음</Text>
        </Pressable>
      </View>

      {user ? (
        <View style={styles.modeRow}>
          <Pressable onPress={() => setMode("feed")} style={[styles.modeTab, mode === "feed" && styles.modeTabActive]}>
            <Text style={[styles.modeText, mode === "feed" && styles.modeTextActive]}>소식</Text>
          </Pressable>
          <Pressable onPress={() => setMode("mine")} style={[styles.modeTab, mode === "mine" && styles.modeTabActive]}>
            <Text style={[styles.modeText, mode === "mine" && styles.modeTextActive]}>내 알림{mineUnread ? ` ${mineUnread}` : ""}</Text>
          </Pressable>
        </View>
      ) : null}

      {mode === "mine" && user ? (
        mine !== null && mine.length === 0 ? (
          <View style={styles.empty}>
            <MaterialIcons name="notifications-none" size={42} color="#c5ced9" />
            <Text style={styles.emptyTitle}>내 알림이 없습니다</Text>
            <Text style={styles.emptyCopy}>댓글, 좋아요, 공고·광고 심사 결과, 문의 답변이 여기에 표시됩니다.</Text>
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
            <ListState loading={mine === null} error={false} empty={false} />
            {(mine ?? []).map((n) => {
              const tag = personalLabel[n.type];
              return (
                <Pressable
                  key={n.id}
                  style={({ pressed }) => [styles.row, pressed && styles.pressed]}
                  onPress={() => {
                    if (!n.isRead) readPersonal([n.id]);
                    openPersonal(navigation, n);
                  }}
                >
                  <Text style={[styles.tag, { color: tag.color }]}>{tag.label}</Text>
                  <View style={styles.rowCopy}>
                    <Text style={[styles.rowTitle, !n.isRead && styles.rowTitleUnread]} numberOfLines={2}>{n.message}</Text>
                    <Text style={styles.rowDate}>{feedTime(n.createdAt)}</Text>
                  </View>
                  {!n.isRead ? <View style={styles.unreadDot} /> : <View style={styles.unreadSpacer} />}
                </Pressable>
              );
            })}
          </ScrollView>
        )
      ) : (
      <>
      <View style={styles.filterBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
          {filters.map((filter) => (
            <Pressable key={filter} onPress={() => setActiveFilter(filter)} style={[styles.filter, activeFilter === filter && styles.filterActive]}>
              <Text style={[styles.filterText, activeFilter === filter && styles.filterTextActive]}>{filter}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {loading || error ? (
        <ListState loading={loading} error={error} empty={false} />
      ) : visibleItems.length === 0 ? (
        <View style={styles.empty}>
          <MaterialIcons name="notifications-none" size={42} color="#c5ced9" />
          <Text style={styles.emptyTitle}>{activeFilter === "전체" ? "새로운 알림이 없습니다" : "이 분류의 소식이 아직 없습니다"}</Text>
          <Text style={styles.emptyCopy}>기관과 시니티의 새 소식이 오면 여기에 표시됩니다.</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
          {visibleItems.map((item) => {
            const tag = feedTag(item);
            const unread = !readIds.has(item.id);
            return (
              <Pressable
                key={item.id}
                style={({ pressed }) => [styles.row, pressed && styles.pressed]}
                onPress={() => openItem(item)}
              >
                <Text style={[styles.tag, { color: tag.color }]}>{tag.label}</Text>
                <View style={styles.rowCopy}>
                  <Text style={[styles.rowTitle, unread && styles.rowTitleUnread]} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text style={styles.rowDate} numberOfLines={1}>
                    {item.source} · {feedTime(item.createdAt)}
                  </Text>
                </View>
                {unread ? <View style={styles.unreadDot} /> : <View style={styles.unreadSpacer} />}
              </Pressable>
            );
          })}
        </ScrollView>
      )}
      </>
      )}
      <BottomNav active="Home" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.white },
  header: { height: 52, flexDirection: "row", alignItems: "center", paddingHorizontal: 14 },
  headerTitle: { flex: 1, marginLeft: 7, fontSize: 20, fontWeight: "800", color: colors.navy },
  markAll: { fontSize: 14, fontWeight: "700", color: "#66758a" },
  modeRow: { flexDirection: "row", paddingHorizontal: 16, gap: 8, paddingBottom: 10 },
  modeTab: { flex: 1, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center", backgroundColor: "#f0f3f7" },
  modeTabActive: { backgroundColor: colors.navy },
  modeText: { fontSize: 14, fontWeight: "800", color: "#7b8797" },
  modeTextActive: { color: colors.white },
  filterBar: { borderBottomWidth: 1, borderBottomColor: "#edf0f4" },
  filters: { flexDirection: "row", gap: 7, paddingHorizontal: 16, paddingBottom: 13 },
  filter: { minWidth: 49, height: 30, paddingHorizontal: 13, alignItems: "center", justifyContent: "center", borderRadius: 15 },
  filterActive: { backgroundColor: "#2368bc" },
  filterText: { fontSize: 13, fontWeight: "700", color: "#8792a4" },
  filterTextActive: { color: colors.white },
  list: { paddingHorizontal: 16, paddingBottom: 22 },
  row: { minHeight: 68, flexDirection: "row", alignItems: "center", borderBottomWidth: 1, borderBottomColor: "#edf0f4", paddingVertical: 12 },
  pressed: { opacity: 0.7 },
  tag: { width: 48, fontSize: 14, fontWeight: "800" },
  rowCopy: { flex: 1, minWidth: 0, paddingHorizontal: 8 },
  rowTitle: { fontSize: 17, fontWeight: "600", color: colors.navy },
  rowTitleUnread: { fontWeight: "800" },
  rowDate: { marginTop: 5, fontSize: 13, color: "#8390a2" },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#3d5ee1" },
  unreadSpacer: { width: 8, height: 8 },
  empty: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 32 },
  emptyTitle: { marginTop: 12, fontSize: 17, fontWeight: "800", color: colors.navy },
  emptyCopy: { marginTop: 6, fontSize: 14, color: "#8995a5", textAlign: "center", lineHeight: 20 },
});
