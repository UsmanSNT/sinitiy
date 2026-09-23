import { Image, Linking, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import type { RootStackParamList } from "../navigation/types";
import { colors } from "../theme";
import { BottomNav } from "../components/BottomNav";

type Props = NativeStackScreenProps<RootStackParamList, "PartnerDetail">;

export function PartnerDetailScreen({ navigation, route }: Props) {
  const { title, service, category, image, location, address, phone, homepage, description } = route.params;

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <Pressable accessibilityLabel="뒤로" hitSlop={12} onPress={() => navigation.goBack()}>
          <MaterialIcons name="chevron-left" size={28} color={colors.navy} />
        </Pressable>
        <Text style={styles.headerTitle}>상세보기</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topInfo}>
          <Text style={styles.tag}>{category}</Text>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.meta}>{location ? `${location} · ${service}` : service}</Text>
        </View>

        <Image source={image} style={styles.hero} resizeMode="cover" />

        <View style={styles.body}>
          {description ? <Text style={styles.description}>{description}</Text> : null}
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>전화</Text>
            <Text style={styles.infoValue}>{phone}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>주소</Text>
            <Text style={styles.infoValue}>{address}</Text>
          </View>
          {homepage ? (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>홈페이지</Text>
              <Text style={styles.linkValue}>{homepage.replace(/^https?:\/\//, "")}</Text>
            </View>
          ) : null}
        </View>
      </ScrollView>

      <View style={styles.actions}>
        <Pressable style={styles.callButton} onPress={() => Linking.openURL(`tel:${phone}`)}>
          <MaterialIcons name="call" size={19} color="#1768b5" />
          <Text style={styles.callButtonText}>전화하기</Text>
        </Pressable>
        {homepage ? (
          <Pressable style={styles.webButton} onPress={() => Linking.openURL(homepage)}>
            <Text style={styles.webButtonText}>홈페이지</Text>
          </Pressable>
        ) : (
          <Pressable style={styles.webButton} onPress={() => Linking.openURL(`https://maps.google.com/?q=${encodeURIComponent(address)}`)}>
            <Text style={styles.webButtonText}>지도보기</Text>
          </Pressable>
        )}
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
  tag: { alignSelf: "flex-start", overflow: "hidden", borderRadius: 12, backgroundColor: "#ffe7ee", paddingHorizontal: 10, paddingVertical: 5, fontSize: 13, fontWeight: "700", color: "#df557b" },
  title: { marginTop: 8, fontSize: 22, fontWeight: "800", color: colors.navy },
  meta: { marginTop: 6, fontSize: 14, color: colors.gray },
  hero: { width: "90%", height: 190, alignSelf: "center", borderRadius: 8, backgroundColor: "#eef1f5" },
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
