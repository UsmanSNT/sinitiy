import { useState } from "react";
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import type { ListingType } from "@sinity/shared";
import type { RootStackParamList } from "../navigation/types";
import { api } from "../lib/api";
import { categoriesByType, listingTypeLabel } from "../lib/listingMeta";
import { colors } from "../theme";
import { RegionPicker } from "../components/RegionPicker";

type Props = NativeStackScreenProps<RootStackParamList, "ListingForm">;

const types: ListingType[] = ["health", "education", "life", "job"];

export function ListingFormScreen({ navigation }: Props) {
  const [listingType, setListingType] = useState<ListingType>("health");
  const [category, setCategory] = useState("");
  const [form, setForm] = useState({ title: "", region: "", period: "", content: "", targetAudience: "", applyMethod: "", phone: "" });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [regionPickerOpen, setRegionPickerOpen] = useState(false);

  const update = (key: keyof typeof form) => (value: string) => setForm((f) => ({ ...f, [key]: value }));

  async function submit() {
    setError(null);
    if (!form.title.trim()) return setError("제목을 입력해주세요");
    if (!form.content.trim()) return setError("내용을 입력해주세요");
    if (!form.targetAudience.trim()) return setError("지원 대상을 입력해주세요");
    if (!form.applyMethod.trim()) return setError("신청 방법을 입력해주세요");
    if (form.phone.replace(/\D/g, "").length < 9) return setError("문의 전화번호를 올바르게 입력해주세요");

    setSubmitting(true);
    try {
      await api.post("/listings", {
        listingType,
        title: form.title.trim(),
        content: form.content.trim(),
        targetAudience: form.targetAudience.trim(),
        applyMethod: form.applyMethod.trim(),
        phone: form.phone.trim(),
        category: category || undefined,
        region: form.region.trim() || undefined,
        period: form.period.trim() || undefined,
      });
      Alert.alert("등록 완료", "관리자 승인 후 게시됩니다.", [{ text: "확인", onPress: () => navigation.goBack() }]);
    } catch (err: any) {
      setError(err?.message ?? "등록에 실패했습니다");
    } finally {
      setSubmitting(false);
    }
  }

  const categories = categoriesByType[listingType];

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <Pressable accessibilityLabel="뒤로" hitSlop={12} onPress={() => navigation.goBack()}>
          <MaterialIcons name="chevron-left" size={28} color={colors.navy} />
        </Pressable>
        <Text style={styles.headerTitle}>새 공고 등록</Text>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={styles.label}>분류</Text>
          <View style={styles.chips}>
            {types.map((t) => (
              <Pressable key={t} onPress={() => { setListingType(t); setCategory(""); }} style={[styles.chip, listingType === t && styles.chipActive]}>
                <Text style={[styles.chipText, listingType === t && styles.chipTextActive]}>{listingTypeLabel[t]}</Text>
              </Pressable>
            ))}
          </View>

          {categories.length > 0 && (
            <>
              <Text style={styles.label}>카테고리</Text>
              <View style={styles.chips}>
                {categories.map((c) => (
                  <Pressable key={c} onPress={() => setCategory(c)} style={[styles.chip, category === c && styles.chipActive]}>
                    <Text style={[styles.chipText, category === c && styles.chipTextActive]}>{c}</Text>
                  </Pressable>
                ))}
              </View>
            </>
          )}

          <Field label="제목" value={form.title} onChangeText={update("title")} placeholder="공고 제목" />

          <Text style={styles.label}>지역</Text>
          <Pressable style={styles.input} onPress={() => setRegionPickerOpen(true)}>
            <Text style={form.region ? styles.regionValue : styles.regionPlaceholder}>
              {form.region || "지역을 선택해주세요"}
            </Text>
          </Pressable>

          <Field label="기간" value={form.period} onChangeText={update("period")} placeholder="예: 2025.09 - 10 또는 상시 모집" />
          <Field label="내용" value={form.content} onChangeText={update("content")} placeholder="공고 내용을 입력하세요" multiline />
          <Field label="지원 대상" value={form.targetAudience} onChangeText={update("targetAudience")} placeholder="예: 만 60세 이상" />
          <Field label="신청 방법" value={form.applyMethod} onChangeText={update("applyMethod")} placeholder="예: 전화 신청, 온라인 신청" />
          <Field label="문의 전화" value={form.phone} onChangeText={update("phone")} placeholder="02-123-4567" keyboardType="phone-pad" />

          {error && <Text style={styles.error}>{error}</Text>}
          <Text style={styles.notice}>등록한 공고는 관리자 승인 후 사용자에게 게시됩니다.</Text>
        </ScrollView>

        <View style={styles.footer}>
          <Pressable onPress={submit} disabled={submitting} style={[styles.submit, submitting && { opacity: 0.6 }]}>
            {submitting ? <ActivityIndicator color={colors.white} /> : <Text style={styles.submitText}>등록하기</Text>}
          </Pressable>
        </View>
      </KeyboardAvoidingView>

      <RegionPicker
        visible={regionPickerOpen}
        value={form.region || null}
        onSelect={(region) => update("region")(region ?? "")}
        onClose={() => setRegionPickerOpen(false)}
      />
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
  inputMulti: { minHeight: 110, textAlignVertical: "top" },
  regionValue: { fontSize: 14, color: colors.navy },
  regionPlaceholder: { fontSize: 14, color: colors.gray },
  error: { marginTop: 14, color: "#ef4444", fontSize: 13 },
  notice: { marginTop: 14, fontSize: 13, color: colors.gray },
  footer: { padding: 15, borderTopWidth: 1, borderTopColor: "#edf0f4" },
  submit: { backgroundColor: colors.brand, borderRadius: 999, paddingVertical: 14, alignItems: "center" },
  submitText: { color: colors.white, fontSize: 15, fontWeight: "700" },
});
