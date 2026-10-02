import { Pressable, StyleSheet, TextInput, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "../theme";

interface Props {
  visible: boolean;
  value: string;
  onChangeText: (value: string) => void;
}

// Sarlavha ostida ochiladigan qidiruv qatori; sarlavhadagi 검색 ikonkasi ochib-yopadi.
export function SearchBar({ visible, value, onChangeText }: Props) {
  if (!visible) return null;
  return (
    <View style={styles.wrap}>
      <View style={styles.box}>
        <MaterialIcons name="search" size={20} color="#8792a4" />
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder="검색어를 입력하세요"
          placeholderTextColor="#95a0af"
          autoFocus
          returnKeyType="search"
        />
        {value ? (
          <Pressable accessibilityLabel="지우기" hitSlop={10} onPress={() => onChangeText("")}>
            <MaterialIcons name="cancel" size={20} color="#b3bcc9" />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: 16, paddingBottom: 10 },
  box: {
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    borderRadius: 22,
    backgroundColor: "#f3f4f6",
  },
  // Web'da fokus ramkasi chiqmasligi uchun outlineStyle (IconInput.tsx dagi kabi).
  input: { flex: 1, fontSize: 16, color: colors.navy, padding: 0, outlineStyle: "none" } as any,
});
