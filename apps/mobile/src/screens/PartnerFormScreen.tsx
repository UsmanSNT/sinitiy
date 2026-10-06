import { useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { isValidKoreanPhone } from "@sinity/shared";
import { AppHeader } from "../components/AppHeader";
import { BottomNav } from "../components/BottomNav";
import { DateRangeFields, validateDateRange } from "../components/DateRangeFields";
import { PhotoPicker } from "../components/PhotoPicker";
import { RegionPicker } from "../components/RegionPicker";
import { Alert } from "../lib/alert";
import { api } from "../lib/api";
import type { RootStackParamList } from "../navigation/types";
import { colors } from "../theme";

type Props = NativeStackScreenProps<RootStackParamList, "PartnerForm">;

const categories = ["제휴혜택", "추천서비스"];

export function PartnerFormScreen({ navigation, route }: Props) {
  const editing = route.params?.partner;
  const [form, setForm] = useState({
    name: editing?.name ?? "",
    category: editing?.category ?? categories[0],
    service: editing?.service ?? "",
    location: editing?.location ?? "",
    address: editing?.address ?? "",
    phone: editing?.phone ?? "",
    homepage: editing?.homepage ?? "",
    description: editing?.description ?? "",
    displayStart: editing?.displayStart ?? "",
    displayEnd: editing?.displayEnd ?? "",
  });
  const [recommended, setRecommended] = useState(editing?.recommended ?? false);
  const [images, setImages] = useState<string[]>(editing?.images ?? []);
  const [regionOpen, setRegionOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const update = (key: keyof typeof form) => (value: string) => setForm((f) => ({ ...f, [key]: value }));

  async function submit() {
    if (submitting) return;
    setError(null);
    if (!form.name.trim()) return setError("파트너 이름을 입력해주세요");
    if (!form.address.trim()) return setError("주소를 입력해주세요");
    if (!isValidKoreanPhone(form.phone)) return setError("전화번호를 올바르게 입력해주세요");
    const dateError = validateDateRange(form.displayStart, form.displayEnd);
    if (dateError) return setError(dateError);
    let homepage = form.homepage.trim();
    if (homepage && !/^https?:\/\//.test(homepage)) homepage = `https://${homepage}`;

    setSubmitting(true);
    let succeeded = false;
    try {
      const body = { ...form, name: form.name.trim(), address: form.address.trim(), phone: form.phone.trim(), homepage, recommended, images };
      if (editing) await api.put(`/partners/${editing.id}`, body);
      else await api.post("/partners", body);
      succeeded = true;
      Alert.alert(editing ? "수정 완료" : "등록 완료", "파트너 정보가 저장되었습니다.", [{ text: "확인", onPress: () => navigation.goBack() }]);
    } catch (err: any) {
      setError(err?.message ?? "저장하지 못했습니다");
    } finally {
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
        <Text style={styles.headerTitle}>{editing ? "파트너 수정" : "새 파트너 등록"}</Text>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Field label="파트너 이름" value={form.name} onChangeText={update("name")} placeholder="예: 행복한 요양원" maxLength={100} />

          <Text style={styles.label}>분류</Text>
          <View style={styles.chips}>
            {categories.map((c) => (
              <Pressable key={c} onPress={() => update("category")(c)} style={[styles.chip, form.category === c && styles.chipActive]}>
                <Text style={[styles.chipText, form.category === c && styles.chipTextActive]}>{c}</Text>
              </Pressable>
            ))}
          </View>

          <Field label="서비스 소개 (한 줄)" value={form.service} onChangeText={update("service")} placeholder="예: 요양·돌봄 서비스" maxLength={100} />

          <Text style={styles.label}>지역</Text>
          <Pressable style={styles.input} onPress={() => setRegionOpen(true)}>
            <Text style={form.location ? styles.value : styles.placeholder}>{form.location || "지역을 선택해주세요"}</Text>
          </Pressable>

          <Field label="주소" value={form.address} onChangeText={update("address")} placeholder="도로명 주소" maxLength={200} />
          <Field label="전화번호" value={form.phone} onChangeText={update("phone")} placeholder="02-123-4567" keyboardType="phone-pad" />
          <Field label="홈페이지 (선택)" value={form.homepage} onChangeText={update("homepage")} placeholder="www.example.com" autoCapitalize="none" keyboardType="url" />
          <Field label="상세 설명 (선택)" value={form.description} onChangeText={update("description")} placeholder="파트너를 소개해주세요" multiline maxLength={1000} />

          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>추천 파트너로 표시</Text>
            <Switch value={recommended} onValueChange={setRecommended} />
          </View>

          <Text style={styles.label}>대표 이미지 (선택)</Text>
          <PhotoPicker images={images} onChange={setImages} onError={setError} />

          <DateRangeFields label="노출 기간 (선택)" start={form.displayStart} end={form.displayEnd} onChange={(displayStart, displayEnd) => setForm((f) => ({ ...f, displayStart, displayEnd }))} />

          {error && <Text style={styles.error}>{error}</Text>}
        </ScrollView>

        <View style={styles.footer}>
          <Pressable onPress={submit} disabled={submitting} style={[styles.submit, submitting && { opacity: 0.6 }]}>
            {submitting ? <ActivityIndicator color={colors.white} /> : <Text style={styles.submitText}>{editing ? "수정하기" : "등록하기"}</Text>}
          </Pressable>
        </View>
      </KeyboardAvoidingView>

      <RegionPicker visible={regionOpen} value={form.location || null} onSelect={(r) => update("location")(r ?? "")} onClose={() => setRegionOpen(false)} />
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
  label: { marginTop: 16, marginBottom: 7, fontSize: 14, fontWeight: "800", color: colors.navy },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 7 },
  chip: { paddingHorizontal: 13, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center", backgroundColor: "#f0f3f7" },
  chipActive: { backgroundColor: "#2368bc" },
  chipText: { fontSize: 14, fontWeight: "700", color: "#7b8797" },
  chipTextActive: { color: colors.white },
  input: { borderWidth: 1, borderColor: "#dfe5eb", borderRadius: 8, paddingHorizontal: 12, paddingVertical: 11, fontSize: 14, color: colors.navy },
  inputMulti: { minHeight: 100, textAlignVertical: "top" },
  value: { fontSize: 14, color: colors.navy },
  placeholder: { fontSize: 14, color: colors.gray },
  switchRow: { marginTop: 16, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  switchLabel: { fontSize: 14, fontWeight: "800", color: colors.navy },
  error: { marginTop: 14, color: "#ef4444", fontSize: 13 },
  footer: { padding: 15, borderTopWidth: 1, borderTopColor: "#edf0f4" },
  submit: { backgroundColor: colors.brand, borderRadius: 999, paddingVertical: 14, alignItems: "center" },
  submitText: { color: colors.white, fontSize: 15, fontWeight: "700" },
});
