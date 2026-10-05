import { useCallback, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Alert } from "../lib/alert";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppHeader } from "../components/AppHeader";
import type { Post } from "@sinity/shared";
import type { RootStackParamList } from "../navigation/types";
import { api } from "../lib/api";
import { formatDate } from "../lib/format";
import { ListState } from "../components/ListState";
import { BottomNav } from "../components/BottomNav";
import { colors } from "../theme";

type Props = NativeStackScreenProps<RootStackParamList, "AdminPosts">;
const tabs = [
  { key: "all", label: "전체" },
  { key: "reported", label: "신고됨" },
  { key: "hidden", label: "숨김" },
] as const;

export function AdminPostsScreen({ navigation }: Props) {
  const [tab, setTab] = useState<(typeof tabs)[number]["key"]>("all");
  const [items, setItems] = useState<Post[] | null>(null);
  const [error, setError] = useState(false);

  const load = useCallback(() => {
    setError(false);
    api
      .get<Post[]>("/admin/posts")
      .then(setItems)
      .catch(() => setError(true));
  }, []);
  useFocusEffect(load);

  const visible = (items ?? []).filter(
    (p) => tab === "all" || (tab === "reported" ? p.reportCount > 0 : p.status === "hidden")
  );

  async function setStatus(post: Post, status: Post["status"]) {
    try {
      await api.patch(`/admin/posts/${post.id}/status`, { status });
      load();
    } catch (err: any) {
      Alert.alert("처리 실패", err?.message ?? "처리하지 못했습니다");
    }
  }

  function confirmDelete(post: Post) {
    Alert.alert("게시글 삭제", "삭제한 게시글은 다시 볼 수 없습니다. 삭제할까요?", [
      { text: "취소", style: "cancel" },
      { text: "삭제", style: "destructive", onPress: () => setStatus(post, "deleted") },
    ]);
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={[]}>
      <AppHeader />
      <View style={styles.header}>
        <Pressable accessibilityLabel="뒤로" hitSlop={12} onPress={() => navigation.goBack()}>
          <MaterialIcons name="chevron-left" size={28} color={colors.navy} />
        </Pressable>
        <Text style={styles.headerTitle}>게시글 관리</Text>
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
        {visible.map((post) => {
          const hidden = post.status === "hidden";
          return (
            <View key={post.id} style={styles.card}>
              <View style={styles.cardTop}>
                <Text style={styles.type}>{post.categoryName} · {post.authorName}</Text>
                <View style={[styles.badge, { backgroundColor: hidden ? "#eef1f5" : "#e3f7ec" }]}>
                  <Text style={[styles.badgeText, { color: hidden ? "#6b7688" : "#1a9a5a" }]}>{hidden ? "숨김" : "게시 중"}</Text>
                </View>
              </View>
              <Pressable onPress={() => navigation.navigate("PostDetail", { postId: post.id })}>
                <Text style={styles.title} numberOfLines={1}>{post.title}</Text>
                <Text style={styles.content} numberOfLines={2}>{post.content}</Text>
              </Pressable>
              <Text style={styles.meta}>
                좋아요 {post.likeCount} · 댓글 {post.commentCount} ·{" "}
                <Text style={post.reportCount > 0 ? styles.reported : undefined}>신고 {post.reportCount}</Text>
                {" "}· {formatDate(post.createdAt)}
              </Text>
              <View style={styles.actions}>
                <Pressable style={[styles.actionBtn, styles.outlineBtn]} onPress={() => confirmDelete(post)}>
                  <Text style={styles.deleteText}>삭제</Text>
                </Pressable>
                <Pressable
                  style={[styles.actionBtn, hidden ? styles.primaryBtn : styles.darkBtn]}
                  onPress={() => setStatus(post, hidden ? "visible" : "hidden")}
                >
                  <Text style={styles.primaryText}>{hidden ? "다시 게시" : "숨기기"}</Text>
                </Pressable>
              </View>
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
  type: { flex: 1, fontSize: 13, color: "#6b7688", fontWeight: "700" },
  badge: { borderRadius: 10, paddingHorizontal: 9, paddingVertical: 3 },
  badgeText: { fontSize: 13, fontWeight: "800" },
  title: { marginTop: 8, fontSize: 17, fontWeight: "800", color: colors.navy },
  content: { marginTop: 6, fontSize: 14, color: colors.navy, lineHeight: 20 },
  meta: { marginTop: 8, fontSize: 13, color: "#8390a2" },
  reported: { color: "#d4483f", fontWeight: "800" },
  actions: { flexDirection: "row", justifyContent: "flex-end", gap: 8, marginTop: 12 },
  actionBtn: { borderRadius: 999, paddingHorizontal: 18, paddingVertical: 8 },
  outlineBtn: { borderWidth: 1, borderColor: "#e3b5b2" },
  deleteText: { color: "#d4483f", fontSize: 14, fontWeight: "700" },
  primaryBtn: { backgroundColor: colors.brand },
  darkBtn: { backgroundColor: "#5d6878" },
  primaryText: { color: colors.white, fontSize: 14, fontWeight: "700" },
});
