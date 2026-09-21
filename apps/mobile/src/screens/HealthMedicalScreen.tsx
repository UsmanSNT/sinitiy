import { useState } from "react";
import { ImageSourcePropType, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { FontAwesome5, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import type { RootStackParamList } from "../navigation/types";
import { colors } from "../theme";

type Props = NativeStackScreenProps<RootStackParamList, "HealthMedical">;
type HealthItem = {
  title: string;
  organization: string;
  period: string;
  category: string;
  icon: "hospital-building" | "needle" | "chat-processing" | "map-marker-radius";
  iconColor: string;
  iconBackground: string;
  image: ImageSourcePropType;
};

const filters = ["전체", "병원", "건강정보", "예방·검진"] as const;
const healthImage = require("../../assets/thumbnails/digital-care.jpg");

const healthItems: HealthItem[] = [
  {
    title: "강남시니어 건강검진센터",
    organization: "강남구보건소",
    period: "무료 건강검진 안내",
    category: "건강검진",
    icon: "hospital-building",
    iconColor: "#2f72dc",
    iconBackground: "#e8f1ff",
    image: healthImage,
  },
  {
    title: "독감 예방접종 지원사업",
    organization: "서울시",
    period: "2025.09 - 10",
    category: "예방접종",
    icon: "needle",
    iconColor: "#e74f87",
    iconBackground: "#ffeaf2",
    image: healthImage,
  },
  {
    title: "치매 예방 프로그램",
    organization: "보건소",
    period: "상시 모집",
    category: "건강정보",
    icon: "chat-processing",
    iconColor: "#1ebc91",
    iconBackground: "#e5faf4",
    image: healthImage,
  },
  {
    title: "가까운 병원 찾기",
    organization: "지도에서",
    period: "병원 위치를 확인하세요",
    category: "병원",
    icon: "map-marker-radius",
    iconColor: "#3977ee",
    iconBackground: "#e9f0ff",
    image: healthImage,
  },
];

export function HealthMedicalScreen({ navigation }: Props) {
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]>("전체");
  const visibleItems = healthItems.filter(
    (item) => activeFilter === "전체" || item.category === activeFilter || (activeFilter === "예방·검진" && ["건강검진", "예방접종"].includes(item.category)),
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <Pressable accessibilityLabel="뒤로" hitSlop={12} onPress={() => navigation.goBack()}>
          <MaterialIcons name="chevron-left" size={28} color={colors.navy} />
        </Pressable>
        <Text style={styles.headerTitle}>건강 · 의료</Text>
        <Pressable accessibilityLabel="검색" hitSlop={12}>
          <MaterialIcons name="search" size={23} color={colors.navy} />
        </Pressable>
      </View>

      <View style={styles.filters}>
        {filters.map((filter) => (
          <Pressable key={filter} onPress={() => setActiveFilter(filter)} style={[styles.filter, activeFilter === filter && styles.filterActive]}>
            <Text style={[styles.filterText, activeFilter === filter && styles.filterTextActive]}>{filter}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.selectors}>
        <Pressable style={styles.selector}>
          <View><Text style={styles.selectorLabel}>지역 선택</Text><Text style={styles.selectorValue}>전체지역</Text></View>
          <MaterialIcons name="keyboard-arrow-down" size={20} color="#66758a" />
        </Pressable>
        <Pressable style={styles.selector}>
          <View><Text style={styles.selectorLabel}>카테고리</Text><Text style={styles.selectorValue}>전체</Text></View>
          <MaterialIcons name="keyboard-arrow-down" size={20} color="#66758a" />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {visibleItems.map((item) => (
          <Pressable
            key={item.title}
            style={({ pressed }) => [styles.row, pressed && styles.pressed]}
            onPress={() => navigation.navigate("HealthDetail", item)}
          >
            <View style={[styles.iconBox, { backgroundColor: item.iconBackground }]}>
              {item.icon === "hospital-building" ? (
                <FontAwesome5 name="hospital" size={22} color={item.iconColor} />
              ) : (
                <MaterialCommunityIcons name={item.icon} size={25} color={item.iconColor} />
              )}
            </View>
            <View style={styles.rowCopy}>
              <Text style={styles.rowTitle} numberOfLines={1}>{item.title}</Text>
              <Text style={styles.rowMeta} numberOfLines={1}>{item.organization} · {item.period}</Text>
            </View>
            <MaterialIcons name="chevron-right" size={22} color="#a4adba" />
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.white },
  header: { height: 52, flexDirection: "row", alignItems: "center", paddingHorizontal: 14 },
  headerTitle: { flex: 1, marginLeft: 7, fontSize: 18, fontWeight: "800", color: colors.navy },
  filters: { flexDirection: "row", gap: 7, paddingHorizontal: 16, paddingBottom: 13, borderBottomWidth: 1, borderBottomColor: "#edf0f4" },
  filter: { minWidth: 49, height: 30, paddingHorizontal: 13, alignItems: "center", justifyContent: "center", borderRadius: 15 },
  filterActive: { backgroundColor: "#2368bc" },
  filterText: { fontSize: 11, fontWeight: "700", color: "#8792a4" },
  filterTextActive: { color: colors.white },
  selectors: { flexDirection: "row", gap: 10, padding: 14 },
  selector: { flex: 1, minHeight: 55, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 12, borderWidth: 1, borderColor: "#dfe5eb", borderRadius: 7 },
  selectorLabel: { fontSize: 9, color: "#95a0af" },
  selectorValue: { marginTop: 4, fontSize: 12, fontWeight: "700", color: colors.navy },
  list: { paddingHorizontal: 15, paddingBottom: 22 },
  row: { minHeight: 76, flexDirection: "row", alignItems: "center", borderBottomWidth: 1, borderBottomColor: "#edf0f4", paddingVertical: 10 },
  pressed: { opacity: 0.7 },
  iconBox: { width: 50, height: 50, borderRadius: 13, alignItems: "center", justifyContent: "center" },
  rowCopy: { flex: 1, minWidth: 0, paddingHorizontal: 12 },
  rowTitle: { fontSize: 13, fontWeight: "800", color: colors.navy },
  rowMeta: { marginTop: 7, fontSize: 10, color: "#8390a2" },
});
