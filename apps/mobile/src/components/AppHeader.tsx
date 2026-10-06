import { Pressable, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { RootStackParamList } from "../navigation/types";
import { BellIcon } from "./HomeIcons";
import { useUnreadCount } from "../lib/feed";
import { useAuth } from "../context/AuthContext";
import { useStatusBarStyle } from "../lib/useStatusBarStyle";
import { colors } from "../theme";

interface Props {
  // Home to'q fonda ko'rinadi.
  dark?: boolean;
  // Ekran sonni o'zi bilsa (Home, 알림) shu yerga beradi - qo'shimcha so'rov yuborilmaydi.
  unreadCount?: number;
}

// Status bar balandligi (insets.top) shu yerda qo'shiladi - ekranlar SafeAreaView'da top edge ishlatmaydi,
// shu bilan navbar hamma ekranda bir xil balandlikda turadi.
// Hamma ekranlarning tepasidagi umumiy navbar: logo + ilova nomi + 알림 qo'ng'iroqchasi.
export function AppHeader({ dark, unreadCount }: Props) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  // 알림 (qo'ng'iroqcha va yangi xabarlar soni) faqat ro'yxatdan o'tgan foydalanuvchiga; mehmonga so'rov ham yuborilmaydi.
  const fetched = useUnreadCount(!!user && unreadCount === undefined);
  const unread = unreadCount ?? fetched;
  useStatusBarStyle(dark ? "light-content" : "dark-content");
  const fg = dark ? colors.white : colors.navy;

  return (
    <View style={[styles.bar, { paddingTop: insets.top + 6 }, dark ? styles.barDark : styles.barLight]}>
      <Pressable
        accessibilityLabel="시니티 홈"
        style={styles.brand}
        onPress={() => navigation.navigate("Main", { screen: "Home" })}
      >
        <View style={[styles.logo, dark && styles.logoDark]}>
          <Text style={styles.logoEmoji}>🌿</Text>
        </View>
        <Text style={[styles.name, { color: fg }]}>시니티</Text>
      </Pressable>
      {user ? (
        <Pressable
          accessibilityLabel={unread ? `알림, 읽지 않은 소식 ${unread}개` : "알림"}
          hitSlop={12}
          onPress={() => navigation.navigate("Notifications")}
        >
          <BellIcon color={fg} size={26} />
          {unread > 0 ? (
            <View style={[styles.badge, dark && styles.badgeDark]}>
              <Text style={styles.badgeText}>{unread > 99 ? "99+" : unread}</Text>
            </View>
          ) : null}
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    minHeight: 54,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingBottom: 6,
  },
  barLight: { backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: "#edf0f4" },
  barDark: { backgroundColor: "rgb(24, 47, 83)" },
  brand: { flexDirection: "row", alignItems: "center", gap: 9 },
  logo: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.navy, alignItems: "center", justifyContent: "center" },
  logoDark: { backgroundColor: colors.navyLight },
  logoEmoji: { fontSize: 16, includeFontPadding: false },
  name: { fontSize: 20, fontWeight: "800", includeFontPadding: false },
  badge: {
    position: "absolute",
    top: -7,
    right: -9,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    paddingHorizontal: 5,
    backgroundColor: "#e2536b",
    borderWidth: 2,
    borderColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeDark: { borderColor: "rgb(24, 47, 83)" },
  badgeText: { color: colors.white, fontSize: 11, fontWeight: "800", includeFontPadding: false },
});
