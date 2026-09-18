import { Image, Linking, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import type { RootStackParamList } from "../navigation/types";
import { colors } from "../theme";

type Props = NativeStackScreenProps<RootStackParamList, "JobDetail">;

const PHONE = "02-123-4567";

export function JobDetailScreen({ navigation, route }: Props) {
  const { title, organization, period, image } = route.params;

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <Pressable accessibilityLabel="뒤로" hitSlop={12} onPress={() => navigation.goBack()}>
          <MaterialIcons name="chevron-left" size={26} color={colors.navy} />
        </Pressable>
        <Text style={styles.headerTitle}>상세보기</Text>
        <View style={{ width: 26 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topInfo}>
          <Text style={styles.tag}>일자리</Text>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.meta}>
            {organization} · {period}
          </Text>
        </View>

        <Image source={image} style={styles.hero} resizeMode="cover" />

        <View style={styles.body}>
          <Text style={styles.description}>
            시니어의 경험과 노하우를 활용한 사회활동에 함께할 참여자를 모집합니다. 지원자격과 일정을
            확인하고 지금 신청해 보세요.
          </Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>지원자격</Text>
            <Text style={styles.infoValue}>만 60세 이상 시니어</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>신청방법</Text>
            <Text style={styles.infoValue}>방문 신청 후 서류 접수</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>전화</Text>
            <Text style={styles.infoValue}>{PHONE}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.actions}>
        <Pressable style={styles.callButton} onPress={() => Linking.openURL(`tel:${PHONE}`)}>
          <MaterialIcons name="call" size={18} color={colors.navy} />
          <Text style={styles.callButtonText}>전화하기</Text>
        </Pressable>
        <Pressable style={styles.goButton}>
          <Text style={styles.goButtonText}>바로가기</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.white },
  header: {
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
  },
  headerTitle: { fontSize: 16, fontWeight: "700", color: colors.navy },
  content: { paddingBottom: 20 },
  topInfo: { paddingHorizontal: 20, paddingTop: 4, paddingBottom: 16 },
  hero: {
    width: "auto",
    marginHorizontal: 20,
    aspectRatio: 16 / 10,
    borderRadius: 16,
    backgroundColor: "#eef1f5",
  },
  body: { padding: 20 },
  tag: { fontSize: 12, fontWeight: "700", color: colors.accent },
  title: { fontSize: 19, fontWeight: "800", color: colors.navy, marginTop: 6 },
  meta: { fontSize: 12, color: colors.gray, marginTop: 6 },
  description: { fontSize: 14, color: colors.navy, lineHeight: 22 },
  infoRow: {
    flexDirection: "row",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  infoLabel: { width: 76, fontSize: 13, fontWeight: "700", color: colors.gray },
  infoValue: { flex: 1, fontSize: 13, color: colors.navy },
  actions: {
    flexDirection: "row",
    gap: 10,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  callButton: {
    flex: 1,
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 999,
    paddingVertical: 13,
  },
  callButtonText: { fontSize: 14, fontWeight: "700", color: colors.navy },
  goButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.accent,
    borderRadius: 999,
    paddingVertical: 13,
  },
  goButtonText: { fontSize: 14, fontWeight: "700", color: colors.white },
});
