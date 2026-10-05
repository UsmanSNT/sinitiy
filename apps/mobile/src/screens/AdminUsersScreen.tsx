import { useCallback, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Alert } from "../lib/alert";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppHeader } from "../components/AppHeader";
import type { AdminUser, UserType } from "@sinity/shared";
import type { RootStackParamList } from "../navigation/types";
import { api } from "../lib/api";
import { formatDate } from "../lib/format";
import { ListState } from "../components/ListState";
import { BottomNav } from "../components/BottomNav";
import { colors } from "../theme";

type Props = NativeStackScreenProps<RootStackParamList, "AdminUsers">;
const tabs = [
  { key: "all", label: "전체" },
  { key: "individual", label: "일반" },
  { key: "organization", label: "기관" },
  { key: "admin", label: "관리자" },
  { key: "suspended", label: "정지됨" },
] as const;

const typeMeta: Record<UserType, { label: string; fg: string; bg: string }> = {
  individual: { label: "일반", fg: "#2368bc", bg: "#e8f1ff" },
  organization: { label: "기관", fg: "#c77b0a", bg: "#fff3dd" },
  admin: { label: "관리자", fg: "#1a9a5a", bg: "#e3f7ec" },
};

export function AdminUsersScreen({ navigation }: Props) {
  const [tab, setTab] = useState<(typeof tabs)[number]["key"]>("all");
  const [items, setItems] = useState<AdminUser[] | null>(null);
  const [error, setError] = useState(false);

  const load = useCallback(() => {
    setError(false);
    api
      .get<AdminUser[]>("/admin/users")
      .then(setItems)
      .catch(() => setError(true));
  }, []);
  useFocusEffect(load);

  const visible = (items ?? []).filter(
    (u) => tab === "all" || (tab === "suspended" ? u.status === "suspended" : u.userType === tab)
  );

  async function setStatus(user: AdminUser, status: AdminUser["status"]) {
    try {
      await api.patch(`/admin/users/${user.id}/status`, { status });
      load();
    } catch (err: any) {
      Alert.alert("처리 실패", err?.message ?? "처리하지 못했습니다");
    }
  }

  function confirmSuspend(user: AdminUser) {
    Alert.alert("이용 정지", `${user.name}님의 계정을 정지할까요?\n정지되면 로그인과 글쓰기를 할 수 없습니다.`, [
      { text: "취소", style: "cancel" },
      { text: "정지", style: "destructive", onPress: () => setStatus(user, "suspended") },
    ]);
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={[]}>
      <AppHeader />
      <View style={styles.header}>
        <Pressable accessibilityLabel="뒤로" hitSlop={12} onPress={() => navigation.goBack()}>
          <MaterialIcons name="chevron-left" size={28} color={colors.navy} />
        </Pressable>
        <Text style={styles.headerTitle}>회원 관리</Text>
        {items && <Text style={styles.count}>총 {items.length}명</Text>}
      </View>

      <View style={styles.tabBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabs}>
          {tabs.map((t) => (
            <Pressable key={t.key} onPress={() => setTab(t.key)} style={[styles.tab, tab === t.key && styles.tabActive]}>
              <Text style={[styles.tabText, tab === t.key && styles.tabTextActive]}>{t.label}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        <ListState loading={items === null && !error} error={error} empty={items !== null && visible.length === 0} />
        {visible.map((user) => {
          const t = typeMeta[user.userType];
          const suspended = user.status === "suspended";
          return (
            <View key={user.id} style={[styles.card, suspended && styles.cardSuspended]}>
              <View style={styles.cardTop}>
                <Text style={styles.name} numberOfLines={1}>{user.name}</Text>
                <View style={[styles.badge, { backgroundColor: t.bg }]}>
                  <Text style={[styles.badgeText, { color: t.fg }]}>{t.label}</Text>
                </View>
                {suspended && (
                  <View style={[styles.badge, { backgroundColor: "#fdeaea" }]}>
                    <Text style={[styles.badgeText, { color: "#d4483f" }]}>정지</Text>
                  </View>
                )}
              </View>
              {user.orgName && (
                <Text style={styles.org}>
                  {user.orgName} · {user.verified ? "인증됨" : "미인증"}
                </Text>
              )}
              <Text style={styles.meta}>{user.email}</Text>
              <Text style={styles.meta}>{user.phone ?? "전화번호 없음"} · 가입 {formatDate(user.createdAt)}</Text>
              {user.userType !== "admin" && (
                <View style={styles.actions}>
                  {suspended ? (
                    <Pressable style={[styles.actionBtn, styles.primaryBtn]} onPress={() => setStatus(user, "active")}>
                      <Text style={styles.primaryText}>정지 해제</Text>
                    </Pressable>
                  ) : (
                    <Pressable style={[styles.actionBtn, styles.outlineBtn]} onPress={() => confirmSuspend(user)}>
                      <Text style={styles.suspendText}>이용 정지</Text>
                    </Pressable>
                  )}
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
      <BottomNav active="MyPage" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f6f8fb" },
  header: { height: 52, flexDirection: "row", alignItems: "center", paddingHorizontal: 14, backgroundColor: colors.white },
  headerTitle: { flex: 1, marginLeft: 7, fontSize: 20, fontWeight: "800", color: colors.navy },
  count: { fontSize: 14, fontWeight: "700", color: "#66758a" },
  tabBar: { backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: "#edf0f4" },
  tabs: { flexDirection: "row", gap: 7, paddingHorizontal: 16, paddingBottom: 12 },
  tab: { height: 30, paddingHorizontal: 14, borderRadius: 15, alignItems: "center", justifyContent: "center" },
  tabActive: { backgroundColor: "#2368bc" },
  tabText: { fontSize: 14, fontWeight: "700", color: "#8792a4" },
  tabTextActive: { color: colors.white },
  list: { padding: 15, gap: 10 },
  card: { backgroundColor: colors.white, borderRadius: 12, borderWidth: 1, borderColor: "#e7ebf0", padding: 14 },
  cardSuspended: { backgroundColor: "#fbfbfc", borderColor: "#f0d4d2" },
  cardTop: { flexDirection: "row", alignItems: "center", gap: 6 },
  name: { flexShrink: 1, fontSize: 17, fontWeight: "800", color: colors.navy, marginRight: 2 },
  badge: { borderRadius: 10, paddingHorizontal: 9, paddingVertical: 3 },
  badgeText: { fontSize: 13, fontWeight: "800" },
  org: { marginTop: 6, fontSize: 14, fontWeight: "700", color: "#4d5a6c" },
  meta: { marginTop: 5, fontSize: 13, color: "#8390a2" },
  actions: { flexDirection: "row", justifyContent: "flex-end", gap: 8, marginTop: 12 },
  actionBtn: { borderRadius: 999, paddingHorizontal: 18, paddingVertical: 8 },
  outlineBtn: { borderWidth: 1, borderColor: "#e3b5b2" },
  suspendText: { color: "#d4483f", fontSize: 14, fontWeight: "700" },
  primaryBtn: { backgroundColor: colors.brand },
  primaryText: { color: colors.white, fontSize: 14, fontWeight: "700" },
});
