import { Pressable, StyleSheet, Text } from "react-native";
import { colors } from "../theme";

export function BackButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable onPress={onPress} hitSlop={16} style={styles.button}>
      <Text style={styles.text}>‹</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { width: 40, height: 40, justifyContent: "center", marginLeft: -8 },
  text: { fontSize: 30, color: colors.navy, lineHeight: 30 },
});
