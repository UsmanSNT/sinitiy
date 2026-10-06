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
import { AppHeader } from "../components/AppHeader";
import { BottomNav } from "../components/BottomNav";
import { PhotoPicker } from "../components/PhotoPicker";
import { RegionPicker } from "../components/RegionPicker";
import { MaterialIcons } from "@expo/vector-icons";
import { BackButton } from "../components/BackButton";
import { colors } from "../theme";

type Props = NativeStackScreenProps<RootStackParamList, "NewPost">;

export function NewPostScreen({ navigation, route }: Props) {
  const { user } = useAuth();
  const editing = route.params?.post;
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState(editing?.categoryId ?? "");
  const [title, setTitle] = useState(editing?.title ?? "");
  const [content, setContent] = useState(editing?.content ?? "");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [images, setImages] = useState<string[]>(editing?.images ?? []);
  const [region, setRegion] = useState<string | null>(editing?.region ?? null);
  const [regionOpen, setRegionOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      navigation.replace("Login");
      return;
    }
    api.get<Category[]>("/categories").then((cats) => {
      setCategories(cats);
      if (cats[0] && !editing) setCategoryId(cats[0].id);
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
      const body = { categoryId, title, content, images, region: region ?? "" };
      const post = editing
        ? await api.put<{ id: string }>(`/posts/${editing.id}`, body)
        : await api.post<{ id: string }>("/posts", body);
      // Tahrirlashda orqaga qaytiladi (PostDetail fokusda qayta yuklanadi) - aks holda stack'da eski nusxa qolib ketadi.
      if (editing) navigation.goBack();
      else navigation.replace("PostDetail", { postId: post.id });
    } catch (err: any) {
      setError(err?.message ?? "글 작성에 실패했습니다");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={[]}>
      <AppHeader />
      <ScrollView contentContainerStyle={styles.container}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.title}>{editing ? "글 수정" : user?.userType === "admin" ? "공지 작성" : "글쓰기"}</Text>
        {user?.userType === "admin" && !editing ? <Text style={styles.adminNote}>관리자가 쓴 글은 공지로 표시되고, 모든 사용자에게 알림이 전송됩니다.</Text> : null}

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

        <Pressable onPress={() => setRegionOpen(true)} style={styles.regionRow} accessibilityLabel="지역 선택">
          <MaterialIcons name="place" size={18} color={colors.brand} />
          <Text style={[styles.regionText, !region && { color: colors.gray }]} numberOfLines={1}>{region ?? "지역 선택 (선택사항)"}</Text>
          <MaterialIcons name="keyboard-arrow-down" size={20} color="#66758a" />
        </Pressable>

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

        <PhotoPicker images={images} onChange={setImages} onError={setError} />

        {error && <Text style={styles.error}>{error}</Text>}

        <Pressable
          onPress={handleSubmit}
          disabled={submitting}
          style={[styles.button, submitting && styles.buttonDisabled]}
        >
          {submitting ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.buttonText}>{editing ? "수정하기" : "등록하기"}</Text>
          )}
        </Pressable>
      </ScrollView>
      <RegionPicker visible={regionOpen} value={region} onSelect={setRegion} onClose={() => setRegionOpen(false)} />
      <BottomNav active="Community" />
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
  adminNote: { fontSize: 13, color: "#6b7688", lineHeight: 19, marginTop: -8, marginBottom: 14 },
  regionRow: { flexDirection: "row", alignItems: "center", gap: 6, borderWidth: 1, borderColor: colors.border, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 13, marginBottom: 12 },
  regionText: { flex: 1, fontSize: 15, color: colors.navy },
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
