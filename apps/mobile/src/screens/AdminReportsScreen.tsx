import { useCallback, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import type { AdminReport } from "@sinity/shared";
import type { RootStackParamList } from "../navigation/types";
import { api } from "../lib/api";
import { formatDate } from "../lib/format";
import { ListState } from "../components/ListState";
import { BottomNav } from "../components/BottomNav";
import { colors } from "../theme";

type Props = NativeStackScreenProps<RootStackParamList, "AdminReports">;
const tabs = [
  { key: "pending", label: "처리 대기" },
  { key: "all", label: "전체" },
] as const;

const statusMeta: Record<AdminReport["status"], { label: string; fg: string; bg: string }> = {
  pending: { label: "처리 대기", fg: "#c77b0a", bg: "#fff3dd" },
  reviewed: { label: "처리 완료", fg: "#1a9a5a", bg: "#e3f7ec" },
  dismissed: { label: "기각", fg: "#6b7688", bg: "#eef1f5" },
};

export function AdminReportsScreen({ navigation }: Props) {
  const [tab, setTab] = useState<(typeof tabs)[number]["key"]>("pending");
  const [items, setItems] = useState<AdminReport[] | null>(null);
  const [error, setError] = useState(false);

  const load = useCallback(() => {
    setError(false);
    api
      .get<AdminReport[]>("/reports")
      .then(setItems)
      .catch(() => setError(true));
  }, []);
  useFocusEffect(load);

  const visible = (items ?? []).filter((r) => tab === "all" || r.status === "pending");

  async function resolve(report: AdminReport, status: "reviewed" | "dismissed", hidePost = false) {
    try {
      if (hidePost && report.postId) await api.patch(`/admin/posts/${report.postId}/status`, { status: "hidden" });
      await api.patch(`/reports/${report.id}`, { status });
      load();
    } catch (err: any) {
      Alert.alert("처리 실패", err?.message ?? "처리하지 못했습니다");
    }
  }

  function confirmHide(report: AdminReport) {
    Alert.alert("게시글 숨김", "이 게시글을 숨기고 신고를 처리 완료로 바꿀까요?", [
      { text: "취소", style: "cancel" },
      { text: "숨기기", style: "destructive", onPress: () => resolve(report, "reviewed", true) },
    ]);
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <Pressable accessibilityLabel="뒤로" hitSlop={12} onPress={() => navigation.goBack()}>
          <MaterialIcons name="chevron-left" size={28} color={colors.navy} />
        </Pressable>
        <Text style={styles.headerTitle}>신고 관리</Text>
      </View>

      <View style={styles.tabs}>
        {tabs.map((t) => (
          <Pressable key={t.key} onPress={() => setTab(t.key)} style={[styles.tab, tab === t.key && styles.tabActive]}>
            <Text style={[styles.tabText, tab === t.key && styles.tabTextActive]}>{t.label}</Text>
          </Pressable>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        <ListState loading={items === null && !error} error={error} empty={items !== null && visible.length === 0} />
        {visible.map((report) => {
          const s = statusMeta[report.status];
          const isPost = report.targetType === "post";
          return (
            <View key={report.id} style={styles.card}>
              <View style={styles.cardTop}>
                <Text style={styles.type}>{isPost ? "게시글 신고" : "댓글 신고"}</Text>
                <View style={[styles.badge, { backgroundColor: s.bg }]}>
                  <Text style={[styles.badgeText, { color: s.fg }]}>{s.label}</Text>
                </View>
              </View>
              <Pressable
                disabled={!report.postId}
                onPress={() => report.postId && navigation.navigate("PostDetail", { postId: report.postId })}
              >
                <Text style={styles.title} numberOfLines={2}>
                  {isPost ? report.postTitle ?? "삭제된 게시글" : report.commentContent ?? "삭제된 댓글"}
                </Text>
              </Pressable>
              {report.postStatus === "hidden" && <Text style={styles.hiddenNote}>숨김 처리된 게시글</Text>}
              <View style={styles.reasonBox}>
                <Text style={styles.reasonLabel}>신고 사유</Text>
                <Text style={styles.reason}>{report.reason}</Text>
              </View>
              <Text style={styles.meta}>신고자 {report.reporterName} · {formatDate(report.createdAt)}</Text>
              {report.status === "pending" && (
                <View style={styles.actions}>
                  <Pressable style={[styles.actionBtn, styles.outlineBtn]} onPress={() => resolve(report, "dismissed")}>
                    <Text style={styles.outlineText}>기각</Text>
                  </Pressable>
                  {isPost && report.postId && report.postStatus !== "hidden" ? (
                    <Pressable style={[styles.actionBtn, styles.dangerBtn]} onPress={() => confirmHide(report)}>
                      <Text style={styles.dangerText}>게시글 숨김</Text>
                    </Pressable>
                  ) : (
                    <Pressable style={[styles.actionBtn, styles.primaryBtn]} onPress={() => resolve(report, "reviewed")}>
                      <Text style={styles.primaryText}>처리 완료</Text>
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
  tabs: { flexDirection: "row", gap: 7, paddingHorizontal: 16, paddingBottom: 12, backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: "#edf0f4" },
  tab: { height: 30, paddingHorizontal: 14, borderRadius: 15, alignItems: "center", justifyContent: "center" },
  tabActive: { backgroundColor: "#2368bc" },
  tabText: { fontSize: 14, fontWeight: "700", color: "#8792a4" },
  tabTextActive: { color: colors.white },
  list: { padding: 15, gap: 10 },
  card: { backgroundColor: colors.white, borderRadius: 12, borderWidth: 1, borderColor: "#e7ebf0", padding: 14 },
  cardTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  type: { fontSize: 13, color: "#6b7688", fontWeight: "700" },
  badge: { borderRadius: 10, paddingHorizontal: 9, paddingVertical: 3 },
  badgeText: { fontSize: 13, fontWeight: "800" },
  title: { marginTop: 8, fontSize: 17, fontWeight: "800", color: colors.navy },
  hiddenNote: { marginTop: 4, fontSize: 13, fontWeight: "700", color: "#6b7688" },
  reasonBox: { marginTop: 10, borderRadius: 8, backgroundColor: "#fdf3f2", padding: 10 },
  reasonLabel: { fontSize: 13, fontWeight: "800", color: "#d4483f" },
  reason: { marginTop: 3, fontSize: 15, color: colors.navy, lineHeight: 21 },
  meta: { marginTop: 8, fontSize: 13, color: "#8390a2" },
  actions: { flexDirection: "row", justifyContent: "flex-end", gap: 8, marginTop: 12 },
  actionBtn: { borderRadius: 999, paddingHorizontal: 18, paddingVertical: 8 },
  outlineBtn: { borderWidth: 1, borderColor: "#d5dbe3" },
  outlineText: { color: "#5d6878", fontSize: 14, fontWeight: "700" },
  primaryBtn: { backgroundColor: colors.brand },
  primaryText: { color: colors.white, fontSize: 14, fontWeight: "700" },
  dangerBtn: { backgroundColor: "#d4483f" },
  dangerText: { color: colors.white, fontSize: 14, fontWeight: "700" },
});
