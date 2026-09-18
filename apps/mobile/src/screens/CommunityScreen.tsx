import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import type { PaginatedResult, Post } from "@sinity/shared";
import { api } from "../lib/api";
import { colors } from "../theme";

export function CommunityScreen() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<PaginatedResult<Post>>("/posts")
      .then((res) => setPosts(res.items))
      .finally(() => setLoading(false));
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>커뮤니티</Text>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <Text style={styles.empty}>
            {loading ? "불러오는 중..." : "아직 게시글이 없습니다."}
          </Text>
        }
        renderItem={({ item }) => (
          <View style={styles.postCard}>
            <Text style={styles.category}>{item.categoryName}</Text>
            <Text style={styles.postTitle}>{item.title}</Text>
            <Text style={styles.postBody} numberOfLines={2}>
              {item.content}
            </Text>
            <Text style={styles.meta}>
              좋아요 {item.likeCount} · 댓글 {item.commentCount}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white, padding: 20, paddingTop: 60 },
  title: { fontSize: 20, fontWeight: "700", color: colors.navy, marginBottom: 16 },
  empty: { textAlign: "center", color: colors.gray, marginTop: 40 },
  postCard: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },
  category: { fontSize: 11, color: colors.accent, fontWeight: "700" },
  postTitle: { fontSize: 15, fontWeight: "700", color: colors.navy, marginTop: 4 },
  postBody: { fontSize: 13, color: colors.gray, marginTop: 4 },
  meta: { fontSize: 11, color: colors.gray, marginTop: 8 },
});
