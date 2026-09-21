import { useCallback, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import type { Listing } from "@sinity/shared";
import type { RootStackParamList } from "../navigation/types";
import { api } from "../lib/api";
import { listingTypeLabel, statusColor, statusLabel } from "../lib/listingMeta";
import { ListState } from "../components/ListState";
import { colors } from "../theme";

type Props = NativeStackScreenProps<RootStackParamList, "MyListings">;

export function MyListingsScreen({ navigation }: Props) {
  const [items, setItems] = useState<Listing[] | null>(null);
  const [error, setError] = useState(false);

  const load = useCallback(() => {
    setError(false);
    api.get<Listing[]>("/listings/mine").then(setItems).catch(() => setError(true));
  }, []);
  useFocusEffect(load);

  function confirmDelete(item: Listing) {
    Alert.alert("공고 삭제", `"${item.title}" 공고를 삭제할까요?`, [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        style: "destructive",
        onPress: async () => {
          try {
            await api.delete(`/listings/${item.id}`);
            load();
          } catch (err: any) {
            Alert.alert("삭제 실패", err?.message ?? "삭제하지 못했습니다");
          }
        },
      },
    ]);
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <Pressable accessibilityLabel="뒤로" hitSlop={12} onPress={() => navigation.goBack()}>
          <MaterialIcons name="chevron-left" size={28} color={colors.navy} />
        </Pressable>
        <Text style={styles.headerTitle}>내 공고 관리</Text>
        <Pressable accessibilityLabel="새 공고" hitSlop={12} onPress={() => navigation.navigate("ListingForm")}>
          <MaterialIcons name="add" size={26} color={colors.navy} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        <ListState loading={items === null && !error} error={error} empty={items !== null && items.length === 0} />
        {(items ?? []).map((item) => {
          const c = statusColor[item.status];
          return (
            <View key={item.id} style={styles.card}>
              <View style={styles.cardTop}>
                <Text style={styles.type}>{listingTypeLabel[item.listingType]}{item.category ? ` · ${item.category}` : ""}</Text>
                <View style={[styles.badge, { backgroundColor: c.bg }]}>
                  <Text style={[styles.badgeText, { color: c.fg }]}>{statusLabel[item.status]}</Text>
                </View>
              </View>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.meta}>{item.period ?? "기간 미정"}</Text>
              {item.status === "rejected" && <Text style={styles.rejected}>관리자가 반려한 공고입니다. 내용을 확인해 다시 등록해주세요.</Text>}
              <Pressable onPress={() => confirmDelete(item)} hitSlop={8} style={styles.deleteBtn}>
                <Text style={styles.deleteText}>삭제</Text>
              </Pressable>
            </View>
          );
        })}
      </ScrollView>

      <View style={styles.footer}>
        <Pressable style={styles.addButton} onPress={() => navigation.navigate("ListingForm")}>
          <Text style={styles.addButtonText}>새 공고 등록</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f6f8fb" },
  header: { height: 52, flexDirection: "row", alignItems: "center", paddingHorizontal: 14, backgroundColor: colors.white },
  headerTitle: { flex: 1, marginLeft: 7, fontSize: 18, fontWeight: "800", color: colors.navy },
  list: { padding: 15, gap: 10 },
  card: { backgroundColor: colors.white, borderRadius: 12, borderWidth: 1, borderColor: "#e7ebf0", padding: 14 },
  cardTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  type: { fontSize: 11, color: "#6b7688", fontWeight: "700" },
  badge: { borderRadius: 10, paddingHorizontal: 9, paddingVertical: 3 },
  badgeText: { fontSize: 11, fontWeight: "800" },
  title: { marginTop: 8, fontSize: 15, fontWeight: "800", color: colors.navy },
  meta: { marginTop: 4, fontSize: 11, color: "#8390a2" },
  rejected: { marginTop: 8, fontSize: 11, color: "#d4483f" },
  deleteBtn: { alignSelf: "flex-end", marginTop: 6 },
  deleteText: { fontSize: 12, color: "#8390a2", textDecorationLine: "underline" },
  footer: { padding: 15, backgroundColor: colors.white, borderTopWidth: 1, borderTopColor: "#edf0f4" },
  addButton: { backgroundColor: colors.brand, borderRadius: 999, paddingVertical: 14, alignItems: "center" },
  addButtonText: { color: colors.white, fontSize: 15, fontWeight: "700" },
});
