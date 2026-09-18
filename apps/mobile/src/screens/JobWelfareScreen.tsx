import { useState } from "react";
import { Image, ImageSourcePropType, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import type { RootStackParamList } from "../navigation/types";
import { colors } from "../theme";

type Props = NativeStackScreenProps<RootStackParamList, "JobWelfare">;
const filters = ["전체", "일자리", "복지정책", "지원금"] as const;
const opportunities: Array<{ title: string; organization: string; period: string; image: ImageSourcePropType }> = [
  { title: "시니어 인턴십 참여자 모집", organization: "서울시", period: "2025.05.20 - 06.30", image: require("../../assets/thumbnails/benefit-counseling.jpg") },
  { title: "노인일자리 및 사회활동 지원사업", organization: "보건복지부", period: "2025.05.15 - 06.15", image: require("../../assets/thumbnails/job-counseling.jpg") },
  { title: "기초연금 신청 안내", organization: "보건복지부", period: "상시", image: require("../../assets/thumbnails/digital-care.jpg") },
  { title: "경력·노하우 활용 인력 모집", organization: "강남구", period: "2025.05.10 - 05.31", image: require("../../assets/thumbnails/family.jpg") },
];

export function JobWelfareScreen({ navigation }: Props) {
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]>("전체");
  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <Pressable accessibilityLabel="뒤로" hitSlop={12} onPress={() => navigation.goBack()}>
          <MaterialIcons name="chevron-left" size={26} color={colors.navy} />
        </Pressable>
        <Text style={styles.title}>일자리 · 복지</Text>
        <Pressable accessibilityLabel="검색" hitSlop={12}><MaterialIcons name="search" size={22} color={colors.navy} /></Pressable>
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
        {opportunities.map((item) => (
          <Pressable
            key={item.title}
            style={({ pressed }) => [styles.row, pressed && styles.pressed]}
            onPress={() => navigation.navigate("JobDetail", item)}
          >
            <Image source={item.image} style={styles.thumbnail} />
            <View style={styles.rowCopy}>
              <Text style={styles.rowTitle} numberOfLines={1}>{item.title}</Text>
              <Text style={styles.rowMeta} numberOfLines={1}>{item.organization} · {item.period}</Text>
            </View>
            <MaterialIcons name="chevron-right" size={21} color="#a4adba" />
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.white },
  header: { height: 52, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 14 },
  title: { flex: 1, marginLeft: 7, fontSize: 18, fontWeight: "800", color: colors.navy },
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
  thumbnail: { width: 58, height: 54, borderRadius: 6, backgroundColor: "#eef1f5" },
  rowCopy: { flex: 1, minWidth: 0, paddingHorizontal: 12 },
  rowTitle: { fontSize: 13, fontWeight: "800", color: colors.navy },
  rowMeta: { marginTop: 7, fontSize: 10, color: "#8390a2" },
});
