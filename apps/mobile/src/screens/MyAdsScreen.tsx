import { useCallback, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Alert } from "../lib/alert";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppHeader } from "../components/AppHeader";
import type { AdRequest } from "@sinity/shared";
import type { RootStackParamList } from "../navigation/types";
import { api } from "../lib/api";
import { adStatusMeta } from "../lib/adMeta";
import { formatDate } from "../lib/format";
import { ListState } from "../components/ListState";
import { BottomNav } from "../components/BottomNav";
import { colors } from "../theme";

type Props = NativeStackScreenProps<RootStackParamList, "MyAds">;

export function MyAdsScreen({ navigation }: Props) {
  const [items, setItems] = useState<AdRequest[] | null>(null);
  const [error, setError] = useState(false);

  const load = useCallback(() => {
    setError(false);
    api
      .get<AdRequest[]>("/ad-requests/mine")
      .then(setItems)
      .catch(() => setError(true));
  }, []);
  useFocusEffect(load);

  function confirmDelete(ad: AdRequest) {
    const message = ad.status === "approved" ? "게시 중인 광고가 내려갑니다. 삭제할까요?" : "이 광고 신청을 삭제할까요?";
    Alert.alert("광고 삭제", message, [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        style: "destructive",
        onPress: async () => {
          try {
            await api.delete(`/ad-requests/${ad.id}`);
            load();
          } catch (err: any) {
            Alert.alert("삭제 실패", err?.message ?? "삭제하지 못했습니다");
          }
        },
      },
    ]);
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={[]}>
      <AppHeader />
      <View style={styles.header}>
        <Pressable accessibilityLabel="뒤로" hitSlop={12} onPress={() => navigation.goBack()}>
          <MaterialIcons name="chevron-left" size={28} color={colors.navy} />
        </Pressable>
        <Text style={styles.headerTitle}>광고 신청 관리</Text>
      </View>

      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        <Text style={styles.intro}>승인된 광고는 '파트너 정보' 화면 상단 배너로 노출됩니다.</Text>
        <ListState loading={items === null && !error} error={error} empty={false} />
        {items !== null && items.length === 0 && <Text style={styles.empty}>아직 신청한 광고가 없습니다.</Text>}
        {(items ?? []).map((ad) => {
          const s = adStatusMeta[ad.status];
          return (
            <View key={ad.id} style={styles.card}>
              <View style={styles.cardTop}>
                <Text style={styles.date}>신청일 {formatDate(ad.createdAt)}</Text>
                <View style={[styles.badge, { backgroundColor: s.bg }]}>
                  <Text style={[styles.badgeText, { color: s.fg }]}>{s.label}</Text>
                </View>
              </View>
              <Text style={styles.title}>{ad.title}</Text>
              <Text style={styles.content} numberOfLines={2}>{ad.content}</Text>
              {ad.status === "rejected" && (
                <Text style={styles.rejected}>{ad.adminNote ? `반려 사유: ${ad.adminNote}` : "관리자가 반려한 광고입니다. 내용을 확인해 다시 신청해주세요."}</Text>
              )}
              <Pressable onPress={() => confirmDelete(ad)} hitSlop={8} style={styles.deleteBtn}>
                <Text style={styles.deleteText}>삭제</Text>
              </Pressable>
            </View>
          );
        })}
      </ScrollView>

      <View style={styles.footer}>
        <Pressable style={styles.addButton} onPress={() => navigation.navigate("AdForm")}>
          <Text style={styles.addButtonText}>새 광고 신청</Text>
        </Pressable>
      </View>
      <BottomNav active="MyPage" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f6f8fb" },
  header: { height: 52, flexDirection: "row", alignItems: "center", paddingHorizontal: 14, backgroundColor: colors.white },
  headerTitle: { flex: 1, marginLeft: 7, fontSize: 20, fontWeight: "800", color: colors.navy },
  list: { padding: 15, gap: 10 },
  intro: { fontSize: 13, color: "#6b7688", lineHeight: 19 },
  empty: { marginTop: 30, textAlign: "center", fontSize: 15, color: "#8390a2" },
  card: { backgroundColor: colors.white, borderRadius: 12, borderWidth: 1, borderColor: "#e7ebf0", padding: 14 },
  cardTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  date: { fontSize: 13, color: "#6b7688", fontWeight: "700" },
  badge: { borderRadius: 10, paddingHorizontal: 9, paddingVertical: 3 },
  badgeText: { fontSize: 13, fontWeight: "800" },
  title: { marginTop: 8, fontSize: 17, fontWeight: "800", color: colors.navy },
  content: { marginTop: 5, fontSize: 14, color: "#4d5a6c", lineHeight: 20 },
  rejected: { marginTop: 8, fontSize: 13, color: "#d4483f" },
  deleteBtn: { alignSelf: "flex-end", marginTop: 6 },
  deleteText: { fontSize: 14, color: "#8390a2", textDecorationLine: "underline" },
  footer: { padding: 15, backgroundColor: colors.white, borderTopWidth: 1, borderTopColor: "#edf0f4" },
  addButton: { backgroundColor: colors.brand, borderRadius: 999, paddingVertical: 14, alignItems: "center" },
  addButtonText: { color: colors.white, fontSize: 17, fontWeight: "700" },
});
