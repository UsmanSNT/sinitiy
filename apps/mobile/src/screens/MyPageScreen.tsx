import { Pressable, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/types";
import { useAuth } from "../context/AuthContext";
import { colors } from "../theme";

export function MyPageScreen() {
  const { user, logout } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  async function handleLogout() {
    await logout();
    navigation.reset({ index: 0, routes: [{ name: "Main" }] });
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.name}>시니티 둘러보기 중</Text>
          <Text style={styles.email}>로그인하면 더 많은 서비스를 이용할 수 있습니다.</Text>
        </View>

        <View style={styles.authBox}>
          <Pressable onPress={() => navigation.navigate("Login")} style={styles.loginButton}>
            <Text style={styles.loginButtonText}>로그인</Text>
          </Pressable>
          <Pressable onPress={() => navigation.navigate("Signup")} style={styles.signupButton}>
            <Text style={styles.signupButtonText}>회원가입</Text>
          </Pressable>
        </View>

      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.name}>{user?.name}님</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      <Pressable onPress={handleLogout} style={styles.logoutRow}>
        <Text style={styles.logoutText}>로그아웃</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f6f8" },
  header: { backgroundColor: colors.navy, paddingTop: 60, paddingBottom: 28, paddingHorizontal: 20 },
  name: { color: colors.white, fontSize: 18, fontWeight: "700" },
  email: { color: "rgba(255,255,255,0.7)", fontSize: 13, marginTop: 4 },
  authBox: { backgroundColor: colors.white, padding: 20, gap: 10 },
  loginButton: {
    backgroundColor: colors.brand,
    borderRadius: 999,
    paddingVertical: 13,
    alignItems: "center",
  },
  loginButtonText: { color: colors.white, fontSize: 14, fontWeight: "700" },
  signupButton: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 999,
    paddingVertical: 13,
    alignItems: "center",
  },
  signupButtonText: { color: colors.navy, fontSize: 14, fontWeight: "700" },
  logoutRow: { backgroundColor: colors.white, paddingVertical: 16, paddingHorizontal: 20, marginTop: 10 },
  logoutText: { color: "#ef4444", fontSize: 14 },
});
