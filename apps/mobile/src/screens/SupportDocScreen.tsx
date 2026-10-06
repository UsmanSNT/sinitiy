import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppHeader } from "../components/AppHeader";
import { BottomNav } from "../components/BottomNav";
import type { RootStackParamList } from "../navigation/types";
import { supportDocs } from "../lib/supportDocs";
import { colors } from "../theme";

type Props = NativeStackScreenProps<RootStackParamList, "SupportDoc">;

export function SupportDocScreen({ navigation, route }: Props) {
  const { kind } = route.params;
  const doc = supportDocs[kind];
  const [open, setOpen] = useState<number | null>(null);

  return (
    <SafeAreaView style={styles.safeArea} edges={[]}>
      <AppHeader />
      <View style={styles.header}>
        <Pressable accessibilityLabel="뒤로" hitSlop={12} onPress={() => navigation.goBack()}>
          <MaterialIcons name="chevron-left" size={28} color={colors.navy} />
        </Pressable>
        <Text style={styles.headerTitle}>{doc.title}</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {doc.sections.map((section, index) =>
          kind === "faq" ? (
            <Pressable key={index} onPress={() => setOpen(open === index ? null : index)} style={styles.faqItem}>
              <View style={styles.faqRow}>
                <Text style={styles.faqQ}>{section.heading}</Text>
                <MaterialIcons name={open === index ? "expand-less" : "expand-more"} size={24} color="#8390a2" />
              </View>
              {open === index && <Text style={styles.body}>{section.body}</Text>}
            </Pressable>
          ) : (
            <View key={index} style={styles.section}>
              {section.heading ? <Text style={styles.heading}>{section.heading}</Text> : null}
              <Text style={styles.body}>{section.body}</Text>
            </View>
          )
        )}
      </ScrollView>
      <BottomNav active="MyPage" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.white },
  header: { height: 52, flexDirection: "row", alignItems: "center", paddingHorizontal: 14 },
  headerTitle: { flex: 1, marginLeft: 7, fontSize: 20, fontWeight: "800", color: colors.navy },
  content: { paddingHorizontal: 18, paddingBottom: 30 },
  section: { marginTop: 18 },
  heading: { fontSize: 16, fontWeight: "800", color: colors.navy, marginBottom: 6 },
  body: { marginTop: 8, fontSize: 15, lineHeight: 23, color: "#4a5567" },
  faqItem: { paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: "#edf0f4" },
  faqRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10 },
  faqQ: { flex: 1, fontSize: 16, fontWeight: "800", color: colors.navy },
});
