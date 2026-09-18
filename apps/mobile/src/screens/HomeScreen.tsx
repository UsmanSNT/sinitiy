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
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.greeting}>안녕하세요!</Text>
          <BellIcon />
        </View>
        <Text style={styles.name}>{user ? `${user.name}님` : "..."} 😊</Text>
        <Text style={styles.subtitle}>오늘도 건강한 하루 되세요.</Text>
      </View>

      <View style={styles.grid}>
        {serviceItems.map((item) => (
          <View key={item.label} style={styles.card}>
            <View style={[styles.iconWrap, { backgroundColor: item.bg }]}>
              <item.Icon color={item.iconColor} size={20} />
            </View>
            <Text style={styles.cardLabel}>{item.label}</Text>
            <Text style={styles.cardSub}>{item.sub}</Text>
          </View>
        ))}
      </View>

      <View style={styles.noticeSection}>
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f6f8" },
  content: { paddingBottom: 40 },
  header: { backgroundColor: colors.navy, paddingTop: 60, paddingBottom: 24, paddingHorizontal: 20 },
  headerTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  greeting: { color: "rgba(255,255,255,0.8)", fontSize: 13 },
  name: { color: colors.white, fontSize: 20, fontWeight: "700", marginTop: 6 },
  subtitle: { color: "rgba(255,255,255,0.7)", fontSize: 13, marginTop: 4 },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 16,
    gap: 12,
  },
  card: {
    width: "47%",
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  cardLabel: { fontSize: 14, fontWeight: "700", color: colors.navy },
  cardSub: { fontSize: 11, color: colors.gray, marginTop: 2 },
  noticeSection: {
    marginHorizontal: 16,
    marginTop: 4,
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
  },
  noticeHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  noticeTitle: { fontWeight: "700", color: colors.navy, fontSize: 15 },
  noticeMore: { color: colors.gray, fontSize: 12 },
  noticeRow: { flexDirection: "row", alignItems: "center", paddingVertical: 6, gap: 8 },
  noticeTag: { fontSize: 12, fontWeight: "700", width: 34 },
  noticeText: { flex: 1, fontSize: 13, color: colors.navy },
  noticeDate: { fontSize: 11, color: colors.gray },
});
