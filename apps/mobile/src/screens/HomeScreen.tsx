import { useCallback, useState } from "react";
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAuth } from "../context/AuthContext";
import { colors } from "../theme";
import { AppHeader } from "../components/AppHeader";
import { BriefcaseIcon, HeartbeatIcon, FamilyIcon, MegaphoneIcon } from "../components/HomeIcons";
import type { RootStackParamList } from "../navigation/types";
import { feedTag, feedTime, loadFeedReadIds, markFeedRead, openFeedItem, useFeed, usePersonalUnread } from "../lib/feed";

const serviceItems = [
  { Icon: BriefcaseIcon, iconColor: "#3fae5c", label: "일자리·복지", sub: "취업·복지 정보" },
  { Icon: HeartbeatIcon, iconColor: "#3d5ee1", label: "건강·의료", sub: "병원·건강 정보" },
  { Icon: FamilyIcon, iconColor: "#e2536b", label: "커뮤니티", sub: "소통·동네소식" },
  { Icon: MegaphoneIcon, iconColor: "#e08a2b", label: "파트너 정보", sub: "추천 서비스" },
];

export function HomeScreen() {
  const { user } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  // 알림 ekrani bilan bir xil 50 ta yangilik olinadi: pastda eng oxirgi 3 tasi ko'rinadi,
  // qo'ng'iroqchadagi son esa 알림 ekranidagi ko'k nuqtalar soni bilan bir xil chiqadi.
  const { items: feed, loading: noticesLoading } = useFeed(50);
  const notices = feed.slice(0, 3);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  useFocusEffect(
    useCallback(() => {
      loadFeedReadIds().then(setReadIds);
    }, [])
  );
  const personalUnread = usePersonalUnread();
  const unreadCount = feed.filter((item) => !readIds.has(item.id)).length + personalUnread;
  // Kartalar balandligi ekran balandligining foizi sifatida hisoblanadi (aspectRatio emas) -
  // Yoga'da aspectRatio + justifyContent:"center" birikmasi Android'da kontentni pastga
  // surib, tepa/pastki bo'shliqni notekis qilib qo'yardi (aniq balandlik bu muammoni oldini oladi).
  const { height: windowHeight } = useWindowDimensions();
  const cardHeight = Math.round(Math.min(Math.max(windowHeight * 0.145, 108), 150));

  return (
    <View style={styles.screen}>
      <AppHeader dark unreadCount={unreadCount} />

      <View style={styles.middleWrap}>
        <View style={styles.greetingBlock}>
          <Text style={styles.greeting}>안녕하세요!</Text>
          <Text style={styles.name}>{user ? `${user.name}님` : "방문자님"} 😊</Text>
          <Text style={styles.subtitle}>오늘도 건강한 하루 되세요.</Text>
        </View>

        <View style={styles.grid}>
          {serviceItems.map((item) => (
            <Pressable
              key={item.label}
              style={({ pressed }) => [styles.card, { height: cardHeight }, pressed && { opacity: 0.78 }]}
              onPress={() => {
                if (item.label === "일자리·복지") navigation.navigate("JobWelfare");
                if (item.label === "건강·의료") navigation.navigate("HealthMedical");
                if (item.label === "커뮤니티") navigation.navigate("Main", { screen: "Community" });
                if (item.label === "파트너 정보") navigation.navigate("PartnerInfo");
              }}
            >
              <View style={styles.iconWrap}>
                <item.Icon color={item.iconColor} size={38} />
              </View>
              <Text style={styles.cardLabel}>{item.label}</Text>
              <Text style={styles.cardSub}>{item.sub}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Yangi xabarlar (오늘의 알림) faqat kirgan foydalanuvchiga ko'rsatiladi. */}
      {user ? (
      <View style={styles.noticeBar}>
        <View style={styles.noticeHeader}>
          <Text style={styles.noticeTitle}>오늘의 알림</Text>
          <Pressable onPress={() => navigation.navigate("Notifications")}>
            <Text style={styles.noticeMore}>전체보기 ›</Text>
          </Pressable>
        </View>
        {!noticesLoading && notices.length === 0 ? (
          <Text style={styles.noticeEmpty}>새로운 소식이 없습니다</Text>
        ) : null}
        {notices.map((n) => {
          const tag = feedTag(n);
          return (
            <Pressable
              key={n.id}
              style={({ pressed }) => [styles.noticeCard, pressed && { opacity: 0.6 }]}
              onPress={() => {
                markFeedRead([n.id]).finally(() => openFeedItem(navigation, n, { viaList: true }));
              }}
            >
              <Text style={[styles.noticeTag, { color: tag.color }]}>{tag.label}</Text>
              <Text style={styles.noticeText} numberOfLines={1}>
                {n.title}
              </Text>
              <Text style={styles.noticeDate}>{feedTime(n.createdAt)}</Text>
            </Pressable>
          );
        })}
      </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "rgb(24, 47, 83)" },
  // Matn bloki va kartalar birgalikda qolgan bo'shliqda markazlashadi -
  // shu bilan matn har doim kartalar ustida, ularga yaqin turadi.
  middleWrap: { flex: 1, paddingHorizontal: 20, justifyContent: "center" },
  greetingBlock: { marginBottom: 24 },
  greeting: { color: "rgba(255,255,255,0.75)", fontSize: 16 },
  name: { color: colors.white, fontSize: 24, fontWeight: "700", marginTop: 5 },
  subtitle: { color: "rgba(255,255,255,0.7)", fontSize: 13, marginTop: 9 },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  card: {
    width: "48%",
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrap: {
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  cardLabel: { fontSize: 13, fontWeight: "700", color: colors.navy, textAlign: "center", includeFontPadding: false },
  cardSub: { fontSize: 10, color: colors.gray, marginTop: 2, textAlign: "center", includeFontPadding: false },
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
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: "#e8ebf0",
  },
  noticeTag: { fontSize: 12, fontWeight: "700", width: 40 },
  noticeText: { flex: 1, fontSize: 13, color: colors.navy, fontWeight: "500" },
  noticeDate: { fontSize: 11, color: colors.gray },
  noticeEmpty: { fontSize: 13, color: colors.gray, paddingVertical: 11 },
});
