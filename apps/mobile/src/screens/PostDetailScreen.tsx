import { useCallback, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { Comment, Post } from "@sinity/shared";
import type { RootStackParamList } from "../navigation/types";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { BackButton } from "../components/BackButton";
import { colors } from "../theme";

type Props = NativeStackScreenProps<RootStackParamList, "PostDetail">;

export function PostDetailScreen({ route, navigation }: Props) {
  const { postId } = route.params;
  const { user } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [liked, setLiked] = useState(false);
  const [reporting, setReporting] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportSent, setReportSent] = useState(false);

  const load = useCallback(() => {
    api.get<Post>(`/posts/${postId}`).then(setPost);
    api.get<Comment[]>(`/comments/post/${postId}`).then(setComments);
  }, [postId]);

  useFocusEffect(load);

  async function toggleLike() {
    if (!user) {
      navigation.navigate("Signup");
      return;
    }
    const res = await api.post<{ liked: boolean; likeCount: number }>(`/likes/${postId}`);
    setLiked(res.liked);
    setPost((p) => (p ? { ...p, likeCount: res.likeCount } : p));
  }

  async function submitComment() {
    if (!commentText.trim()) return;
    if (!user) {
      navigation.navigate("Signup");
      return;
    }
    await api.post("/comments", { postId, content: commentText });
    setCommentText("");
    load();
  }

  async function submitReport() {
    if (!reportReason.trim()) return;
    if (!user) {
      navigation.navigate("Signup");
      return;
    }
    await api.post("/reports", { targetType: "post", targetId: postId, reason: reportReason });
    setReporting(false);
    setReportReason("");
    setReportSent(true);
  }

  if (!post) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.loading}>불러오는 중...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <BackButton onPress={() => navigation.goBack()} />

          <Text style={styles.category}>{post.categoryName}</Text>
          <Text style={styles.title}>{post.title}</Text>
          <Text style={styles.author}>{post.authorName}</Text>
          <Text style={styles.body}>{post.content}</Text>

          <View style={styles.actionRow}>
            <Pressable
              onPress={toggleLike}
              style={[styles.actionBtn, liked && styles.actionBtnActive]}
            >
              <Text style={[styles.actionText, liked && styles.actionTextActive]}>
                좋아요 {post.likeCount}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => (user ? setReporting((v) => !v) : navigation.navigate("Signup"))}
              style={styles.actionBtn}
            >
              <Text style={styles.actionTextMuted}>신고하기</Text>
            </Pressable>
          </View>

          {reporting && (
            <View style={styles.reportBox}>
              <TextInput
                placeholder="신고 사유를 입력하세요"
                placeholderTextColor={colors.gray}
                value={reportReason}
                onChangeText={setReportReason}
                style={styles.reportInput}
              />
              <Pressable onPress={submitReport} style={styles.reportSubmit}>
                <Text style={styles.reportSubmitText}>제출</Text>
              </Pressable>
            </View>
          )}
          {reportSent && <Text style={styles.reportSent}>신고가 접수되었습니다.</Text>}

          <Text style={styles.commentHeader}>댓글 {comments.length}</Text>
          {comments.map((c) => (
            <View key={c.id} style={styles.commentCard}>
              <Text style={styles.commentAuthor}>{c.authorName}</Text>
              <Text style={styles.commentBody}>{c.content}</Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.commentInputRow}>
          {user ? (
            <>
              <TextInput
                placeholder="댓글을 입력하세요"
                placeholderTextColor={colors.gray}
                value={commentText}
                onChangeText={setCommentText}
                style={styles.commentInput}
              />
              <Pressable onPress={submitComment} style={styles.commentSubmit}>
                <Text style={styles.commentSubmitText}>등록</Text>
              </Pressable>
            </>
          ) : (
            <Pressable onPress={() => navigation.navigate("Signup")} style={styles.loginPrompt}>
              <Text style={styles.loginPromptText}>댓글을 쓰려면 로그인 또는 회원가입이 필요합니다.</Text>
            </Pressable>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.white },
  container: { flexGrow: 1, padding: 20, paddingBottom: 40 },
  loading: { textAlign: "center", marginTop: 40, color: colors.gray },
  category: { fontSize: 14, color: colors.accent, fontWeight: "700", marginTop: 16 },
  title: { fontSize: 20, fontWeight: "700", color: colors.navy, marginTop: 6 },
  author: { fontSize: 14, color: colors.gray, marginTop: 4 },
  body: { fontSize: 14, color: colors.navy, marginTop: 16, lineHeight: 22 },
  actionRow: { flexDirection: "row", gap: 10, marginTop: 20 },
  actionBtn: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  actionBtnActive: { borderColor: colors.accent, backgroundColor: colors.accent + "15" },
  actionText: { fontSize: 13, color: colors.navy, fontWeight: "600" },
  actionTextActive: { color: colors.accent },
  actionTextMuted: { fontSize: 13, color: colors.gray },
  reportBox: { flexDirection: "row", gap: 8, marginTop: 12 },
  reportInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    color: colors.navy,
  },
  reportSubmit: {
    backgroundColor: colors.navy,
    borderRadius: 10,
    paddingHorizontal: 14,
    justifyContent: "center",
  },
  reportSubmitText: { color: colors.white, fontSize: 13, fontWeight: "700" },
  reportSent: { marginTop: 8, fontSize: 14, color: colors.gray },
  commentHeader: { fontSize: 15, fontWeight: "700", color: colors.navy, marginTop: 28, marginBottom: 10 },
  commentCard: { backgroundColor: "#f5f6f8", borderRadius: 10, padding: 12, marginBottom: 8 },
  commentAuthor: { fontSize: 14, fontWeight: "700", color: colors.navy },
  commentBody: { fontSize: 13, color: colors.navy, marginTop: 4 },
  commentInputRow: {
    flexDirection: "row",
    gap: 8,
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.white,
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 13,
    color: colors.navy,
  },
  commentSubmit: {
    backgroundColor: colors.brand,
    borderRadius: 999,
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  commentSubmitText: { color: colors.white, fontWeight: "700", fontSize: 13 },
  loginPrompt: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 999,
    paddingVertical: 11,
    alignItems: "center",
  },
  loginPromptText: { color: colors.gray, fontSize: 13, fontWeight: "600" },
});
