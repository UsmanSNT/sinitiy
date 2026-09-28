import { useCallback } from "react";
import { Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/types";
import { useAuth } from "../context/AuthContext";
import { colors } from "../theme";

type IconName = "heart" | "bell" | "bullhorn" | "briefcase" | "face-agent" | "clipboard-text" | "shield-check" | "account-group" | "alert-octagon" | "file-document-multiple" | "account-cog" | "bullhorn-variant";

// Kirmagan foydalanuvchiga faqat login bilan ochiladigan, ilovada haqiqatan ishlaydigan imkoniyatlar ko'rsatiladi.
const guestBenefits: Array<{ icon: IconName; color: string; background: string; title: string; subtitle: string }> = [
  { icon: "account-group", color: "#e2536b", background: "#fdecef", title: "이웃과 소통해요", subtitle: "커뮤니티에 글을 쓰고 댓글·좋아요를 남길 수 있어요" },
  { icon: "clipboard-text", color: "#18a9a1", background: "#e2f8f6", title: "내 활동을 모아봐요", subtitle: "작성한 글과 댓글, 좋아요를 한곳에서 확인해요" },
  { icon: "bullhorn", color: "#e08a2b", background: "#fff1e2", title: "기관이라면 직접 알려요", subtitle: "기관 회원은 공고와 소식을 직접 등록할 수 있어요" },
];

export function MyPageScreen() {
  const { user, logout } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // Ilova bo'yicha status bar oq (Home to'q fonga mos); bu ekran och fonli, shuning uchun
  // fokusda to'q belgilarga o'tadi va chiqib ketganda yana oqqa qaytadi.
  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle("dark-content");
      return () => StatusBar.setBarStyle("light-content");
    }, [])
  );

  async function handleLogout() {
    await logout();
    navigation.reset({ index: 0, routes: [{ name: "Main" }] });
  }

  const menuItems: Array<{ icon: IconName; color: string; background: string; title: string; subtitle: string; onPress: () => void }> = [
    { icon: "heart", color: "#ef4b9a", background: "#ffe7f3", title: "내 관심정보", subtitle: "관심 분야를 설정해요", onPress: () => navigation.navigate("InterestSettings") },
    { icon: "bell", color: "#f07a3e", background: "#fff0e7", title: "알림 설정", subtitle: "푸시 알림을 관리해요", onPress: () => navigation.navigate("NotificationSettings") },
    { icon: "bullhorn", color: "#a94fc4", background: "#f5e9fa", title: "추천 서비스·제휴 혜택", subtitle: "나에게 맞는 추천을 확인해요", onPress: () => navigation.navigate("PartnerInfo") },
    { icon: "briefcase", color: "#18a9a1", background: "#e2f8f6", title: "내 활동", subtitle: "작성한 글과 댓글, 좋아요 내역", onPress: () => navigation.navigate("MyActivity") },
    { icon: "face-agent", color: "#5479b8", background: "#eaf0fb", title: "고객센터", subtitle: "문의하기, FAQ", onPress: () => navigation.navigate("CustomerCenter") },
  ];

  // Rolga xos boshqaruv qatorlari (faqat tashkilot / admin ko'radi).
  if (user?.userType === "organization") {
    menuItems.unshift(
      { icon: "clipboard-text", color: "#2368bc", background: "#e8f1ff", title: "내 공고 관리", subtitle: "공고 등록 및 승인 상태 확인", onPress: () => navigation.navigate("MyListings") },
      { icon: "bullhorn-variant", color: "#c9661c", background: "#fff1e2", title: "광고 신청 관리", subtitle: "배너 광고 신청 및 승인 상태 확인", onPress: () => navigation.navigate("MyAds") }
    );
  }
  if (user?.userType === "admin") {
    menuItems.unshift(
      { icon: "shield-check", color: "#1a9a5a", background: "#e3f7ec", title: "공고 승인 관리", subtitle: "기관이 등록한 공고 심사", onPress: () => navigation.navigate("AdminListings") },
      { icon: "bullhorn-variant", color: "#c9661c", background: "#fff1e2", title: "광고 승인 관리", subtitle: "기관 배너 광고 심사·게시 관리", onPress: () => navigation.navigate("AdminAds") },
      { icon: "alert-octagon", color: "#d4483f", background: "#fdeaea", title: "신고 관리", subtitle: "신고된 게시글 확인 및 처리", onPress: () => navigation.navigate("AdminReports") },
      { icon: "file-document-multiple", color: "#2368bc", background: "#e8f1ff", title: "게시글 관리", subtitle: "커뮤니티 글 숨김·삭제", onPress: () => navigation.navigate("AdminPosts") },
      { icon: "account-cog", color: "#7a5cd6", background: "#f0ebfb", title: "회원 관리", subtitle: "회원 조회 및 이용 정지", onPress: () => navigation.navigate("AdminUsers") }
    );
  }

  const renderMenu = (items: typeof menuItems) => (
    <View style={styles.menuCard}>
      {items.map((item, index) => (
        <Pressable key={item.title} onPress={item.onPress} style={[styles.menuRow, index < items.length - 1 && styles.menuDivider]}>
          <View style={[styles.menuIcon, { backgroundColor: item.background }]}><MaterialCommunityIcons name={item.icon} size={21} color={item.color} /></View>
          <View style={styles.menuCopy}><Text style={styles.menuTitle}>{item.title}</Text><Text style={styles.menuSubtitle}>{item.subtitle}</Text></View>
          <MaterialIcons name="chevron-right" size={22} color="#a4adba" />
        </Pressable>
      ))}
    </View>
  );

  // Login/회원가입 tugmalari pastda (footer ustida) mahkamlangan - barmoq yetadigan joyda, kontent esa tepada.
  if (!user) {
    return (
      <View style={styles.guestContainer}>
        <ScrollView contentContainerStyle={styles.guestContent} showsVerticalScrollIndicator={false}>
          <View style={styles.guestHero}>
            <View style={styles.guestAvatar}><MaterialIcons name="person" size={40} color="#7c899a" /></View>
            <Text style={styles.guestTitle}>로그인하고{"\n"}시니티를 더 편하게 이용하세요</Text>
            <Text style={styles.guestCopy}>지금은 둘러보기 중이에요.{"\n"}가입하면 이런 것들을 할 수 있어요.</Text>
          </View>
          <View style={styles.menuCard}>
            {guestBenefits.map((item, index) => (
              <View key={item.title} style={[styles.menuRow, index < guestBenefits.length - 1 && styles.menuDivider]}>
                <View style={[styles.menuIcon, { backgroundColor: item.background }]}><MaterialCommunityIcons name={item.icon} size={21} color={item.color} /></View>
                <View style={styles.menuCopy}><Text style={styles.menuTitle}>{item.title}</Text><Text style={styles.menuSubtitle}>{item.subtitle}</Text></View>
              </View>
            ))}
          </View>
        </ScrollView>
        <View style={styles.authBox}>
          <Pressable onPress={() => navigation.navigate("Login")} style={({ pressed }) => [styles.loginButton, pressed && { opacity: 0.85 }]}><Text style={styles.loginButtonText}>로그인</Text></Pressable>
          <Pressable onPress={() => navigation.navigate("Signup")} style={({ pressed }) => [styles.signupButton, pressed && { opacity: 0.7 }]}><Text style={styles.signupButtonText}>회원가입</Text></Pressable>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.profile}>
        <View style={styles.avatar}><MaterialIcons name="person" size={36} color="#7c899a" /></View>
        <View style={styles.profileCopy}><Text style={styles.name}>{user.name}님</Text><Text style={styles.phone}>{user.organizationProfile ? `${user.organizationProfile.orgName} · ` : ""}{user.phone ?? user.email}</Text></View>
        <Pressable accessibilityLabel="관심정보 설정" hitSlop={12} onPress={() => navigation.navigate("InterestSettings")}><MaterialIcons name="settings" size={22} color="#536b9c" /></Pressable>
      </View>
      {renderMenu(menuItems)}
      <Pressable onPress={handleLogout} style={styles.logoutRow}><MaterialIcons name="logout" size={20} color="#dd6570" /><Text style={styles.logoutText}>로그아웃</Text></Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#f6f8fb" }, content: { paddingHorizontal: 15, paddingTop: 52, paddingBottom: 28 },
  profile: { flexDirection: "row", alignItems: "center", paddingHorizontal: 5, paddingBottom: 18 },
  avatar: { width: 54, height: 54, borderRadius: 27, alignItems: "center", justifyContent: "center", backgroundColor: "#e8edf3" },
  profileCopy: { flex: 1, paddingLeft: 13 }, name: { fontSize: 20, fontWeight: "800", color: colors.navy }, phone: { marginTop: 4, fontSize: 13, color: "#7d8998" },
  menuCard: { overflow: "hidden", borderRadius: 10, borderWidth: 1, borderColor: "#e7ebf0", backgroundColor: colors.white },
  menuRow: { minHeight: 68, flexDirection: "row", alignItems: "center", paddingHorizontal: 12 }, menuDivider: { borderBottomWidth: 1, borderBottomColor: "#edf0f4" },
  menuIcon: { width: 39, height: 39, borderRadius: 12, alignItems: "center", justifyContent: "center" }, menuCopy: { flex: 1, minWidth: 0, paddingHorizontal: 11 },
  menuTitle: { fontSize: 17, fontWeight: "800", color: colors.navy }, menuSubtitle: { marginTop: 3, fontSize: 13, color: "#8995a5" },
  logoutRow: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 14, padding: 17, borderRadius: 10, backgroundColor: colors.white }, logoutText: { fontSize: 15, color: "#cc5965" },
  guestContainer: { flex: 1, backgroundColor: "#f6f8fb" }, guestContent: { paddingHorizontal: 15, paddingTop: 64, paddingBottom: 20 },
  guestHero: { alignItems: "center", paddingHorizontal: 10, paddingBottom: 26 },
  guestAvatar: { width: 72, height: 72, borderRadius: 36, alignItems: "center", justifyContent: "center", backgroundColor: "#e8edf3", marginBottom: 16 },
  guestTitle: { fontSize: 22, fontWeight: "800", color: colors.navy, textAlign: "center", lineHeight: 30 },
  guestCopy: { marginTop: 10, fontSize: 15, color: "#7d8998", textAlign: "center", lineHeight: 21 },
  authBox: { backgroundColor: colors.white, paddingHorizontal: 20, paddingTop: 14, paddingBottom: 14, gap: 10, borderTopWidth: 1, borderTopColor: "#edf0f4" },
  loginButton: { backgroundColor: colors.brand, borderRadius: 999, paddingVertical: 15, alignItems: "center" },
  loginButtonText: { color: colors.white, fontSize: 16, fontWeight: "700" }, signupButton: { borderWidth: 1, borderColor: colors.border, borderRadius: 999, paddingVertical: 15, alignItems: "center" },
  signupButtonText: { color: colors.navy, fontSize: 16, fontWeight: "700" },
});
