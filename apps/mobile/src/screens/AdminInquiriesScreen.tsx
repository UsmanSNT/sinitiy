import { useCallback, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import type { Inquiry } from "@sinity/shared";
import { AppHeader } from "../components/AppHeader";
import { BottomNav } from "../components/BottomNav";
import { ListState } from "../components/ListState";
import { Alert } from "../lib/alert";
import { api } from "../lib/api";
import type { RootStackParamList } from "../navigation/types";
import { formatDate } from "../lib/format";
import { colors } from "../theme";

type Props = NativeStackScreenProps<RootStackParamList, "AdminInquiries">;

export function AdminInquiriesScreen({ navigation }: Props) {
  const [items, setItems] = useState<Inquiry[] | null>(null);
  const [error, setError] = useState(false);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(() => {
    setError(false);
    api.get<Inquiry[]>("/inquiries").then(setItems).catch(() => setError(true));
  }, []);
  useFocusEffect(load);

  async function answer(item: Inquiry) {
    const text = (drafts[item.id] ?? "").trim();
    if (!text || busy) return;
    setBusy(item.id);
    try {
      await api.patch(`/inquiries/${item.id}/answer`, { answer: text });
      setDrafts((d) => ({ ...d, [item.id]: "" }));
      load();
    } catch (err: any) {
      Alert.alert("처리 실패", err?.message ?? "답변을 등록하지 못했습니다");
    } finally {
      setBusy(null);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={[]}>
      <AppHeader />
      <View style={styles.header}>
        <Pressable accessibilityLabel="뒤로" hitSlop={12} onPress={() => navigation.goBack()}>
          <MaterialIcons name="chevron-left" size={28} color={colors.navy} />
        </Pressable>
        <Text style={styles.headerTitle}>문의 관리</Text>
      </View>
      <ScrollView contentContainerStyle={styles.list} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <ListState loading={items === null && !error} error={error} empty={items !== null && items.length === 0} />
        {(items ?? []).map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.cardTop}>
              <Text style={styles.meta}>{item.userName} · {formatDate(item.createdAt)}</Text>
              <Text style={[styles.status, item.answer ? styles.done : styles.wait]}>{item.answer ? "답변 완료" : "답변 대기"}</Text>
            </View>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.body}>{item.content}</Text>
            {item.answer ? <Text style={styles.answer}>답변: {item.answer}</Text> : null}
            <TextInput
              value={drafts[item.id] ?? ""}
              onChangeText={(v) => setDrafts((d) => ({ ...d, [item.id]: v }))}
              placeholder={item.answer ? "답변 수정" : "답변을 입력하세요"}
              placeholderTextColor={colors.gray}
              multiline
              maxLength={2000}
              style={styles.input}
            />
            <Pressable onPress={() => answer(item)} disabled={busy === item.id} style={[styles.button, busy === item.id && { opacity: 0.6 }]}>
              <Text style={styles.buttonText}>{item.answer ? "답변 수정" : "답변 등록"}</Text>
            </Pressable>
          </View>
        ))}
      </ScrollView>
      <BottomNav active="MyPage" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f6f8fb" },
  header: { height: 52, flexDirection: "row", alignItems: "center", paddingHorizontal: 14, backgroundColor: colors.white },
  headerTitle: { flex: 1, marginLeft: 7, fontSize: 20, fontWeight: "800", color: colors.navy },
  list: { padding: 15, gap: 10 },
  card: { backgroundColor: colors.white, borderRadius: 12, borderWidth: 1, borderColor: "#e7ebf0", padding: 14 },
  cardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  meta: { fontSize: 13, color: "#8390a2" },
  status: { fontSize: 12, fontWeight: "800" },
  done: { color: "#1a9a5a" },
  wait: { color: "#c9661c" },
  title: { marginTop: 8, fontSize: 16, fontWeight: "800", color: colors.navy },
  body: { marginTop: 6, fontSize: 14, lineHeight: 21, color: "#4a5567" },
  answer: { marginTop: 10, fontSize: 14, lineHeight: 21, color: "#2368bc" },
  input: { marginTop: 12, minHeight: 70, textAlignVertical: "top", borderWidth: 1, borderColor: "#dfe5eb", borderRadius: 8, padding: 10, fontSize: 14, color: colors.navy },
  button: { marginTop: 8, alignSelf: "flex-end", backgroundColor: colors.brand, borderRadius: 999, paddingHorizontal: 18, paddingVertical: 9 },
  buttonText: { color: colors.white, fontSize: 14, fontWeight: "700" },
});
