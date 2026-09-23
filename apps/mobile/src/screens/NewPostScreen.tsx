import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { Category } from "@sinity/shared";
import type { RootStackParamList } from "../navigation/types";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { BackButton } from "../components/BackButton";
import { colors } from "../theme";

type Props = NativeStackScreenProps<RootStackParamList, "NewPost">;

export function NewPostScreen({ navigation }: Props) {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) {
      navigation.replace("Signup");
      return;
    }
    api.get<Category[]>("/categories").then((cats) => {
      setCategories(cats);
      if (cats[0]) setCategoryId(cats[0].id);
    });
  }, [navigation, user]);

  async function handleSubmit() {
    if (!title.trim() || !content.trim()) {
      setError("제목과 내용을 입력해주세요");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const post = await api.post<{ id: string }>("/posts", {
        categoryId,
        title,
        content,
        images: [],
      });
      navigation.replace("PostDetail", { postId: post.id });
    } catch (err: any) {
      setError(err?.message ?? "글 작성에 실패했습니다");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.container}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.title}>글쓰기</Text>

        <View style={styles.categoryRow}>
          {categories.map((c) => (
            <Pressable
              key={c.id}
              onPress={() => setCategoryId(c.id)}
              style={[styles.categoryChip, categoryId === c.id && styles.categoryChipActive]}
            >
              <Text style={[styles.categoryText, categoryId === c.id && styles.categoryTextActive]}>
                {c.name}
              </Text>
            </Pressable>
          ))}
        </View>

        <TextInput
          placeholder="제목"
          placeholderTextColor={colors.gray}
          value={title}
          onChangeText={setTitle}
          style={styles.input}
        />
        <TextInput
          placeholder="내용을 입력하세요"
          placeholderTextColor={colors.gray}
          value={content}
          onChangeText={setContent}
          style={[styles.input, styles.textArea]}
          multiline
          textAlignVertical="top"
        />

        {error && <Text style={styles.error}>{error}</Text>}

        <Pressable
          onPress={handleSubmit}
          disabled={submitting}
          style={[styles.button, submitting && styles.buttonDisabled]}
        >
          {submitting ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.buttonText}>등록하기</Text>
          )}
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.white },
  container: { flexGrow: 1, padding: 20 },
  title: { fontSize: 20, fontWeight: "700", color: colors.navy, marginTop: 16, marginBottom: 16 },
  categoryRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 16 },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryChipActive: { backgroundColor: colors.navy, borderColor: colors.navy },
  categoryText: { fontSize: 14, color: colors.gray },
  categoryTextActive: { color: colors.white, fontWeight: "700" },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: colors.navy,
    marginBottom: 12,
  },
  textArea: { minHeight: 160 },
  error: { color: "#ef4444", fontSize: 13, marginBottom: 8 },
  button: {
    backgroundColor: colors.brand,
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: "center",
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: colors.white, fontWeight: "700", fontSize: 15 },
});
