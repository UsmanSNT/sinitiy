import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { Category } from "@sinity/shared";
import type { RootStackParamList } from "../navigation/types";
import { api, imageUri, uploadImage } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { BackButton } from "../components/BackButton";
import { colors } from "../theme";

type Props = NativeStackScreenProps<RootStackParamList, "NewPost">;

const MAX_IMAGES = 3;

export function NewPostScreen({ navigation }: Props) {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigation.replace("Login");
      return;
    }
    api.get<Category[]>("/categories").then((cats) => {
      setCategories(cats);
      if (cats[0]) setCategoryId(cats[0].id);
    });
  }, [navigation, user]);

  async function pickImage() {
    if (images.length >= MAX_IMAGES || uploading) return;
    setError(null);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        quality: 0.6,
        base64: true,
      });
      const asset = result.canceled ? null : result.assets[0];
      if (!asset) return;
      if (!asset.base64) throw new Error("이미지를 불러오지 못했습니다");
      setUploading(true);
      const path = await uploadImage(asset.base64, asset.mimeType ?? "image/jpeg");
      setImages((prev) => [...prev, path]);
    } catch (err: any) {
      setError(err?.message ?? "이미지 업로드에 실패했습니다");
    } finally {
      setUploading(false);
    }
  }

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
        images,
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

        <View style={styles.photoRow}>
          {images.map((path) => (
            <View key={path} style={styles.photoBox}>
              <Image source={{ uri: imageUri(path) }} style={styles.photo} />
              <Pressable
                accessibilityLabel="사진 삭제"
                hitSlop={8}
                onPress={() => setImages((prev) => prev.filter((p) => p !== path))}
                style={styles.photoRemove}
              >
                <MaterialIcons name="close" size={16} color={colors.white} />
              </Pressable>
            </View>
          ))}
          {images.length < MAX_IMAGES && (
            <Pressable onPress={pickImage} disabled={uploading} style={[styles.photoBox, styles.photoAdd]}>
              {uploading ? (
                <ActivityIndicator color={colors.brand} />
              ) : (
                <>
                  <MaterialIcons name="add-a-photo" size={26} color={colors.brand} />
                  <Text style={styles.photoAddText}>
                    사진 {images.length}/{MAX_IMAGES}
                  </Text>
                </>
              )}
            </Pressable>
          )}
        </View>

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
  photoRow: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 14 },
  photoBox: { width: 96, height: 96, borderRadius: 14, overflow: "visible" },
  photo: { width: 96, height: 96, borderRadius: 14, backgroundColor: "#eef1f5" },
  photoRemove: {
    position: "absolute",
    top: -6,
    right: -6,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#4b5563",
    alignItems: "center",
    justifyContent: "center",
  },
  photoAdd: {
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  photoAddText: { fontSize: 13, color: colors.gray },
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
