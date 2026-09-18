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
import type { UserType } from "@sinity/shared";
import type { RootStackParamList } from "../navigation/types";
import { api, setToken } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { BackButton } from "../components/BackButton";
import { IconInput } from "../components/IconInput";
import { colors } from "../theme";

type Props = NativeStackScreenProps<RootStackParamList, "Signup">;

export function SignupScreen({ navigation }: Props) {
  const { refresh } = useAuth();
  const [userType, setUserType] = useState<Extract<UserType, "individual" | "organization">>(
    "individual"
  );
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
    phone: "",
    businessNumber: "",
    orgName: "",
  });
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function update(key: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit() {
    setError(null);

    if (form.password !== form.passwordConfirm) {
      setError("비밀번호가 일치하지 않습니다");
      return;
    }
    if (!agreed) {
      setError("이용약관에 동의해주세요");
      return;
    }

    setSubmitting(true);
    try {
      const payload =
        userType === "individual"
          ? { userType, name: form.name, email: form.email, password: form.password, phone: form.phone || undefined }
          : {
              userType,
              name: form.name,
              email: form.email,
              password: form.password,
              phone: form.phone || undefined,
              businessNumber: form.businessNumber,
              orgName: form.orgName,
            };

      const data = await api.post<{ accessToken: string }>("/auth/signup", payload);
      await setToken(data.accessToken);
      await refresh();
      navigation.replace("Main");
    } catch (err: any) {
      setError(err?.message ?? "회원가입에 실패했습니다");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
    <ScrollView contentContainerStyle={styles.container}>
      {navigation.canGoBack() && <BackButton onPress={() => navigation.goBack()} />}

      <Text style={styles.title}>시니티에{"\n"}오신 것을 환영합니다!</Text>
      <Text style={styles.subtitle}>간단한 가입으로 더 많은 서비스를 이용할 수 있습니다.</Text>

      <View style={styles.tabs}>
        <Pressable
          onPress={() => setUserType("individual")}
          style={[styles.tab, userType === "individual" && styles.tabActive]}
        >
          <Text style={[styles.tabText, userType === "individual" && styles.tabTextActive]}>
            일반 회원
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setUserType("organization")}
          style={[styles.tab, userType === "organization" && styles.tabActive]}
        >
          <Text style={[styles.tabText, userType === "organization" && styles.tabTextActive]}>
            기관 회원
          </Text>
        </Pressable>
      </View>

      <View style={styles.form}>
        <IconInput
          icon="user"
          placeholder="이름을 입력해주세요"
          value={form.name}
          onChangeText={(v) => update("name", v)}
        />
        <IconInput
          icon="mail"
          placeholder="이메일을 입력해주세요"
          value={form.email}
          onChangeText={(v) => update("email", v)}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <IconInput
          icon="phone"
          placeholder="휴대폰 번호를 입력해주세요"
          value={form.phone}
          onChangeText={(v) => update("phone", v)}
          keyboardType="phone-pad"
        />
        <IconInput
          icon="lock"
          placeholder="비밀번호(8자 이상)"
          value={form.password}
          onChangeText={(v) => update("password", v)}
          secureTextEntry
        />
        <IconInput
          icon="lock"
          placeholder="비밀번호 확인"
          value={form.passwordConfirm}
          onChangeText={(v) => update("passwordConfirm", v)}
          secureTextEntry
        />

        {userType === "organization" && (
          <>
            <IconInput
              icon="user"
              placeholder="사업자번호"
              value={form.businessNumber}
              onChangeText={(v) => update("businessNumber", v)}
            />
            <IconInput
              icon="user"
              placeholder="기관명"
              value={form.orgName}
              onChangeText={(v) => update("orgName", v)}
            />
          </>
        )}

        <Pressable style={styles.checkboxRow} onPress={() => setAgreed((v) => !v)}>
          <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
            {agreed && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={styles.checkboxLabel}>이용약관, 개인정보 수집 및 이용에 동의합니다.</Text>
        </Pressable>

        {error && <Text style={styles.error}>{error}</Text>}

        <Pressable
          onPress={handleSubmit}
          disabled={submitting}
          style={[styles.button, submitting && styles.buttonDisabled]}
        >
          {submitting ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.buttonText}>회원가입</Text>
          )}
        </Pressable>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>이미 계정이 있으신가요? </Text>
        <Pressable onPress={() => navigation.navigate("Login")}>
          <Text style={styles.link}>로그인</Text>
        </Pressable>
      </View>
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.white },
  container: { flexGrow: 1, backgroundColor: colors.white, padding: 24, paddingTop: 16 },
  title: { fontSize: 22, fontWeight: "700", color: colors.navy, lineHeight: 28, marginTop: 16 },
  subtitle: { marginTop: 8, fontSize: 14, color: colors.gray },
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
  checkboxRow: { flexDirection: "row", alignItems: "center", gap: 8, paddingVertical: 4 },
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
  checkboxLabel: { flex: 1, fontSize: 12, color: colors.gray },
  error: { color: "#ef4444", fontSize: 13 },
  button: {
    backgroundColor: colors.brand,
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: "center",
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: colors.white, fontWeight: "700", fontSize: 15 },
  footer: { marginTop: 24, flexDirection: "row", justifyContent: "center" },
  footerText: { color: colors.gray, fontSize: 14 },
  link: { color: colors.brand, fontWeight: "700", fontSize: 14, textDecorationLine: "underline" },
});
