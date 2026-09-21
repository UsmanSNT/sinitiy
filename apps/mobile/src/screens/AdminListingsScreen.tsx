import { useCallback, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import type { Listing } from "@sinity/shared";
import type { RootStackParamList } from "../navigation/types";
import { api } from "../lib/api";
import { listingTypeLabel, statusColor, statusLabel } from "../lib/listingMeta";
import { ListState } from "../components/ListState";
import { colors } from "../theme";

type Props = NativeStackScreenProps<RootStackParamList, "AdminListings">;
const tabs = [
  { key: "pending", label: "승인 대기" },
  { key: "", label: "전체" },
] as const;

export function AdminListingsScreen({ navigation }: Props) {
  const [tab, setTab] = useState<(typeof tabs)[number]["key"]>("pending");
  const [items, setItems] = useState<Listing[] | null>(null);
  const [error, setError] = useState(false);

  const load = useCallback(() => {
    setError(false);
    api
      .get<Listing[]>(`/admin/listings${tab ? `?status=${tab}` : ""}`)
      .then(setItems)
      .catch(() => setError(true));
  }, [tab]);
  useFocusEffect(load);

  async function setStatus(item: Listing, status: "active" | "rejected") {
    try {
      await api.patch(`/admin/listings/${item.id}/status`, { status });
      load();
    } catch (err: any) {
      Alert.alert("처리 실패", err?.message ?? "처리하지 못했습니다");
    }
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <Pressable accessibilityLabel="뒤로" hitSlop={12} onPress={() => navigation.goBack()}>
          <MaterialIcons name="chevron-left" size={28} color={colors.navy} />
        </Pressable>
        <Text style={styles.headerTitle}>공고 승인 관리</Text>
      </View>

      <View style={styles.tabs}>
        {tabs.map((t) => (
          <Pressable key={t.label} onPress={() => { setItems(null); setTab(t.key); }} style={[styles.tab, tab === t.key && styles.tabActive]}>
            <Text style={[styles.tabText, tab === t.key && styles.tabTextActive]}>{t.label}</Text>
          </Pressable>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        <ListState loading={items === null && !error} error={error} empty={items !== null && items.length === 0} />
        {(items ?? []).map((item) => {
          const c = statusColor[item.status];
          return (
            <View key={item.id} style={styles.card}>
              <View style={styles.cardTop}>
                <Text style={styles.type}>{listingTypeLabel[item.listingType]}{item.category ? ` · ${item.category}` : ""}</Text>
                <View style={[styles.badge, { backgroundColor: c.bg }]}>
                  <Text style={[styles.badgeText, { color: c.fg }]}>{statusLabel[item.status]}</Text>
                </View>
              </View>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.meta}>{item.orgName} · {item.period ?? "기간 미정"}</Text>
              <Text style={styles.content} numberOfLines={3}>{item.content}</Text>
              <Text style={styles.meta}>대상: {item.targetAudience} · 신청: {item.applyMethod} · {item.phone}</Text>
              {item.status !== "active" && (
                <View style={styles.actions}>
                  {item.status !== "rejected" && (
                    <Pressable style={[styles.actionBtn, styles.rejectBtn]} onPress={() => setStatus(item, "rejected")}>
                      <Text style={styles.rejectText}>반려</Text>
                    </Pressable>
                  )}
                  <Pressable style={[styles.actionBtn, styles.approveBtn]} onPress={() => setStatus(item, "active")}>
                    <Text style={styles.approveText}>승인</Text>
                  </Pressable>
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f6f8fb" },
  header: { height: 52, flexDirection: "row", alignItems: "center", paddingHorizontal: 14, backgroundColor: colors.white },
  headerTitle: { flex: 1, marginLeft: 7, fontSize: 18, fontWeight: "800", color: colors.navy },
  tabs: { flexDirection: "row", gap: 7, paddingHorizontal: 16, paddingBottom: 12, backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: "#edf0f4" },
  tab: { height: 30, paddingHorizontal: 14, borderRadius: 15, alignItems: "center", justifyContent: "center" },
  tabActive: { backgroundColor: "#2368bc" },
  tabText: { fontSize: 12, fontWeight: "700", color: "#8792a4" },
  tabTextActive: { color: colors.white },
  list: { padding: 15, gap: 10 },
  card: { backgroundColor: colors.white, borderRadius: 12, borderWidth: 1, borderColor: "#e7ebf0", padding: 14 },
  cardTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  type: { fontSize: 11, color: "#6b7688", fontWeight: "700" },
  badge: { borderRadius: 10, paddingHorizontal: 9, paddingVertical: 3 },
  badgeText: { fontSize: 11, fontWeight: "800" },
  title: { marginTop: 8, fontSize: 15, fontWeight: "800", color: colors.navy },
  meta: { marginTop: 5, fontSize: 11, color: "#8390a2" },
  content: { marginTop: 8, fontSize: 12, color: colors.navy, lineHeight: 18 },
  actions: { flexDirection: "row", justifyContent: "flex-end", gap: 8, marginTop: 12 },
  actionBtn: { borderRadius: 999, paddingHorizontal: 18, paddingVertical: 8 },
  approveBtn: { backgroundColor: colors.brand },
  approveText: { color: colors.white, fontSize: 13, fontWeight: "700" },
  rejectBtn: { borderWidth: 1, borderColor: "#e3b5b2" },
  rejectText: { color: "#d4483f", fontSize: 13, fontWeight: "700" },
});
