import { useState } from "react";
import { ImageSourcePropType, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import type { RootStackParamList } from "../navigation/types";
import { colors } from "../theme";
import { usePartners } from "../lib/usePartners";
import { fallbackImage } from "../lib/listingImage";
import { matchesRegionFilter } from "../lib/regionMatch";
import { ListState } from "../components/ListState";
import { BottomNav } from "../components/BottomNav";
import { RegionPicker } from "../components/RegionPicker";
import { OptionSheet } from "../components/OptionSheet";

type Props = NativeStackScreenProps<RootStackParamList, "PartnerInfo">;
type IconName = React.ComponentProps<typeof MaterialCommunityIcons>["name"];
type PartnerItem = {
  title: string;
  service: string;
  category: string;
  recommended: boolean;
  icon: IconName;
  iconColor: string;
  iconBackground: string;
  image: ImageSourcePropType;
  location: string | null;
  address: string;
  phone: string;
  homepage: string | null;
  description: string | null;
};

const filters = ["전체", "추천서비스", "제휴혜택"] as const;

const categoryStyle: Record<string, Pick<PartnerItem, "icon" | "iconColor" | "iconBackground">> = {
  "제휴혜택": { icon: "handshake", iconColor: "#16a36f", iconBackground: "#e2f8ef" },
  "추천서비스": { icon: "star-circle", iconColor: "#3977ee", iconBackground: "#e9f0ff" },
};

export function PartnerInfoScreen({ navigation }: Props) {
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]>("전체");
  const [regionFilter, setRegionFilter] = useState<string | null>(null);
  const [regionOpen, setRegionOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const { items, loading, error } = usePartners();
  const partners: PartnerItem[] = items.map((p, i) => ({
    title: p.name,
    service: p.service ?? "",
    category: p.category ?? "",
    recommended: p.recommended,
    ...(categoryStyle[p.category ?? ""] ?? categoryStyle["추천서비스"]),
    image: fallbackImage(i),
    location: p.location,
    address: p.address,
    phone: p.phone,
    homepage: p.homepage,
    description: p.description,
  }));
  const visiblePartners = partners.filter(
    (item) =>
      (activeFilter === "전체" || item.category === activeFilter) &&
      matchesRegionFilter(regionFilter, item.location)
  );

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
        <ListState loading={loading} error={error} empty={!loading && !error && visiblePartners.length === 0} />
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
  header: { height: 52, flexDirection: "row", alignItems: "center", paddingHorizontal: 14 },
  headerTitle: { flex: 1, marginLeft: 7, fontSize: 20, fontWeight: "800", color: colors.navy },
  filters: { flexDirection: "row", gap: 7, paddingHorizontal: 16, paddingBottom: 13, borderBottomWidth: 1, borderBottomColor: "#edf0f4" },
  filter: { minWidth: 49, height: 30, paddingHorizontal: 13, alignItems: "center", justifyContent: "center", borderRadius: 15 },
  filterActive: { backgroundColor: "#225fb1" },
  filterText: { fontSize: 13, fontWeight: "700", color: "#8792a4" },
  filterTextActive: { color: colors.white },
  selectors: { flexDirection: "row", gap: 10, padding: 14 },
  selector: { flex: 1, minHeight: 55, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 12, borderWidth: 1, borderColor: "#dfe5eb", borderRadius: 7 },
  selectorLabel: { fontSize: 11, color: "#95a0af" },
  selectorValue: { marginTop: 4, fontSize: 15, fontWeight: "700", color: colors.navy },
  list: { paddingHorizontal: 15, paddingBottom: 22 },
  row: { minHeight: 76, flexDirection: "row", alignItems: "center", borderBottomWidth: 1, borderBottomColor: "#edf0f4", paddingVertical: 10 },
  pressed: { opacity: 0.7 },
  iconBox: { width: 50, height: 50, borderRadius: 13, alignItems: "center", justifyContent: "center" },
  rowCopy: { flex: 1, minWidth: 0, paddingHorizontal: 12 },
  titleLine: { flexDirection: "row", alignItems: "center", gap: 7 },
  rowTitle: { maxWidth: "75%", fontSize: 17, fontWeight: "800", color: colors.navy },
  recommended: { overflow: "hidden", borderRadius: 8, backgroundColor: "#dff7ea", paddingHorizontal: 7, paddingVertical: 2, fontSize: 11, fontWeight: "800", color: "#169264" },
  rowMeta: { marginTop: 7, fontSize: 13, color: "#8390a2" },
});
