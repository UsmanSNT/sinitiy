import { useState } from "react";
import { ImageSourcePropType, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import type { RootStackParamList } from "../navigation/types";
import { colors } from "../theme";

type Props = NativeStackScreenProps<RootStackParamList, "LifeConvenience">;
type LifeCategory = "교통" | "주거" | "생활지원";
type LifeItem = {
  title: string;
  organization: string;
  period: string;
  category: LifeCategory;
  icon: "bus" | "taxi" | "home-city" | "hammer-wrench" | "food-variant" | "hand-heart";
  iconColor: string;
  iconBackground: string;
  image: ImageSourcePropType;
};

const filters = ["전체", "교통", "주거", "생활지원"] as const;
const lifeImage = require("../../assets/thumbnails/digital-care.jpg");

const lifeItems: LifeItem[] = [
  {
    title: "시니어 교통카드 지원",
    organization: "서울시",
    period: "상시 신청",
    category: "교통",
    icon: "bus",
    iconColor: "#2f72dc",
    iconBackground: "#e8f1ff",
    image: lifeImage,
  },
  {
    title: "어르신 콜택시 이용 안내",
    organization: "강남구",
    period: "2025.09 - 12",
    category: "교통",
    icon: "taxi",
    iconColor: "#e08a2b",
    iconBackground: "#fff4e6",
    image: require("../../assets/thumbnails/hiking.jpg"),
  },
  {
    title: "주택 수리 지원사업",
    organization: "국토교통부",
    period: "2025.05 - 08",
    category: "주거",
    icon: "hammer-wrench",
    iconColor: "#e2536b",
    iconBackground: "#ffeaf0",
    image: require("../../assets/thumbnails/family.jpg"),
  },
  {
    title: "공공임대주택 입주 안내",
    organization: "LH",
    period: "상시 모집",
    category: "주거",
    icon: "home-city",
    iconColor: "#3977ee",
    iconBackground: "#e9f0ff",
    image: require("../../assets/thumbnails/benefit-counseling.jpg"),
  },
  {
    title: "도시락 배달 서비스",
    organization: "강남시니어복지관",
    period: "주 5회 지원",
    category: "생활지원",
    icon: "food-variant",
    iconColor: "#1ebc91",
    iconBackground: "#e5faf4",
    image: require("../../assets/thumbnails/board-game.jpg"),
  },
  {
    title: "가사·간병 방문 지원",
    organization: "보건복지부",
    period: "상시 신청",
    category: "생활지원",
    icon: "hand-heart",
    iconColor: "#8752cf",
    iconBackground: "#f2eaff",
    image: require("../../assets/thumbnails/job-counseling.jpg"),
  },
];

export function LifeConvenienceScreen({ navigation }: Props) {
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]>("전체");
  const visibleItems = lifeItems.filter((item) => activeFilter === "전체" || item.category === activeFilter);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <Pressable accessibilityLabel="뒤로" hitSlop={12} onPress={() => navigation.goBack()}>
          <MaterialIcons name="chevron-left" size={28} color={colors.navy} />
        </Pressable>
        <Text style={styles.headerTitle}>생활편의</Text>
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
            onPress={() => navigation.navigate("LifeConvenienceDetail", item)}
          >
            <View style={[styles.iconBox, { backgroundColor: item.iconBackground }]}>
              <MaterialCommunityIcons name={item.icon} size={25} color={item.iconColor} />
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
