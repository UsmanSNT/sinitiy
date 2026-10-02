import { Image, Linking, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppHeader } from "../components/AppHeader";
import type { RootStackParamList } from "../navigation/types";
import { colors } from "../theme";
import { BottomNav } from "../components/BottomNav";

type Props = NativeStackScreenProps<RootStackParamList, "AdDetail">;

export function AdDetailScreen({ navigation, route }: Props) {
  const { ad, color } = route.params;

  return (
    <SafeAreaView style={styles.safeArea} edges={[]}>
      <AppHeader />
      <View style={styles.header}>
        <Pressable accessibilityLabel="뒤로" hitSlop={12} onPress={() => navigation.goBack()}>
          <MaterialIcons name="chevron-left" size={28} color={colors.navy} />
        </Pressable>
        <Text style={styles.headerTitle}>상세보기</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topInfo}>
          <Text style={styles.tag}>광고</Text>
          <Text style={styles.title}>{ad.title}</Text>
          <Text style={styles.meta}>{ad.orgName}</Text>
        </View>

        {ad.images[0] ? (
          <Image source={{ uri: ad.images[0] }} style={styles.hero} resizeMode="cover" />
        ) : (
          <View style={[styles.hero, styles.heroPlain, { backgroundColor: color }]}>
            <MaterialCommunityIcons name="bullhorn-variant" size={64} color="rgba(255,255,255,0.85)" />
          </View>
        )}

        <View style={styles.body}>
          <Text style={styles.description}>{ad.content}</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>기관</Text>
            <Text style={styles.infoValue}>{ad.orgName}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>전화</Text>
            <Text style={styles.infoValue}>{ad.phone}</Text>
          </View>
          {ad.homepage ? (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>홈페이지</Text>
              <Text style={styles.linkValue}>{ad.homepage.replace(/^https?:\/\//, "")}</Text>
            </View>
          ) : null}
        </View>
      </ScrollView>

      <View style={styles.actions}>
        <Pressable style={styles.callButton} onPress={() => Linking.openURL(`tel:${ad.phone}`)}>
          <MaterialIcons name="call" size={19} color="#1768b5" />
          <Text style={styles.callButtonText}>전화하기</Text>
        </Pressable>
        {ad.homepage ? (
          <Pressable style={styles.webButton} onPress={() => Linking.openURL(ad.homepage!)}>
            <Text style={styles.webButtonText}>홈페이지</Text>
          </Pressable>
        ) : null}
      </View>
      <BottomNav active="Services" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.white },
  header: { height: 52, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 14 },
  headerTitle: { fontSize: 20, fontWeight: "800", color: colors.navy },
  headerSpacer: { width: 28 },
  content: { paddingBottom: 20 },
  topInfo: { paddingHorizontal: 20, paddingTop: 4, paddingBottom: 16 },
  tag: { alignSelf: "flex-start", overflow: "hidden", borderRadius: 12, backgroundColor: "#fff1e2", paddingHorizontal: 10, paddingVertical: 5, fontSize: 13, fontWeight: "700", color: "#c9661c" },
  title: { marginTop: 8, fontSize: 22, fontWeight: "800", color: colors.navy },
  meta: { marginTop: 6, fontSize: 14, color: colors.gray },
  hero: { width: "90%", height: 190, alignSelf: "center", borderRadius: 8, backgroundColor: "#eef1f5" },
  heroPlain: { alignItems: "center", justifyContent: "center" },
  body: { padding: 20 },
  description: { paddingBottom: 15, fontSize: 16, color: colors.navy, lineHeight: 24 },
  infoRow: { flexDirection: "row", paddingVertical: 12, borderTopWidth: 1, borderTopColor: colors.border },
  infoLabel: { width: 84, fontSize: 15, fontWeight: "800", color: "#326b9d" },
  infoValue: { flex: 1, fontSize: 15, color: colors.navy },
  linkValue: { flex: 1, fontSize: 15, fontWeight: "700", color: "#2874bd" },
  actions: { flexDirection: "row", gap: 10, padding: 14, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.white },
  callButton: { flex: 1, flexDirection: "row", gap: 7, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "#2674bd", borderRadius: 7, paddingVertical: 13 },
  callButtonText: { fontSize: 16, fontWeight: "800", color: "#1768b5" },
  webButton: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#2c8be5", borderRadius: 7, paddingVertical: 13 },
  webButtonText: { fontSize: 16, fontWeight: "800", color: colors.white },
});
