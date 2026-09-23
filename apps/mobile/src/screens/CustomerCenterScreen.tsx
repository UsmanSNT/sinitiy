import { Linking, Pressable, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import type { RootStackParamList } from "../navigation/types";
import { colors } from "../theme";
import { BottomNav } from "../components/BottomNav";
import { comingSoon } from "../lib/actions";

type Props = NativeStackScreenProps<RootStackParamList, "CustomerCenter">;
const PHONE = "02-1234-5678";
const rows: Array<{ icon: "frequently-asked-questions" | "message-outline" | "phone-outline" | "information-outline" | "shield-lock-outline" | "file-document-outline"; title: string; subtitle: string; phone?: boolean }> = [
  { icon: "frequently-asked-questions", title: "자주 묻는 질문", subtitle: "궁금한 점을 확인해 보세요" },
  { icon: "message-outline", title: "1:1 문의", subtitle: "문의 내용을 남겨주세요" },
  { icon: "phone-outline", title: "전화 문의", subtitle: `${PHONE}\n평일 09:00 - 18:00`, phone: true },
  { icon: "information-outline", title: "앱 이용 가이드", subtitle: "시니티 이용 방법 안내" },
  { icon: "shield-lock-outline", title: "개인정보 처리방침", subtitle: "" },
  { icon: "file-document-outline", title: "이용약관", subtitle: "" },
];

export function CustomerCenterScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.header}><Pressable accessibilityLabel="뒤로" hitSlop={12} onPress={() => navigation.goBack()}><MaterialIcons name="chevron-left" size={28} color={colors.navy} /></Pressable><Text style={styles.headerTitle}>고객센터</Text><View style={styles.spacer} /></View>
      <View style={styles.body}>
        <View style={styles.card}>{rows.map((item, index) => (
          <Pressable key={item.title} onPress={() => (item.phone ? Linking.openURL(`tel:${PHONE}`) : comingSoon())} style={[styles.row, index < rows.length - 1 && styles.divider]}>
            <View style={styles.iconBox}><MaterialCommunityIcons name={item.icon} size={21} color="#5b73a0" /></View>
            <View style={styles.copy}><Text style={styles.title}>{item.title}</Text>{item.subtitle ? <Text style={styles.subtitle}>{item.subtitle}</Text> : null}</View><MaterialIcons name="chevron-right" size={22} color="#a4adba" />
          </Pressable>
        ))}</View>
      </View>
      <BottomNav active="MyPage" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f7f9fb" }, header: { height: 52, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 14, backgroundColor: colors.white },
  headerTitle: { fontSize: 20, fontWeight: "800", color: colors.navy }, spacer: { width: 28 }, body: { flex: 1 }, card: { margin: 15, overflow: "hidden", borderRadius: 10, borderWidth: 1, borderColor: "#e6eaf0", backgroundColor: colors.white },
  row: { minHeight: 68, flexDirection: "row", alignItems: "center", paddingHorizontal: 12 }, divider: { borderBottomWidth: 1, borderBottomColor: "#edf0f4" },
  iconBox: { width: 39, height: 39, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: "#eef3fb" },
  copy: { flex: 1, paddingHorizontal: 11 }, title: { fontSize: 17, fontWeight: "800", color: colors.navy }, subtitle: { marginTop: 3, fontSize: 13, lineHeight: 17, color: "#8995a5" },
});
