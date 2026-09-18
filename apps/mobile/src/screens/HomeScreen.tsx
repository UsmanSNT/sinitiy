import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../context/AuthContext";
import { colors } from "../theme";
import { BellIcon, BriefcaseIcon, HeartbeatIcon, FamilyIcon, MegaphoneIcon } from "../components/HomeIcons";

const serviceItems = [
  { Icon: BriefcaseIcon, iconColor: "#3fae5c", label: "일자리·복지", sub: "취업·복지 정보" },
  { Icon: HeartbeatIcon, iconColor: "#3d5ee1", label: "건강·의료", sub: "병원·건강 정보" },
  { Icon: FamilyIcon, iconColor: "#e2536b", label: "커뮤니티", sub: "소통·동네소식" },
  { Icon: MegaphoneIcon, iconColor: "#e08a2b", label: "파트너 정보", sub: "추천 서비스" },
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
          <BellIcon color={colors.white} />
        </View>
        <Text style={styles.subtitle}>오늘도 건강한 하루 되세요.</Text>

        <View style={styles.gridWrap}>
          <View style={styles.grid}>
            {serviceItems.map((item) => (
              <View key={item.label} style={styles.card}>
                <View style={styles.iconWrap}>
                  <item.Icon color={item.iconColor} size={56} />
                </View>
                <Text style={styles.cardLabel}>{item.label}</Text>
                <Text style={styles.cardSub}>{item.sub}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.noticeBar}>
        <View style={styles.noticeHeader}>
          <Text style={styles.noticeTitle}>오늘의 알림</Text>
          <Text style={styles.noticeMore}>전체보기 ›</Text>
        </View>
        {notices.map((n) => (
          <View key={n.text} style={styles.noticeCard}>
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
  screen: { flex: 1, backgroundColor: "rgb(24, 47, 83)" },
  scroll: { flex: 1 },
  content: { flexGrow: 1, padding: 20, paddingTop: 60 },
  headerTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  greeting: { color: "rgba(255,255,255,0.75)", fontSize: 16 },
  name: { color: colors.white, fontSize: 24, fontWeight: "700", marginTop: 4 },
  subtitle: { color: "rgba(255,255,255,0.7)", fontSize: 13, marginTop: 10 },
  gridWrap: { flex: 1, justifyContent: "center" },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
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
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  cardLabel: { fontSize: 15, fontWeight: "700", color: colors.navy, textAlign: "center" },
  cardSub: { fontSize: 11, color: colors.gray, marginTop: 3, textAlign: "center" },
  noticeBar: {
    backgroundColor: "#f7f8fa",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 10,
  },
  noticeHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  noticeTitle: { fontWeight: "700", color: colors.navy, fontSize: 18 },
  noticeMore: { color: colors.gray, fontSize: 13 },
  noticeCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: colors.white,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  noticeTag: { fontSize: 14, fontWeight: "700", width: 40 },
  noticeText: { flex: 1, fontSize: 15, color: colors.navy, fontWeight: "500" },
  noticeDate: { fontSize: 12, color: colors.gray },
});
