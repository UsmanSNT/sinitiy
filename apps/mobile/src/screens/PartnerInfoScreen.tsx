import { useState } from "react";
import { ImageSourcePropType, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import type { RootStackParamList } from "../navigation/types";
import { colors } from "../theme";

type Props = NativeStackScreenProps<RootStackParamList, "PartnerInfo">;
type PartnerItem = {
  title: string;
  service: string;
  category: "추천서비스" | "제휴혜택";
  icon: "office-building" | "airplane" | "briefcase" | "heart-circle";
  iconColor: string;
  iconBackground: string;
  recommended?: boolean;
  image: ImageSourcePropType;
};

const filters = ["전체", "추천서비스", "제휴혜택"] as const;
const partnerImage = require("../../assets/thumbnails/family.jpg");
const partners: PartnerItem[] = [
  {
    title: "행복한 요양원",
    service: "요양·돌봄 서비스",
    category: "제휴혜택",
    icon: "office-building",
    iconColor: "#16a36f",
    iconBackground: "#e2f8ef",
    recommended: true,
    image: partnerImage,
  },
  {
    title: "시니어 여행센터",
    service: "여행·레저 맞춤 상품",
    category: "추천서비스",
    icon: "airplane",
    iconColor: "#3977ee",
    iconBackground: "#e9f0ff",
    image: require("../../assets/thumbnails/hiking.jpg"),
  },
  {
    title: "시니어 여행사",
    service: "관광·테마 여행 상품",
    category: "추천서비스",
    icon: "briefcase",
    iconColor: "#17a572",
    iconBackground: "#e3f8ef",
    image: require("../../assets/thumbnails/coffee.jpg"),
  },
  {
    title: "건강검진센터",
    service: "건강·의료 제휴 프로그램",
    category: "제휴혜택",
    icon: "heart-circle",
    iconColor: "#8752cf",
    iconBackground: "#f2eaff",
    image: require("../../assets/thumbnails/benefit-counseling.jpg"),
  },
];

export function PartnerInfoScreen({ navigation }: Props) {
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]>("전체");
  const visiblePartners = partners.filter((item) => activeFilter === "전체" || item.category === activeFilter);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <Pressable accessibilityLabel="뒤로" hitSlop={12} onPress={() => navigation.goBack()}>
          <MaterialIcons name="chevron-left" size={28} color={colors.navy} />
        </Pressable>
        <Text style={styles.headerTitle}>파트너 정보</Text>
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
        {visiblePartners.map((item) => (
          <Pressable
            key={item.title}
            style={({ pressed }) => [styles.row, pressed && styles.pressed]}
            onPress={() => navigation.navigate("PartnerDetail", item)}
          >
            <View style={[styles.iconBox, { backgroundColor: item.iconBackground }]}>
              <MaterialCommunityIcons name={item.icon} size={25} color={item.iconColor} />
            </View>
            <View style={styles.rowCopy}>
              <View style={styles.titleLine}>
                <Text style={styles.rowTitle} numberOfLines={1}>{item.title}</Text>
                {item.recommended ? <Text style={styles.recommended}>추천</Text> : null}
              </View>
              <Text style={styles.rowMeta} numberOfLines={1}>{item.service}</Text>
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
  filterActive: { backgroundColor: "#225fb1" },
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
  titleLine: { flexDirection: "row", alignItems: "center", gap: 7 },
  rowTitle: { maxWidth: "75%", fontSize: 13, fontWeight: "800", color: colors.navy },
  recommended: { overflow: "hidden", borderRadius: 8, backgroundColor: "#dff7ea", paddingHorizontal: 6, paddingVertical: 2, fontSize: 8, fontWeight: "800", color: "#169264" },
  rowMeta: { marginTop: 7, fontSize: 10, color: "#8390a2" },
});
