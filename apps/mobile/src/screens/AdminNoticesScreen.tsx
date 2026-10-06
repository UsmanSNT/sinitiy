import { useCallback, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import type { Post } from "@sinity/shared";
import { AppHeader } from "../components/AppHeader";
import { BottomNav } from "../components/BottomNav";
import { ListState } from "../components/ListState";
import { Alert } from "../lib/alert";
import { api } from "../lib/api";
import { formatDate } from "../lib/format";
import type { RootStackParamList } from "../navigation/types";
import { colors } from "../theme";

type Props = NativeStackScreenProps<RootStackParamList, "AdminNotices">;

// 공지: admin yozgan postlar (홈 알림 lentasida 공지 sifatida chiqadi va push yuboriladi).
export function AdminNoticesScreen({ navigation }: Props) {
  const [items, setItems] = useState<Post[] | null>(null);
  const [error, setError] = useState(false);

  const load = useCallback(() => {
    setError(false);
    api.get<Post[]>("/me/posts").then(setItems).catch(() => setError(true));
  }, []);
  useFocusEffect(load);

  function confirmDelete(post: Post) {
    Alert.alert("공지 삭제", `"${post.title}" 공지를 삭제할까요?`, [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        style: "destructive",
        onPress: async () => {
          try {
            await api.delete(`/posts/${post.id}`);
            load();
          } catch (err: any) {
            Alert.alert("삭제 실패", err?.message ?? "삭제하지 못했습니다");
          }
        },
      },
    ]);
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={[]}>
      <AppHeader />
      <View style={styles.header}>
        <Pressable accessibilityLabel="뒤로" hitSlop={12} onPress={() => navigation.goBack()}>
          <MaterialIcons name="chevron-left" size={28} color={colors.navy} />
        </Pressable>
        <Text style={styles.headerTitle}>공지 관리</Text>
        <Pressable accessibilityLabel="새 공지" hitSlop={12} onPress={() => navigation.navigate("NewPost")}>
          <MaterialIcons name="add" size={26} color={colors.navy} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        <Text style={styles.intro}>관리자가 쓴 글은 공지로 홈 알림에 표시되고, 새 글은 모든 사용자에게 알림이 전송됩니다.</Text>
        <ListState loading={items === null && !error} error={error} empty={items !== null && items.length === 0} />
        {(items ?? []).map((post) => (
          <View key={post.id} style={styles.card}>
            <Text style={styles.meta}>{post.categoryName} · {formatDate(post.createdAt)}{post.status === "hidden" ? " · 숨김" : ""}</Text>
            <Pressable onPress={() => navigation.navigate("PostDetail", { postId: post.id })}>
              <Text style={styles.title}>{post.title}</Text>
            </Pressable>
            <Text style={styles.body} numberOfLines={2}>{post.content}</Text>
            <View style={styles.actions}>
              <Pressable onPress={() => navigation.navigate("NewPost", { post })} hitSlop={8}>
                <Text style={styles.editText}>수정</Text>
              </Pressable>
              <Pressable onPress={() => confirmDelete(post)} hitSlop={8}>
                <Text style={styles.deleteText}>삭제</Text>
              </Pressable>
            </View>
          </View>
        ))}
      </ScrollView>
      <View style={styles.footer}>
        <Pressable style={styles.addButton} onPress={() => navigation.navigate("NewPost")}>
          <Text style={styles.addButtonText}>새 공지 작성</Text>
        </Pressable>
      </View>
      <BottomNav active="MyPage" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f6f8fb" },
  header: { height: 52, flexDirection: "row", alignItems: "center", paddingHorizontal: 14, backgroundColor: colors.white },
  headerTitle: { flex: 1, marginLeft: 7, fontSize: 20, fontWeight: "800", color: colors.navy },
  list: { padding: 15, gap: 10 },
  intro: { fontSize: 13, color: "#6b7688", lineHeight: 19 },
  card: { backgroundColor: colors.white, borderRadius: 12, borderWidth: 1, borderColor: "#e7ebf0", padding: 14 },
  meta: { fontSize: 13, color: "#8390a2" },
  title: { marginTop: 6, fontSize: 17, fontWeight: "800", color: colors.navy },
  body: { marginTop: 6, fontSize: 14, lineHeight: 21, color: "#4a5567" },
  actions: { flexDirection: "row", justifyContent: "flex-end", gap: 18, marginTop: 8 },
  editText: { fontSize: 14, color: "#2368bc", fontWeight: "700", textDecorationLine: "underline" },
  deleteText: { fontSize: 14, color: "#8390a2", textDecorationLine: "underline" },
  footer: { padding: 15, backgroundColor: colors.white, borderTopWidth: 1, borderTopColor: "#edf0f4" },
  addButton: { backgroundColor: colors.brand, borderRadius: 999, paddingVertical: 14, alignItems: "center" },
  addButtonText: { color: colors.white, fontSize: 15, fontWeight: "700" },
});
