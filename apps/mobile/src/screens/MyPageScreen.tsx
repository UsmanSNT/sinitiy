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
    navigation.reset({ index: 0, routes: [{ name: "Login" }] });
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
  logoutRow: { backgroundColor: colors.white, paddingVertical: 16, paddingHorizontal: 20 },
  logoutText: { color: "#ef4444", fontSize: 14 },
});
