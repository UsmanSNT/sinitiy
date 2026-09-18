import { StyleSheet, Text, View } from "react-native";
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
      <View style={styles.top}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>안녕하세요!</Text>
            <Text style={styles.name}>{user ? `${user.name}님` : "..."} 😊</Text>
          </View>
          <BellIcon color={colors.white} />
        </View>
        <Text style={styles.subtitle}>오늘도 건강한 하루 되세요.</Text>
      </View>

      <View style={styles.gridWrap}>
        <View style={styles.grid}>
          {serviceItems.map((item) => (
            <View key={item.label} style={styles.card}>
              <View style={styles.iconWrap}>
                <item.Icon color={item.iconColor} size={38} />
              </View>
              <Text style={styles.cardLabel}>{item.label}</Text>
              <Text style={styles.cardSub}>{item.sub}</Text>
            </View>
          ))}
        </View>
      </View>

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
  top: { paddingHorizontal: 20, paddingTop: 50 },
  headerTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  greeting: { color: "rgba(255,255,255,0.75)", fontSize: 15 },
  name: { color: colors.white, fontSize: 21, fontWeight: "700", marginTop: 4 },
  subtitle: { color: "rgba(255,255,255,0.7)", fontSize: 12, marginTop: 8 },
  gridWrap: { flex: 1, paddingHorizontal: 20, justifyContent: "center" },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  card: {
    width: "48%",
    aspectRatio: 1.25,
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrap: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  cardLabel: { fontSize: 13, fontWeight: "700", color: colors.navy, textAlign: "center" },
  cardSub: { fontSize: 10, color: colors.gray, marginTop: 2, textAlign: "center" },
  noticeBar: {
    backgroundColor: "#f7f8fa",
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 10,
  },
  noticeHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  noticeTitle: { fontWeight: "700", color: colors.navy, fontSize: 15 },
  noticeMore: { color: colors.gray, fontSize: 12 },
  noticeCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingVertical: 9,
    paddingHorizontal: 12,
    marginBottom: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  noticeTag: { fontSize: 12, fontWeight: "700", width: 34 },
  noticeText: { flex: 1, fontSize: 13, color: colors.navy, fontWeight: "500" },
  noticeDate: { fontSize: 11, color: colors.gray },
});
