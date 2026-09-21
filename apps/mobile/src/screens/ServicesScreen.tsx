import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { MaterialIcons, MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/types";
import { colors } from "../theme";

const services = [
  {
    icon: <MaterialIcons name="business-center" size={22} color="#ffffff" />,
    bg: "#3fae5c",
    title: "일자리·복지",
    sub: "취업·복지 지원, 노인정책",
  },
  {
    icon: <FontAwesome5 name="heartbeat" size={20} color="#ffffff" />,
    bg: "#3d5ee1",
    title: "건강·의료",
    sub: "병원, 요양, 건강정보",
  },
  {
    icon: <MaterialIcons name="school" size={22} color="#ffffff" />,
    bg: "#8a5cf6",
    title: "교육·문화",
    sub: "평생교육, 문화·여가, 행사",
  },
  {
    icon: <MaterialCommunityIcons name="home-city-outline" size={22} color="#ffffff" />,
    bg: "#e2536b",
    title: "생활편의",
    sub: "교통, 주거, 생활지원",
  },
  {
    icon: <MaterialIcons name="campaign" size={22} color="#ffffff" />,
    bg: "#e08a2b",
    title: "커뮤니티",
    sub: "게시판, 동네모임, 재능공유",
  },
  {
    icon: <MaterialCommunityIcons name="handshake-outline" size={22} color="#ffffff" />,
    bg: "#3d8ee1",
    title: "파트너 정보",
    sub: "추천 서비스, 제휴 혜택",
  },
];

export function ServicesScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>서비스</Text>
        <MaterialIcons name="search" size={24} color={colors.navy} />
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        {services.map((item) => (
          <Pressable
            key={item.title}
            style={styles.row}
            onPress={() => {
              if (item.title === "일자리·복지") navigation.navigate("JobWelfare");
              if (item.title === "건강·의료") navigation.navigate("HealthMedical");
              if (item.title === "교육·문화") navigation.navigate("EducationCulture");
              if (item.title === "파트너 정보") navigation.navigate("PartnerInfo");
            }}
          >
            <View style={[styles.iconBox, { backgroundColor: item.bg }]}>{item.icon}</View>
            <View style={styles.rowText}>
              <Text style={styles.rowTitle}>{item.title}</Text>
              <Text style={styles.rowSub}>{item.sub}</Text>
            </View>
            <MaterialIcons name="chevron-right" size={22} color={colors.gray} />
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.white },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 12,
  },
  headerTitle: { fontSize: 20, fontWeight: "700", color: colors.navy },
  list: { paddingHorizontal: 20, paddingBottom: 20, gap: 12 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 14,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  rowText: { flex: 1 },
  rowTitle: { fontSize: 15, fontWeight: "700", color: colors.navy },
  rowSub: { fontSize: 12, color: colors.gray, marginTop: 2 },
});
