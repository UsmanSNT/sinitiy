import { useCallback, useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import type { Inquiry } from "@sinity/shared";
import { AppHeader } from "../components/AppHeader";
import { BottomNav } from "../components/BottomNav";
import { Alert } from "../lib/alert";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import type { RootStackParamList } from "../navigation/types";
import { formatDate } from "../lib/format";
import { colors } from "../theme";

type Props = NativeStackScreenProps<RootStackParamList, "Inquiry">;

export function InquiryScreen({ navigation }: Props) {
  const { user } = useAuth();
  const [items, setItems] = useState<Inquiry[] | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(() => {
    if (!user) {
      navigation.replace("Login");
      return;
    }
    api.get<Inquiry[]>("/inquiries/mine").then(setItems).catch(() => setItems([]));
  }, [navigation, user]);
  useFocusEffect(load);

  async function submit() {
    if (submitting) return;
    setError(null);
    if (!title.trim() || !content.trim()) return setError("제목과 내용을 입력해주세요");
    setSubmitting(true);
    try {
      await api.post("/inquiries", { title: title.trim(), content: content.trim() });
      setTitle("");
      setContent("");
      load();
      Alert.alert("문의 접수", "문의가 접수되었습니다. 답변이 등록되면 알려드릴게요.");
    } catch (err: any) {
      setError(err?.message ?? "문의를 접수하지 못했습니다");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={[]}>
      <AppHeader />
      <View style={styles.header}>
        <Pressable accessibilityLabel="뒤로" hitSlop={12} onPress={() => navigation.goBack()}>
          <MaterialIcons name="chevron-left" size={28} color={colors.navy} />
        </Pressable>
        <Text style={styles.headerTitle}>1:1 문의</Text>
      </View>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <TextInput value={title} onChangeText={setTitle} placeholder="제목" placeholderTextColor={colors.gray} maxLength={100} style={styles.input} />
          <TextInput value={content} onChangeText={setContent} placeholder="문의 내용을 입력해주세요" placeholderTextColor={colors.gray} multiline maxLength={2000} style={[styles.input, styles.multi]} />
          {error && <Text style={styles.error}>{error}</Text>}
          <Pressable onPress={submit} disabled={submitting} style={[styles.submit, submitting && { opacity: 0.6 }]}>
            {submitting ? <ActivityIndicator color={colors.white} /> : <Text style={styles.submitText}>문의하기</Text>}
          </Pressable>

          <Text style={styles.listTitle}>내 문의 내역</Text>
          {items !== null && items.length === 0 && <Text style={styles.empty}>아직 문의한 내역이 없습니다.</Text>}
          {(items ?? []).map((item) => (
            <View key={item.id} style={styles.card}>
              <View style={styles.cardTop}>
                <Text style={styles.date}>{formatDate(item.createdAt)}</Text>
                <View style={[styles.badge, item.answer ? styles.badgeDone : styles.badgeWait]}>
                  <Text style={[styles.badgeText, item.answer ? styles.badgeDoneText : styles.badgeWaitText]}>{item.answer ? "답변 완료" : "답변 대기"}</Text>
                </View>
              </View>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardBody}>{item.content}</Text>
              {item.answer ? (
                <View style={styles.answer}>
                  <Text style={styles.answerLabel}>운영자 답변</Text>
                  <Text style={styles.cardBody}>{item.answer}</Text>
                </View>
              ) : null}
            </View>
          ))}
        </ScrollView>
      </KeyboardAvoidingView>
      <BottomNav active="MyPage" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.white },
  header: { height: 52, flexDirection: "row", alignItems: "center", paddingHorizontal: 14 },
  headerTitle: { flex: 1, marginLeft: 7, fontSize: 20, fontWeight: "800", color: colors.navy },
  content: { padding: 18, paddingBottom: 30 },
  input: { borderWidth: 1, borderColor: "#dfe5eb", borderRadius: 8, paddingHorizontal: 12, paddingVertical: 11, fontSize: 15, color: colors.navy, marginBottom: 10 },
  multi: { minHeight: 120, textAlignVertical: "top" },
  error: { color: "#ef4444", fontSize: 13, marginBottom: 8 },
  submit: { backgroundColor: colors.brand, borderRadius: 999, paddingVertical: 14, alignItems: "center" },
  submitText: { color: colors.white, fontSize: 15, fontWeight: "700" },
  listTitle: { marginTop: 28, marginBottom: 10, fontSize: 17, fontWeight: "800", color: colors.navy },
  empty: { color: colors.gray, fontSize: 14 },
  card: { borderWidth: 1, borderColor: "#e7ebf0", borderRadius: 12, padding: 14, marginBottom: 10 },
  cardTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  date: { fontSize: 13, color: "#8390a2" },
  badge: { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 3 },
  badgeDone: { backgroundColor: "#e3f7ec" },
  badgeWait: { backgroundColor: "#fff1e2" },
  badgeText: { fontSize: 12, fontWeight: "800" },
  badgeDoneText: { color: "#1a9a5a" },
  badgeWaitText: { color: "#c9661c" },
  cardTitle: { marginTop: 8, fontSize: 16, fontWeight: "800", color: colors.navy },
  cardBody: { marginTop: 6, fontSize: 14, lineHeight: 21, color: "#4a5567" },
  answer: { marginTop: 12, padding: 12, borderRadius: 8, backgroundColor: "#f3f7fd" },
  answerLabel: { fontSize: 13, fontWeight: "800", color: "#2368bc" },
});
