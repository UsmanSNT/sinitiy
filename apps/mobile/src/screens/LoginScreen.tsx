import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/types";
import { useAuth } from "../context/AuthContext";
import { BackButton } from "../components/BackButton";
import { IconInput } from "../components/IconInput";
import { SocialButton, KakaoIcon, NaverIcon, GoogleIcon } from "../components/SocialButton";
import { colors } from "../theme";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export function LoginScreen({ navigation }: Props) {
  const { login } = useAuth();
  const [tab, setTab] = useState<"general" | "simple">("general");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [autoLogin, setAutoLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
      navigation.replace("Main");
    } catch (err: any) {
      setError(err?.message ?? "로그인에 실패했습니다");
    } finally {
      setSubmitting(false);
    }
  }

  function goToSignup() {
    if (navigation.canGoBack()) navigation.goBack();
    else navigation.replace("Signup");
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
    <ScrollView contentContainerStyle={styles.container}>
      {navigation.canGoBack() && <BackButton onPress={() => navigation.goBack()} />}

      <Text style={styles.title}>환영합니다!</Text>
      <Text style={styles.subtitle}>시니티에 다시 오셨네요.</Text>

      <View style={styles.tabs}>
        <Pressable
          onPress={() => setTab("general")}
          style={[styles.tab, tab === "general" && styles.tabActive]}
        >
          <Text style={[styles.tabText, tab === "general" && styles.tabTextActive]}>일반 로그인</Text>
        </Pressable>
        <Pressable
          onPress={() => setTab("simple")}
          style={[styles.tab, tab === "simple" && styles.tabActive]}
        >
          <Text style={[styles.tabText, tab === "simple" && styles.tabTextActive]}>간편 로그인</Text>
        </Pressable>
      </View>

      {tab === "general" ? (
        <View style={styles.form}>
          <IconInput
            icon="mail"
            placeholder="휴대폰 번호 또는 아이디"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            showChevron={false}
          />
          <IconInput
            icon="lock"
            placeholder="비밀번호"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            showChevron={false}
          />

          <View style={styles.rowBetween}>
            <Pressable style={styles.checkboxRow} onPress={() => setAutoLogin((v) => !v)}>
              <View style={[styles.checkbox, autoLogin && styles.checkboxChecked]}>
                {autoLogin && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.checkboxLabel}>자동 로그인</Text>
            </Pressable>
            <Pressable>
              <Text style={styles.findPassword}>비밀번호 찾기</Text>
            </Pressable>
          </View>

          {error && <Text style={styles.error}>{error}</Text>}

          <Pressable
            onPress={handleSubmit}
            disabled={submitting}
            style={[styles.button, submitting && styles.buttonDisabled]}
          >
            {submitting ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.buttonText}>로그인</Text>
            )}
          </Pressable>
        </View>
      ) : (
        <Text style={styles.simpleNotice}>간편 로그인은 준비 중입니다. 아래 SNS 계정을 이용해주세요.</Text>
      )}

      <Pressable onPress={() => navigation.replace("Main")} style={styles.skipButton}>
        <Text style={styles.skipText}>로그인하지 않고 둘러보기</Text>
      </Pressable>

      <Text style={styles.divider}>또는 간편로그인으로 시작하기</Text>

      <View style={styles.socialList}>
        <SocialButton icon={<KakaoIcon />} label="카카오로 시작하기" bg="#FEE500" color="#391B1B" />
        <SocialButton icon={<NaverIcon />} label="네이버로 시작하기" bg="#03C75A" color="#ffffff" />
        <SocialButton icon={<GoogleIcon />} label="구글로 시작하기" bg="#ffffff" color={colors.navy} bordered />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>이미 계정이 없으신가요? </Text>
        <Pressable onPress={goToSignup}>
          <Text style={styles.link}>회원가입</Text>
        </Pressable>
      </View>
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.white },
  container: { flexGrow: 1, backgroundColor: colors.white, padding: 24, paddingTop: 16 },
  title: { fontSize: 24, fontWeight: "700", color: colors.navy, marginTop: 16 },
  subtitle: { marginTop: 4, fontSize: 14, color: colors.gray },
  tabs: {
    marginTop: 20,
    flexDirection: "row",
    backgroundColor: "#f3f4f6",
    borderRadius: 999,
    padding: 4,
  },
  tab: { flex: 1, paddingVertical: 8, borderRadius: 999, alignItems: "center" },
  tabActive: { backgroundColor: colors.white },
  tabText: { color: colors.gray, fontWeight: "600", fontSize: 13 },
  tabTextActive: { color: colors.navy },
  form: { marginTop: 16, gap: 12 },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 2 },
  checkboxRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  checkbox: {
    width: 16,
    height: 16,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: { backgroundColor: colors.brand, borderColor: colors.brand },
  checkmark: { color: colors.white, fontSize: 11, fontWeight: "700", lineHeight: 13 },
  checkboxLabel: { fontSize: 13, color: colors.gray },
  findPassword: { fontSize: 12, color: colors.gray, textDecorationLine: "underline" },
  error: { color: "#ef4444", fontSize: 13 },
  button: {
    backgroundColor: colors.brand,
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: "center",
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: colors.white, fontWeight: "700", fontSize: 15 },
  skipButton: { alignItems: "center", marginTop: 14, paddingVertical: 4 },
  skipText: { color: colors.gray, fontSize: 13, fontWeight: "600", textDecorationLine: "underline" },
  simpleNotice: { marginTop: 24, textAlign: "center", fontSize: 13, color: colors.gray },
  divider: { marginTop: 24, textAlign: "center", fontSize: 11, color: colors.gray },
  socialList: { marginTop: 12, gap: 8 },
  footer: { marginTop: 24, flexDirection: "row", justifyContent: "center" },
  footerText: { color: colors.gray, fontSize: 14 },
  link: { color: colors.brand, fontWeight: "700", fontSize: 14, textDecorationLine: "underline" },
});
