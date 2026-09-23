import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import type { RootStackParamList } from "../navigation/types";
import { colors } from "../theme";
import { BottomNav } from "../components/BottomNav";

type Props = NativeStackScreenProps<RootStackParamList, "InterestSettings">;
const interests = [
  { label: "일자리", icon: "briefcase" }, { label: "생활 건강", icon: "heart-pulse" }, { label: "병원·건강", icon: "hospital-box" },
  { label: "건강검진", icon: "medical-bag" }, { label: "교육·문화", icon: "school" }, { label: "문화·여가", icon: "palette" },
  { label: "행사", icon: "map-marker" }, { label: "동네모임", icon: "account-group" }, { label: "여행·관광", icon: "map-marker-radius" },
  { label: "파트너 서비스", icon: "office-building" },
] as const;

export function InterestSettingsScreen({ navigation }: Props) {
  const [selected, setSelected] = useState<string[]>(["일자리", "병원·건강", "교육·문화", "문화·여가"]);
  const toggle = (label: string) => setSelected((current) => current.includes(label) ? current.filter((item) => item !== label) : [...current, label]);
  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.header}><Pressable accessibilityLabel="뒤로" hitSlop={12} onPress={() => navigation.goBack()}><MaterialIcons name="chevron-left" size={28} color={colors.navy} /></Pressable><Text style={styles.headerTitle}>관심정보 설정</Text><View style={styles.spacer} /></View>
      <View style={styles.content}><Text style={styles.guide}>관심 있는 분야를 선택해주세요.{"\n"}맞춤 정보를 추천해드립니다.</Text>
        <View style={styles.grid}>{interests.map((item) => { const active = selected.includes(item.label); return (
          <Pressable key={item.label} onPress={() => toggle(item.label)} style={[styles.chip, active && styles.chipActive]}><MaterialCommunityIcons name={item.icon} size={22} color={active ? "#286fd0" : "#8d63ce"} /><Text style={[styles.chipText, active && styles.chipTextActive]}>{item.label}</Text></Pressable>
        ); })}</View>
      </View>
      <Pressable style={styles.saveButton} onPress={() => navigation.goBack()}><Text style={styles.saveText}>저장하기</Text></Pressable>
      <BottomNav active="MyPage" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.white }, header: { height: 52, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 14 },
  headerTitle: { fontSize: 20, fontWeight: "800", color: colors.navy }, spacer: { width: 28 }, content: { flex: 1, paddingHorizontal: 18, justifyContent: "center" },
  guide: { marginBottom: 24, fontSize: 16, lineHeight: 24, color: "#6f7c8e" }, grid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  chip: { width: "48%", minHeight: 56, flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 16, borderWidth: 1, borderColor: "#dfe5eb", borderRadius: 28 },
  chipActive: { borderColor: "#6ca3ec", backgroundColor: "#f7fbff" }, chipText: { flexShrink: 1, fontSize: 16, fontWeight: "700", color: "#6f7b8b" }, chipTextActive: { color: colors.navy },
  saveButton: { margin: 16, alignItems: "center", borderRadius: 8, paddingVertical: 14, backgroundColor: "#2468bd" }, saveText: { fontSize: 16, fontWeight: "800", color: colors.white },
});
