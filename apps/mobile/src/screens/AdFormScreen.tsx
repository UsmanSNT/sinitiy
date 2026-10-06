import { useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { Alert } from "../lib/alert";
import { MaterialIcons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { isValidKoreanPhone } from "@sinity/shared";
import { SafeAreaView } from "react-native-safe-area-context";
import { BottomNav } from "../components/BottomNav";
import { AppHeader } from "../components/AppHeader";
import type { RootStackParamList } from "../navigation/types";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { colors } from "../theme";
import { PhotoPicker } from "../components/PhotoPicker";

type Props = NativeStackScreenProps<RootStackParamList, "AdForm">;

export function AdFormScreen({ navigation, route }: Props) {
  const { user } = useAuth();
  const editing = route.params?.ad;
  const [images, setImages] = useState<string[]>(editing?.images ?? []);
  // Tashkilot profilidagi ma'lumotlar oldindan to'ldiriladi - ko'pincha o'zgartirish shart emas.
  const [form, setForm] = useState({
    title: editing?.title ?? "",
    content: editing?.content ?? "",
    phone: editing?.phone ?? user?.phone ?? "",
    homepage: editing?.homepage ?? user?.organizationProfile?.homepage ?? "",
  });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const update = (key: keyof typeof form) => (value: string) => setForm((f) => ({ ...f, [key]: value }));

  async function submit() {
    setError(null);
    if (!form.title.trim()) return setError("광고 제목을 입력해주세요");
    if (!form.content.trim()) return setError("광고 내용을 입력해주세요");
    if (!isValidKoreanPhone(form.phone)) return setError("문의 전화번호를 올바르게 입력해주세요");
    let homepage = form.homepage.trim();
    if (homepage && !/^https?:\/\//.test(homepage)) homepage = `https://${homepage}`;

    if (submitting) return;
    setSubmitting(true);
    let succeeded = false;
    try {
      const body = {
        title: form.title.trim(),
        content: form.content.trim(),
        phone: form.phone.trim(),
        homepage,
        images,
      };
      if (editing) await api.put(`/ad-requests/${editing.id}`, body);
      else await api.post("/ad-requests", body);
      succeeded = true;
      Alert.alert(editing ? "수정 완료" : "신청 완료", editing ? "관리자 재승인 후 다시 배너로 노출됩니다." : "관리자 승인 후 배너로 노출됩니다.", [{ text: "확인", onPress: () => navigation.goBack() }]);
    } catch (err: any) {
      setError(err?.message ?? "신청에 실패했습니다");
    } finally {
      // Muvaffaqiyatdan keyin tugma qulflangan qoladi - orqaga qaytguncha qayta bosib dublikat yaratib bo'lmaydi.
      if (!succeeded) setSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={[]}>
      <AppHeader />
      <View style={styles.header}>
        <Pressable accessibilityLabel="뒤로" hitSlop={12} onPress={() => navigation.goBack()}>
          <MaterialIcons name="chevron-left" size={28} color={colors.navy} />
        </Pressable>
        <Text style={styles.headerTitle}>{editing ? "광고 수정" : "새 광고 신청"}</Text>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Field label="광고 제목" value={form.title} onChangeText={update("title")} placeholder="예: 어르신 무료 건강 상담 이벤트" maxLength={60} />
          <Field label="광고 내용" value={form.content} onChangeText={update("content")} placeholder="어르신들께 알리고 싶은 내용을 적어주세요" multiline />
          <Field label="문의 전화" value={form.phone} onChangeText={update("phone")} placeholder="02-123-4567" keyboardType="phone-pad" />
          <Field label="홈페이지 (선택)" value={form.homepage} onChangeText={update("homepage")} placeholder="www.example.com" autoCapitalize="none" keyboardType="url" />
          <Text style={styles.label}>배너 이미지 (선택)</Text>
          <PhotoPicker images={images} onChange={setImages} onError={setError} />

          {error && <Text style={styles.error}>{error}</Text>}
          <Text style={styles.notice}>승인된 광고는 '파트너 정보' 화면 상단 배너로 노출됩니다.</Text>
        </ScrollView>

        <View style={styles.footer}>
          <Pressable onPress={submit} disabled={submitting} style={[styles.submit, submitting && { opacity: 0.6 }]}>
            {submitting ? <ActivityIndicator color={colors.white} /> : <Text style={styles.submitText}>{editing ? "수정하기" : "신청하기"}</Text>}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
      <BottomNav active="MyPage" />
    </SafeAreaView>
  );
}

function Field({ label, multiline, ...props }: { label: string; multiline?: boolean } & React.ComponentProps<typeof TextInput>) {
  return (
    <>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        {...props}
        multiline={multiline}
        placeholderTextColor={colors.gray}
        style={[styles.input, multiline && styles.inputMulti, { outlineStyle: "none" } as any]}
      />
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.white },
  header: { height: 52, flexDirection: "row", alignItems: "center", paddingHorizontal: 14 },
  headerTitle: { flex: 1, marginLeft: 7, fontSize: 20, fontWeight: "800", color: colors.navy },
  content: { padding: 18, paddingBottom: 30 },
  label: { marginTop: 16, marginBottom: 7, fontSize: 15, fontWeight: "800", color: colors.navy },
  input: { borderWidth: 1, borderColor: "#dfe5eb", borderRadius: 8, paddingHorizontal: 12, paddingVertical: 12, fontSize: 15, color: colors.navy },
  inputMulti: { minHeight: 120, textAlignVertical: "top" },
  error: { marginTop: 14, color: "#ef4444", fontSize: 14 },
  notice: { marginTop: 14, fontSize: 13, color: colors.gray },
  footer: { padding: 15, borderTopWidth: 1, borderTopColor: "#edf0f4" },
  submit: { backgroundColor: colors.brand, borderRadius: 999, paddingVertical: 14, alignItems: "center" },
  submitText: { color: colors.white, fontSize: 16, fontWeight: "700" },
});
