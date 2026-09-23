import { useState } from "react";
import { Image, ImageSourcePropType, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import type { RootStackParamList } from "../navigation/types";
import { colors } from "../theme";
import { useListings } from "../lib/useListings";
import { listingImage } from "../lib/listingImage";
import { matchesRegionFilter } from "../lib/regionMatch";
import { ListState } from "../components/ListState";
import { BottomNav } from "../components/BottomNav";
import { comingSoon } from "../lib/actions";
import { RegionPicker } from "../components/RegionPicker";
import { OptionSheet } from "../components/OptionSheet";

type Props = NativeStackScreenProps<RootStackParamList, "JobWelfare">;
type JobItem = {
  title: string;
  organization: string;
  period: string;
  category: string;
  region: string | null;
  image: ImageSourcePropType;
  content?: string;
  phone?: string;
  targetAudience?: string;
  applyMethod?: string;
};

const filters = ["전체", "일자리", "복지정책", "지원금"] as const;

export function JobWelfareScreen({ navigation }: Props) {
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]>("전체");
  const [regionFilter, setRegionFilter] = useState<string | null>(null);
  const [regionOpen, setRegionOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const { items, loading, error } = useListings("job");
  const jobItems: JobItem[] = items.map((l, i) => ({
    title: l.title,
    organization: l.orgName,
    period: l.period ?? "",
    category: l.category ?? "",
    region: l.region,
    image: listingImage(l, i),
    content: l.content,
    phone: l.phone,
    targetAudience: l.targetAudience,
    applyMethod: l.applyMethod,
  }));
  const visibleItems = jobItems.filter(
    (item) =>
      (activeFilter === "전체" || item.category === activeFilter) &&
      matchesRegionFilter(regionFilter, item.region)
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <Pressable accessibilityLabel="뒤로" hitSlop={12} onPress={() => navigation.goBack()}>
          <MaterialIcons name="chevron-left" size={26} color={colors.navy} />
        </Pressable>
        <Text style={styles.title}>일자리 · 복지</Text>
        <Pressable accessibilityLabel="검색" hitSlop={12} onPress={comingSoon}><MaterialIcons name="search" size={22} color={colors.navy} /></Pressable>
      </View>
      <View style={styles.filters}>
        {filters.map((filter) => (
          <Pressable key={filter} onPress={() => setActiveFilter(filter)} style={[styles.filter, activeFilter === filter && styles.filterActive]}>
            <Text style={[styles.filterText, activeFilter === filter && styles.filterTextActive]}>{filter}</Text>
          </Pressable>
        ))}
      </View>
      <View style={styles.selectors}>
        <Pressable style={styles.selector} onPress={() => setRegionOpen(true)}>
          <View>
            <Text style={styles.selectorLabel}>지역 선택</Text>
            <Text style={styles.selectorValue} numberOfLines={1}>
              {regionFilter ? regionFilter.split(" ").pop() : "전체지역"}
            </Text>
          </View>
          <MaterialIcons name="keyboard-arrow-down" size={20} color="#66758a" />
        </Pressable>
        <Pressable style={styles.selector} onPress={() => setCategoryOpen(true)}>
          <View><Text style={styles.selectorLabel}>카테고리</Text><Text style={styles.selectorValue}>{activeFilter}</Text></View>
          <MaterialIcons name="keyboard-arrow-down" size={20} color="#66758a" />
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        <ListState loading={loading} error={error} empty={!loading && !error && visibleItems.length === 0} />
        {visibleItems.map((item) => (
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
      <BottomNav active="Services" />

      <RegionPicker visible={regionOpen} value={regionFilter} onSelect={setRegionFilter} onClose={() => setRegionOpen(false)} />
      <OptionSheet
        visible={categoryOpen}
        title="카테고리"
        options={[...filters]}
        selected={activeFilter}
        onSelect={(v) => setActiveFilter(v as (typeof filters)[number])}
        onClose={() => setCategoryOpen(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.white },
  header: { height: 52, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 14 },
  title: { flex: 1, marginLeft: 7, fontSize: 20, fontWeight: "800", color: colors.navy },
  filters: { flexDirection: "row", gap: 7, paddingHorizontal: 16, paddingBottom: 13, borderBottomWidth: 1, borderBottomColor: "#edf0f4" },
  filter: { minWidth: 49, height: 30, paddingHorizontal: 13, alignItems: "center", justifyContent: "center", borderRadius: 15 },
  filterActive: { backgroundColor: "#2368bc" },
  filterText: { fontSize: 13, fontWeight: "700", color: "#8792a4" },
  filterTextActive: { color: colors.white },
  selectors: { flexDirection: "row", gap: 10, padding: 14 },
  selector: { flex: 1, minHeight: 55, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 12, borderWidth: 1, borderColor: "#dfe5eb", borderRadius: 7 },
  selectorLabel: { fontSize: 11, color: "#95a0af" },
  selectorValue: { marginTop: 4, fontSize: 15, fontWeight: "700", color: colors.navy },
  list: { paddingHorizontal: 15, paddingBottom: 22 },
  row: { minHeight: 76, flexDirection: "row", alignItems: "center", borderBottomWidth: 1, borderBottomColor: "#edf0f4", paddingVertical: 10 },
  pressed: { opacity: 0.7 },
  thumbnail: { width: 58, height: 54, borderRadius: 6, backgroundColor: "#eef1f5" },
  rowCopy: { flex: 1, minWidth: 0, paddingHorizontal: 12 },
  rowTitle: { fontSize: 17, fontWeight: "800", color: colors.navy },
  rowMeta: { marginTop: 7, fontSize: 13, color: "#8390a2" },
});
