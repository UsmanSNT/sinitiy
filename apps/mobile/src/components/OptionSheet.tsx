import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../theme";

interface Props {
  visible: boolean;
  title: string;
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
  onClose: () => void;
}

// Pastdan chiqadigan oddiy, bir qavatli tanlov ro'yxati (masalan, kategoriya tanlash uchun).
// Ierarxik tanlov (shahar > tuman) uchun RegionPicker.tsx dan foydalaniladi.
export function OptionSheet({ visible, title, options, selected, onSelect, onClose }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <Pressable accessibilityLabel="닫기" hitSlop={12} onPress={onClose}>
            <MaterialIcons name="close" size={24} color={colors.navy} />
          </Pressable>
        </View>
        <ScrollView style={styles.list}>
          {options.map((option) => {
            const active = option === selected;
            return (
              <Pressable
                key={option}
                style={styles.row}
                onPress={() => {
                  onSelect(option);
                  onClose();
                }}
              >
                <Text style={[styles.rowText, active && styles.rowTextActive]}>{option}</Text>
                {active && <MaterialIcons name="check" size={20} color={colors.brand} />}
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(15,23,42,0.45)" },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    maxHeight: "70%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#edf0f4",
  },
  title: { fontSize: 17, fontWeight: "800", color: colors.navy },
  list: { paddingHorizontal: 20 },
  row: {
    minHeight: 54,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f2f5",
  },
  rowText: { fontSize: 15, color: colors.navy },
  rowTextActive: { fontWeight: "800", color: colors.brand },
});
