import { useCallback, useState } from "react";
import { Alert, Linking, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import type { AdRequest } from "@sinity/shared";
import type { RootStackParamList } from "../navigation/types";
import { api } from "../lib/api";
import { adStatusMeta } from "../lib/adMeta";
import { formatDate } from "../lib/format";
import { ListState } from "../components/ListState";
import { BottomNav } from "../components/BottomNav";
import { colors } from "../theme";

type Props = NativeStackScreenProps<RootStackParamList, "AdminAds">;
const tabs = [
  { key: "pending", label: "심사 대기" },
  { key: "approved", label: "게시 중" },
  { key: "all", label: "전체" },
] as const;

export function AdminAdsScreen({ navigation }: Props) {
  const [tab, setTab] = useState<(typeof tabs)[number]["key"]>("pending");
  const [items, setItems] = useState<AdRequest[] | null>(null);
  const [error, setError] = useState(false);
  // Rad etish sababi kiritilayotgan karta (bir vaqtda faqat bittasi ochiq).
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [note, setNote] = useState("");

  const load = useCallback(() => {
    setError(false);
    api
      .get<AdRequest[]>("/ad-requests")
      .then(setItems)
      .catch(() => setError(true));
  }, []);
  useFocusEffect(load);

  const visible = (items ?? []).filter((ad) => tab === "all" || ad.status === tab);

  async function setStatus(ad: AdRequest, status: "approved" | "rejected", adminNote?: string) {
    try {
      await api.patch(`/ad-requests/${ad.id}`, { status, adminNote });
      setRejectingId(null);
      setNote("");
      load();
    } catch (err: any) {
      Alert.alert("처리 실패", err?.message ?? "처리하지 못했습니다");
    }
  }

  function confirmTakeDown(ad: AdRequest) {
    Alert.alert("게시 중단", "이 광고를 배너에서 내릴까요? 기관에는 반려로 표시됩니다.", [
      { text: "취소", style: "cancel" },
      { text: "내리기", style: "destructive", onPress: () => setStatus(ad, "rejected") },
    ]);
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <Pressable accessibilityLabel="뒤로" hitSlop={12} onPress={() => navigation.goBack()}>
          <MaterialIcons name="chevron-left" size={28} color={colors.navy} />
        </Pressable>
        <Text style={styles.headerTitle}>광고 승인 관리</Text>
      </View>

      <View style={styles.tabs}>
        {tabs.map((t) => (
          <Pressable key={t.key} onPress={() => setTab(t.key)} style={[styles.tab, tab === t.key && styles.tabActive]}>
            <Text style={[styles.tabText, tab === t.key && styles.tabTextActive]}>{t.label}</Text>
          </Pressable>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <ListState loading={items === null && !error} error={error} empty={items !== null && visible.length === 0} />
        {visible.map((ad) => {
          const s = adStatusMeta[ad.status];
          const rejecting = rejectingId === ad.id;
          return (
            <View key={ad.id} style={styles.card}>
              <View style={styles.cardTop}>
                <Text style={styles.type} numberOfLines={1}>{ad.orgName} · {formatDate(ad.createdAt)}</Text>
                <View style={[styles.badge, { backgroundColor: s.bg }]}>
                  <Text style={[styles.badgeText, { color: s.fg }]}>{s.label}</Text>
                </View>
              </View>
              <Text style={styles.title}>{ad.title}</Text>
              <Text style={styles.content}>{ad.content}</Text>
              <Text style={styles.meta}>문의 {ad.phone}</Text>
              {ad.homepage ? (
                <Text style={styles.link} onPress={() => Linking.openURL(ad.homepage!)}>{ad.homepage.replace(/^https?:\/\//, "")}</Text>
              ) : null}
              {ad.status === "rejected" && ad.adminNote ? <Text style={styles.note}>반려 사유: {ad.adminNote}</Text> : null}

              {rejecting ? (
                <View style={styles.rejectBox}>
                  <TextInput
                    value={note}
                    onChangeText={setNote}
                    placeholder="반려 사유 (선택, 기관에 표시됩니다)"
                    placeholderTextColor={colors.gray}
                    style={styles.noteInput}
                    multiline
                  />
                  <View style={styles.actions}>
                    <Pressable style={[styles.actionBtn, styles.outlineBtn]} onPress={() => { setRejectingId(null); setNote(""); }}>
                      <Text style={styles.outlineText}>취소</Text>
                    </Pressable>
                    <Pressable style={[styles.actionBtn, styles.dangerBtn]} onPress={() => setStatus(ad, "rejected", note)}>
                      <Text style={styles.whiteText}>반려하기</Text>
                    </Pressable>
                  </View>
                </View>
              ) : ad.status === "pending" ? (
                <View style={styles.actions}>
                  <Pressable style={[styles.actionBtn, styles.rejectBtn]} onPress={() => { setRejectingId(ad.id); setNote(""); }}>
                    <Text style={styles.rejectText}>반려</Text>
                  </Pressable>
                  <Pressable style={[styles.actionBtn, styles.primaryBtn]} onPress={() => setStatus(ad, "approved")}>
                    <Text style={styles.whiteText}>승인</Text>
                  </Pressable>
                </View>
              ) : (
                <View style={styles.actions}>
                  {ad.status === "approved" ? (
                    <Pressable style={[styles.actionBtn, styles.rejectBtn]} onPress={() => confirmTakeDown(ad)}>
                      <Text style={styles.rejectText}>게시 중단</Text>
                    </Pressable>
                  ) : (
                    <Pressable style={[styles.actionBtn, styles.primaryBtn]} onPress={() => setStatus(ad, "approved")}>
                      <Text style={styles.whiteText}>다시 승인</Text>
                    </Pressable>
                  )}
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
      <BottomNav active="MyPage" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f6f8fb" },
  header: { height: 52, flexDirection: "row", alignItems: "center", paddingHorizontal: 14, backgroundColor: colors.white },
  headerTitle: { flex: 1, marginLeft: 7, fontSize: 20, fontWeight: "800", color: colors.navy },
  tabs: { flexDirection: "row", gap: 7, paddingHorizontal: 16, paddingBottom: 12, backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: "#edf0f4" },
  tab: { height: 30, paddingHorizontal: 14, borderRadius: 15, alignItems: "center", justifyContent: "center" },
  tabActive: { backgroundColor: "#2368bc" },
  tabText: { fontSize: 14, fontWeight: "700", color: "#8792a4" },
  tabTextActive: { color: colors.white },
  list: { padding: 15, gap: 10 },
  card: { backgroundColor: colors.white, borderRadius: 12, borderWidth: 1, borderColor: "#e7ebf0", padding: 14 },
  cardTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8 },
  type: { flex: 1, fontSize: 13, color: "#6b7688", fontWeight: "700" },
  badge: { borderRadius: 10, paddingHorizontal: 9, paddingVertical: 3 },
  badgeText: { fontSize: 13, fontWeight: "800" },
  title: { marginTop: 8, fontSize: 17, fontWeight: "800", color: colors.navy },
  content: { marginTop: 6, fontSize: 14, color: colors.navy, lineHeight: 20 },
  meta: { marginTop: 8, fontSize: 13, color: "#8390a2" },
  link: { marginTop: 3, fontSize: 13, fontWeight: "700", color: "#2874bd" },
  note: { marginTop: 8, fontSize: 13, color: "#d4483f" },
  rejectBox: { marginTop: 12 },
  noteInput: { minHeight: 70, borderWidth: 1, borderColor: "#dfe5eb", borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 15, color: colors.navy, textAlignVertical: "top" },
  actions: { flexDirection: "row", justifyContent: "flex-end", gap: 8, marginTop: 12 },
  actionBtn: { borderRadius: 999, paddingHorizontal: 18, paddingVertical: 8 },
  primaryBtn: { backgroundColor: colors.brand },
  dangerBtn: { backgroundColor: "#d4483f" },
  whiteText: { color: colors.white, fontSize: 14, fontWeight: "700" },
  rejectBtn: { borderWidth: 1, borderColor: "#e3b5b2" },
  rejectText: { color: "#d4483f", fontSize: 14, fontWeight: "700" },
  outlineBtn: { borderWidth: 1, borderColor: "#d5dbe3" },
  outlineText: { color: "#5d6878", fontSize: 14, fontWeight: "700" },
});
