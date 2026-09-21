import { useState } from "react";
import { Pressable, StyleSheet, Switch, Text, View } from "react-native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import type { RootStackParamList } from "../navigation/types";
import { colors } from "../theme";

type Props = NativeStackScreenProps<RootStackParamList, "NotificationSettings">;
const options = [
  { key: "notice", icon: "message-alert", title: "공지사항", subtitle: "중요 공지사항 소식" },
  { key: "newPost", icon: "bell-outline", title: "새 게시글", subtitle: "내 관심 지역·주제의 새 글" },
  { key: "comment", icon: "message-outline", title: "댓글 알림", subtitle: "내 게시글의 댓글 알림" },
  { key: "like", icon: "heart-outline", title: "좋아요 알림", subtitle: "내 게시글의 좋아요 알림" },
  { key: "event", icon: "calendar", title: "행사·모집 알림", subtitle: "교육·문화·행사 모집 소식" },
  { key: "partner", icon: "sale", title: "파트너 추천 알림", subtitle: "추천 서비스·제휴 혜택 정보" },
] as const;

export function NotificationSettingsScreen({ navigation }: Props) {
  const [values, setValues] = useState<Record<string, boolean>>(() => Object.fromEntries(options.map((item) => [item.key, true])));
  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.header}><Pressable accessibilityLabel="뒤로" hitSlop={12} onPress={() => navigation.goBack()}><MaterialIcons name="chevron-left" size={28} color={colors.navy} /></Pressable><Text style={styles.headerTitle}>알림 설정</Text><View style={styles.spacer} /></View>
      <Text style={styles.guide}>원하는 알림을 선택해주세요.</Text>
      <View style={styles.list}>{options.map((item) => (
        <View key={item.key} style={styles.row}><MaterialCommunityIcons name={item.icon} size={20} color="#657b9d" /><View style={styles.copy}><Text style={styles.title}>{item.title}</Text><Text style={styles.subtitle}>{item.subtitle}</Text></View><Switch value={values[item.key]} onValueChange={(value) => setValues((current) => ({ ...current, [item.key]: value }))} trackColor={{ false: "#d8dee7", true: "#2d79dc" }} thumbColor={colors.white} /></View>
      ))}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.white }, header: { height: 52, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 14 },
  headerTitle: { fontSize: 17, fontWeight: "800", color: colors.navy }, spacer: { width: 28 }, guide: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 13, fontSize: 12, color: "#8995a5" },
  list: { paddingHorizontal: 18 }, row: { minHeight: 66, flexDirection: "row", alignItems: "center", borderBottomWidth: 1, borderBottomColor: "#edf0f4" },
  copy: { flex: 1, paddingHorizontal: 12 }, title: { fontSize: 13, fontWeight: "800", color: colors.navy }, subtitle: { marginTop: 4, fontSize: 10, color: "#8995a5" },
});
