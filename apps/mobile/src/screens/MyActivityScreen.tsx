import { useCallback, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import type { MyComment, Post } from "@sinity/shared";
import type { RootStackParamList } from "../navigation/types";
import { api } from "../lib/api";
import { colors } from "../theme";
import { ListState } from "../components/ListState";
import { BottomNav } from "../components/BottomNav";

type Props = NativeStackScreenProps<RootStackParamList, "MyActivity">;
type Tab = "posts" | "comments" | "likes";

const tabs: Array<{ key: Tab; label: string }> = [
  { key: "posts", label: "작성한 글" },
  { key: "comments", label: "댓글" },
  { key: "likes", label: "좋아요" },
];

const formatDate = (iso: string) => iso.slice(0, 10).replace(/-/g, ".");

export function MyActivityScreen({ navigation }: Props) {
  const [tab, setTab] = useState<Tab>("posts");
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [comments, setComments] = useState<MyComment[] | null>(null);
  const [error, setError] = useState(false);

  const load = useCallback(() => {
    setError(false);
    setPosts(null);
    setComments(null);
    if (tab === "comments") {
      api.get<MyComment[]>("/me/comments").then(setComments).catch(() => setError(true));
    } else {
      api.get<Post[]>(`/me/${tab}`).then(setPosts).catch(() => setError(true));
    }
  }, [tab]);
  useFocusEffect(load);

  const items = tab === "comments" ? comments : posts;
  const openPost = (postId: string) => navigation.navigate("PostDetail", { postId });

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <Pressable accessibilityLabel="뒤로" hitSlop={12} onPress={() => navigation.goBack()}>
          <MaterialIcons name="chevron-left" size={28} color={colors.navy} />
        </Pressable>
        <Text style={styles.headerTitle}>내 활동</Text>
      </View>

      <View style={styles.tabs}>
        {tabs.map((t) => (
          <Pressable key={t.key} onPress={() => setTab(t.key)} style={[styles.tab, tab === t.key && styles.tabActive]}>
            <Text style={[styles.tabText, tab === t.key && styles.tabTextActive]}>{t.label}</Text>
          </Pressable>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        <ListState loading={items === null && !error} error={error} empty={items !== null && items.length === 0} />
        {tab === "comments"
          ? (comments ?? []).map((c) => (
              <Pressable key={c.id} style={({ pressed }) => [styles.row, pressed && styles.pressed]} onPress={() => openPost(c.postId)}>
                <View style={styles.rowCopy}>
                  <Text style={styles.rowTitle} numberOfLines={2}>{c.content}</Text>
                  <Text style={styles.rowMeta} numberOfLines={1}>{c.postTitle} · {formatDate(c.createdAt)}</Text>
                </View>
                <MaterialIcons name="chevron-right" size={22} color="#a4adba" />
              </Pressable>
            ))
          : (posts ?? []).map((p) => (
              <Pressable key={p.id} style={({ pressed }) => [styles.row, pressed && styles.pressed]} onPress={() => openPost(p.id)}>
                <View style={styles.rowCopy}>
                  <Text style={styles.rowTitle} numberOfLines={1}>{p.title}</Text>
                  <Text style={styles.rowMeta} numberOfLines={1}>{p.categoryName} · {formatDate(p.createdAt)}</Text>
                  <View style={styles.stats}>
                    <MaterialCommunityIcons name="heart-outline" size={15} color="#8290a4" />
                    <Text style={styles.statText}>{p.likeCount}</Text>
                    <MaterialCommunityIcons name="comment-outline" size={15} color="#8290a4" />
                    <Text style={styles.statText}>{p.commentCount}</Text>
                  </View>
                </View>
                <MaterialIcons name="chevron-right" size={22} color="#a4adba" />
              </Pressable>
            ))}
      </ScrollView>
      <BottomNav active="MyPage" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.white },
  header: { height: 52, flexDirection: "row", alignItems: "center", paddingHorizontal: 14 },
  headerTitle: { flex: 1, marginLeft: 7, fontSize: 20, fontWeight: "800", color: colors.navy },
  tabs: { flexDirection: "row", gap: 7, paddingHorizontal: 16, paddingBottom: 13, borderBottomWidth: 1, borderBottomColor: "#edf0f4" },
  tab: { height: 34, paddingHorizontal: 16, borderRadius: 17, alignItems: "center", justifyContent: "center" },
  tabActive: { backgroundColor: "#2368bc" },
  tabText: { fontSize: 14, fontWeight: "700", color: "#8792a4" },
  tabTextActive: { color: colors.white },
  list: { paddingHorizontal: 16, paddingBottom: 22 },
  row: { minHeight: 76, flexDirection: "row", alignItems: "center", borderBottomWidth: 1, borderBottomColor: "#edf0f4", paddingVertical: 12 },
  pressed: { opacity: 0.7 },
  rowCopy: { flex: 1, minWidth: 0, paddingRight: 10 },
  rowTitle: { fontSize: 17, fontWeight: "800", color: colors.navy },
  rowMeta: { marginTop: 6, fontSize: 13, color: "#8390a2" },
  stats: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 6 },
  statText: { marginRight: 10, fontSize: 13, color: "#8290a4" },
});
