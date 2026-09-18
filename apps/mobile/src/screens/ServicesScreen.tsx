import { StyleSheet, Text, View } from "react-native";
import { colors } from "../theme";

export function ServicesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>서비스</Text>
      <Text style={styles.text}>일자리·복지, 건강·의료, 교육 정보가 곧 제공됩니다.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white, padding: 20, paddingTop: 60 },
  title: { fontSize: 20, fontWeight: "700", color: colors.navy, marginBottom: 8 },
  text: { fontSize: 14, color: colors.gray },
});
