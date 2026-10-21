import { useCallback, useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { ListingComment } from "@sinity/shared";
import type { RootStackParamList } from "../navigation/types";
import { api } from "../lib/api";
import { Alert } from "../lib/alert";
import { useAuth } from "../context/AuthContext";
import { colors } from "../theme";

type Props = { listingId: string };

// E'lon ostidagi izohlar. Yozish faqat ro'yxatdan o'tganlarga ochiq, mehmonga Login taklif qilinadi.
export function ListingComments({ listingId }: Props) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user } = useAuth();
  const [comments, setComments] = useState<ListingComment[]>([]);
  const [text, setText] = useState("");
  const [loadError, setLoadError] = useState(false);

  const load = useCallback(() => {
    setLoadError(false);
    api
      .get<ListingComment[]>(`/listing-comments/listing/${listingId}`)
      .then(setComments)
      .catch(() => setLoadError(true));
  }, [listingId]);

  useEffect(() => {
    load();
  }, [load]);

  async function submit() {
    if (!text.trim()) return;
    if (!user) {
      navigation.navigate("Login");
      return;
    }
    try {
      await api.post("/listing-comments", { listingId, content: text });
      setText("");
      load();
    } catch (err: any) {
      Alert.alert("오류", err?.message ?? "댓글을 등록하지 못했습니다. 잠시 후 다시 시도해주세요.");
    }
  }

  function confirmDelete(comment: ListingComment) {
    Alert.alert("댓글 삭제", "이 댓글을 삭제할까요?", [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        style: "destructive",
        onPress: async () => {
          try {
            await api.delete(`/listing-comments/${comment.id}`);
            load();
          } catch (err: any) {
            Alert.alert("오류", err?.message ?? "댓글을 삭제하지 못했습니다. 잠시 후 다시 시도해주세요.");
          }
        },
      },
    ]);
  }

  return (
    <View style={styles.wrap}>
      <Text style={styles.header}>댓글 {comments.length}</Text>
      {loadError ? <Text style={styles.empty}>댓글을 불러오지 못했습니다.</Text> : null}
      {!loadError && comments.length === 0 ? <Text style={styles.empty}>아직 댓글이 없습니다.</Text> : null}
      {comments.map((c) => (
        <View key={c.id} style={styles.card}>
          <View style={styles.cardTop}>
            <Text style={styles.author}>{c.authorName}</Text>
            {user && (user.id === c.authorId || user.userType === "admin") ? (
              <Pressable accessibilityLabel="댓글 삭제" hitSlop={8} onPress={() => confirmDelete(c)}>
                <Text style={styles.delete}>삭제</Text>
              </Pressable>
            ) : null}
          </View>
          <Text style={styles.body}>{c.content}</Text>
        </View>
      ))}

      {user ? (
        <View style={styles.inputRow}>
          <TextInput
            placeholder="댓글을 입력하세요"
            placeholderTextColor={colors.gray}
            value={text}
            onChangeText={setText}
            style={styles.input}
            multiline
            maxLength={1000}
          />
          <Pressable onPress={submit} style={styles.submit}>
            <Text style={styles.submitText}>등록</Text>
          </Pressable>
        </View>
      ) : (
        <Pressable onPress={() => navigation.navigate("Login")} style={styles.loginPrompt}>
          <Text style={styles.loginPromptText}>댓글을 쓰려면 로그인하세요</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 8, borderTopWidth: 1, borderTopColor: colors.border },
  header: { fontSize: 18, fontWeight: "800", color: colors.navy, marginBottom: 12 },
  empty: { fontSize: 16, color: colors.gray, marginBottom: 12 },
  card: { backgroundColor: "#f5f6f8", borderRadius: 12, padding: 14, marginBottom: 10 },
  cardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  author: { fontSize: 16, fontWeight: "700", color: colors.navy },
  delete: { fontSize: 15, fontWeight: "700", color: colors.gray },
  body: { fontSize: 16, lineHeight: 24, color: colors.navy, marginTop: 6 },
  inputRow: { flexDirection: "row", gap: 8, alignItems: "flex-end", marginTop: 8 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    color: colors.navy,
    maxHeight: 120,
  },
  submit: {
    backgroundColor: colors.brand,
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 12,
    justifyContent: "center",
  },
  submitText: { color: colors.white, fontWeight: "700", fontSize: 16 },
  loginPrompt: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 999,
    paddingVertical: 13,
    alignItems: "center",
    marginTop: 8,
  },
  loginPromptText: { color: colors.gray, fontSize: 16, fontWeight: "600" },
});
