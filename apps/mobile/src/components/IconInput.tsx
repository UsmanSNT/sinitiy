import { TextInput, TextInputProps, View, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "../theme";

const iconNames = {
  user: "person-outline",
  phone: "smartphone",
  lock: "lock-outline",
  mail: "mail-outline",
  business: "business",
  badge: "badge",
} as const;

const chevron = <MaterialIcons name="chevron-right" size={20} color="#d1d5db" />;

interface IconInputProps extends TextInputProps {
  icon: keyof typeof iconNames;
  showChevron?: boolean;
}

export function IconInput({ icon, showChevron = true, style, ...props }: IconInputProps) {
  return (
    <View style={styles.wrapper}>
      <MaterialIcons name={iconNames[icon]} size={20} color={colors.gray} />
      <TextInput
        {...props}
        placeholderTextColor={colors.gray}
        style={[styles.input, style]}
      />
      {showChevron && chevron}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 4,
    backgroundColor: colors.white,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: colors.navy,
    paddingVertical: 12,
    // Veb brauzerda standart qora "focus" chegarasini olib tashlash.
    outlineStyle: "none" as any,
    outlineWidth: 0 as any,
  },
});
