import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../context/AuthContext";
import { colors } from "../theme";
import { BellIcon, BriefcaseIcon, HeartIcon, PeopleIcon, MegaphoneIcon } from "../components/HomeIcons";

const serviceItems = [
  { Icon: BriefcaseIcon, iconColor: "#3d5ee1", bg: "#e8f0fe", label: "일자리·복지", sub: "취업·복지 정보" },
  { Icon: HeartIcon, iconColor: "#e2536b", bg: "#fdeaea", label: "건강·의료", sub: "병원·건강 정보" },
  { Icon: PeopleIcon, iconColor: "#3fae5c", bg: "#eaf7ee", label: "커뮤니티", sub: "소통·동네소식" },
  { Icon: MegaphoneIcon, iconColor: "#e08a2b", bg: "#fdf3e3", label: "파트너 정보", sub: "추천 서비스" },
];

const notices = [
  { tag: "행사", tagColor: "#3d5ee1", text: "시니티 요가 교실 참여자 모집", date: "05.20" },
  { tag: "공지", tagColor: colors.accent, text: "건강검진 지원 안내", date: "05.18" },
  { tag: "매체", tagColor: "#e08a2b", text: "동네모임 new 글이 올라왔어요!", date: "05.17" },
];

export function HomeScreen() {
  const { user } = useAuth();

  return (
    <View style={styles.screen}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>안녕하세요!</Text>
            <Text style={styles.name}>{user ? `${user.name}님` : "..."} 😊</Text>
          </View>
          <BellIcon color={colors.navy} />
        </View>
        <Text style={styles.subtitle}>오늘도 건강한 하루 되세요.</Text>

        <View style={styles.grid}>
          {serviceItems.map((item) => (
            <View key={item.label} style={styles.card}>
              <View style={[styles.iconWrap, { backgroundColor: item.bg }]}>
                <item.Icon color={item.iconColor} size={30} />
              </View>
              <Text style={styles.cardLabel}>{item.label}</Text>
              <Text style={styles.cardSub}>{item.sub}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.noticeBar}>
        <View style={styles.noticeHeader}>
          <Text style={styles.noticeTitle}>오늘의 알림</Text>
          <Text style={styles.noticeMore}>전체보기 ›</Text>
        </View>
        {notices.map((n) => (
          <View key={n.text} style={styles.noticeRow}>
            <Text style={[styles.noticeTag, { color: n.tagColor }]}>{n.tag}</Text>
            <Text style={styles.noticeText} numberOfLines={1}>
              {n.text}
            </Text>
            <Text style={styles.noticeDate}>{n.date}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.white },
  scroll: { flex: 1 },
  content: { padding: 20, paddingTop: 60 },
  headerTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  greeting: { color: colors.gray, fontSize: 13 },
  name: { color: colors.navy, fontSize: 20, fontWeight: "700", marginTop: 4 },
  subtitle: { color: colors.gray, fontSize: 13, marginTop: 10 },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 20,
    gap: 14,
  },
  card: {
    width: "47%",
    aspectRatio: 1,
    backgroundColor: colors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrap: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  cardLabel: { fontSize: 15, fontWeight: "700", color: colors.navy, textAlign: "center" },
  cardSub: { fontSize: 11, color: colors.gray, marginTop: 3, textAlign: "center" },
  noticeBar: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 8,
  },
  noticeHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  noticeTitle: { fontWeight: "700", color: colors.navy, fontSize: 15 },
  noticeMore: { color: colors.gray, fontSize: 12 },
  noticeRow: { flexDirection: "row", alignItems: "center", paddingVertical: 5, gap: 8 },
  noticeTag: { fontSize: 12, fontWeight: "700", width: 34 },
  noticeText: { flex: 1, fontSize: 13, color: colors.navy },
  noticeDate: { fontSize: 11, color: colors.gray },
});
