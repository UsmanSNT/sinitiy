import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/types";
import { useAuth } from "../context/AuthContext";
import { colors } from "../theme";

type IconName = "heart" | "bell" | "bullhorn" | "briefcase" | "face-agent" | "clipboard-text" | "shield-check";

export function MyPageScreen() {
  const { user, logout } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  async function handleLogout() {
    await logout();
    navigation.reset({ index: 0, routes: [{ name: "Main" }] });
  }

  const menuItems: Array<{ icon: IconName; color: string; background: string; title: string; subtitle: string; onPress: () => void }> = [
    { icon: "heart", color: "#ef4b9a", background: "#ffe7f3", title: "내 관심정보", subtitle: "관심 분야를 설정해요", onPress: () => navigation.navigate("InterestSettings") },
    { icon: "bell", color: "#f07a3e", background: "#fff0e7", title: "알림 설정", subtitle: "푸시 알림을 관리해요", onPress: () => navigation.navigate("NotificationSettings") },
    { icon: "bullhorn", color: "#a94fc4", background: "#f5e9fa", title: "추천 서비스·제휴 혜택", subtitle: "나에게 맞는 추천을 확인해요", onPress: () => navigation.navigate("PartnerInfo") },
    { icon: "briefcase", color: "#18a9a1", background: "#e2f8f6", title: "내 활동", subtitle: "작성한 글과 댓글, 좋아요 내역", onPress: () => navigation.navigate("Main", { screen: "Community" }) },
    { icon: "face-agent", color: "#5479b8", background: "#eaf0fb", title: "고객센터", subtitle: "문의하기, FAQ", onPress: () => navigation.navigate("CustomerCenter") },
  ];

  // Rolga xos boshqaruv qatorlari (faqat tashkilot / admin ko'radi).
  if (user?.userType === "organization") {
    menuItems.unshift({ icon: "clipboard-text", color: "#2368bc", background: "#e8f1ff", title: "내 공고 관리", subtitle: "공고 등록 및 승인 상태 확인", onPress: () => navigation.navigate("MyListings") });
  }
  if (user?.userType === "admin") {
    menuItems.unshift({ icon: "shield-check", color: "#1a9a5a", background: "#e3f7ec", title: "공고 승인 관리", subtitle: "기관이 등록한 공고 심사", onPress: () => navigation.navigate("AdminListings") });
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

  if (!user) {
    return (
      <ScrollView style={styles.guestContainer} contentContainerStyle={{ paddingBottom: 28 }} showsVerticalScrollIndicator={false}>
        <View style={styles.guestHeader}>
          <Text style={styles.guestName}>시니티 둘러보기 중</Text>
          <Text style={styles.guestCopy}>로그인하면 더 많은 서비스를 이용할 수 있습니다.</Text>
        </View>
        <View style={styles.authBox}>
          <Pressable onPress={() => navigation.navigate("Login")} style={styles.loginButton}><Text style={styles.loginButtonText}>로그인</Text></Pressable>
          <Pressable onPress={() => navigation.navigate("Signup")} style={styles.signupButton}><Text style={styles.signupButtonText}>회원가입</Text></Pressable>
        </View>
        <View style={{ paddingHorizontal: 15, paddingTop: 14 }}>{renderMenu(menuItems.filter((m) => m.title !== "내 활동"))}</View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.profile}>
        <View style={styles.avatar}><MaterialIcons name="person" size={36} color="#7c899a" /></View>
        <View style={styles.profileCopy}><Text style={styles.name}>{user.name}님</Text><Text style={styles.phone}>{user.phone ?? user.email}</Text></View>
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
  profileCopy: { flex: 1, paddingLeft: 13 }, name: { fontSize: 18, fontWeight: "800", color: colors.navy }, phone: { marginTop: 4, fontSize: 11, color: "#7d8998" },
  menuCard: { overflow: "hidden", borderRadius: 10, borderWidth: 1, borderColor: "#e7ebf0", backgroundColor: colors.white },
  menuRow: { minHeight: 68, flexDirection: "row", alignItems: "center", paddingHorizontal: 12 }, menuDivider: { borderBottomWidth: 1, borderBottomColor: "#edf0f4" },
  menuIcon: { width: 39, height: 39, borderRadius: 12, alignItems: "center", justifyContent: "center" }, menuCopy: { flex: 1, minWidth: 0, paddingHorizontal: 11 },
  menuTitle: { fontSize: 13, fontWeight: "800", color: colors.navy }, menuSubtitle: { marginTop: 3, fontSize: 10, color: "#8995a5" },
  logoutRow: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 14, padding: 17, borderRadius: 10, backgroundColor: colors.white }, logoutText: { fontSize: 13, color: "#cc5965" },
  guestContainer: { flex: 1, backgroundColor: "#f5f6f8" }, guestHeader: { backgroundColor: colors.navy, paddingTop: 60, paddingBottom: 28, paddingHorizontal: 20 },
  guestName: { color: colors.white, fontSize: 18, fontWeight: "700" }, guestCopy: { color: "rgba(255,255,255,0.7)", fontSize: 13, marginTop: 4 },
  authBox: { backgroundColor: colors.white, padding: 20, gap: 10 }, loginButton: { backgroundColor: colors.brand, borderRadius: 999, paddingVertical: 13, alignItems: "center" },
  loginButtonText: { color: colors.white, fontSize: 14, fontWeight: "700" }, signupButton: { borderWidth: 1, borderColor: colors.border, borderRadius: 999, paddingVertical: 13, alignItems: "center" },
  signupButtonText: { color: colors.navy, fontSize: 14, fontWeight: "700" },
});
