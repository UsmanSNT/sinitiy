import { useCallback, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import type { PartnerCompany } from "@sinity/shared";
import { AppHeader } from "../components/AppHeader";
import { BottomNav } from "../components/BottomNav";
import { ListState } from "../components/ListState";
import { Alert } from "../lib/alert";
import { api } from "../lib/api";
import { windowState, windowText } from "../lib/publishWindow";
import type { RootStackParamList } from "../navigation/types";
import { colors } from "../theme";

type Props = NativeStackScreenProps<RootStackParamList, "AdminPartners">;

export function AdminPartnersScreen({ navigation }: Props) {
  const [items, setItems] = useState<PartnerCompany[] | null>(null);
  const [error, setError] = useState(false);

  const load = useCallback(() => {
    setError(false);
    api.get<PartnerCompany[]>("/partners/admin/all").then(setItems).catch(() => setError(true));
  }, []);
  useFocusEffect(load);

  function confirmDelete(item: PartnerCompany) {
    Alert.alert("파트너 삭제", `"${item.name}" 파트너를 삭제할까요?`, [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        style: "destructive",
        onPress: async () => {
          try {
            await api.delete(`/partners/${item.id}`);
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
        <Text style={styles.headerTitle}>파트너 관리</Text>
        <Pressable accessibilityLabel="새 파트너" hitSlop={12} onPress={() => navigation.navigate("PartnerForm")}>
          <MaterialIcons name="add" size={26} color={colors.navy} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        <ListState loading={items === null && !error} error={error} empty={items !== null && items.length === 0} />
        {(items ?? []).map((item) => {
          const state = windowState(item.displayStart, item.displayEnd);
          const range = windowText(item.displayStart, item.displayEnd);
          return (
            <View key={item.id} style={styles.card}>
              <View style={styles.cardTop}>
                <Text style={styles.type}>{item.category ?? "파트너"}{item.recommended ? " · 추천" : ""}</Text>
                {state === "expired" || state === "scheduled" ? (
                  <Text style={[styles.badge, state === "expired" ? styles.badgeGray : styles.badgeBlue]}>
                    {state === "expired" ? "기간 만료" : "노출 예정"}
                  </Text>
                ) : (
                  <Text style={[styles.badge, styles.badgeGreen]}>노출 중</Text>
                )}
              </View>
              <Text style={styles.title}>{item.name}</Text>
              <Text style={styles.meta}>{item.service ?? ""}{item.location ? ` · ${item.location}` : ""}</Text>
              <Text style={styles.meta}>{item.phone}</Text>
              {range ? <Text style={styles.meta}>노출 기간 {range}</Text> : null}
              <View style={styles.actions}>
                <Pressable onPress={() => navigation.navigate("PartnerForm", { partner: item })} hitSlop={8}>
                  <Text style={styles.editText}>수정</Text>
                </Pressable>
                <Pressable onPress={() => confirmDelete(item)} hitSlop={8}>
                  <Text style={styles.deleteText}>삭제</Text>
                </Pressable>
              </View>
            </View>
          );
        })}
      </ScrollView>
      <View style={styles.footer}>
        <Pressable style={styles.addButton} onPress={() => navigation.navigate("PartnerForm")}>
          <Text style={styles.addButtonText}>새 파트너 등록</Text>
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
  card: { backgroundColor: colors.white, borderRadius: 12, borderWidth: 1, borderColor: "#e7ebf0", padding: 14 },
  cardTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  type: { fontSize: 13, color: "#6b7688", fontWeight: "700" },
  badge: { fontSize: 12, fontWeight: "800", paddingHorizontal: 10, paddingVertical: 3, borderRadius: 999, overflow: "hidden" },
  badgeGreen: { color: "#1a9a5a", backgroundColor: "#e3f7ec" },
  badgeGray: { color: "#6b7688", backgroundColor: "#eceff3" },
  badgeBlue: { color: "#2368bc", backgroundColor: "#e8f1ff" },
  title: { marginTop: 8, fontSize: 17, fontWeight: "800", color: colors.navy },
  meta: { marginTop: 4, fontSize: 13, color: "#8390a2" },
  actions: { flexDirection: "row", justifyContent: "flex-end", gap: 18, marginTop: 8 },
  editText: { fontSize: 14, color: "#2368bc", fontWeight: "700", textDecorationLine: "underline" },
  deleteText: { fontSize: 14, color: "#8390a2", textDecorationLine: "underline" },
  footer: { padding: 15, backgroundColor: colors.white, borderTopWidth: 1, borderTopColor: "#edf0f4" },
  addButton: { backgroundColor: colors.brand, borderRadius: 999, paddingVertical: 14, alignItems: "center" },
  addButtonText: { color: colors.white, fontSize: 15, fontWeight: "700" },
});
