import { TextInput, TextInputProps, View, StyleSheet } from "react-native";
import Svg, { Circle, Path, Rect } from "react-native-svg";
import { colors } from "../theme";

const icons = {
  user: (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={colors.gray} strokeWidth={1.8}>
      <Circle cx={12} cy={8} r={4} />
      <Path d="M4 20c0-4 3.5-6 8-6s8 2 8 6" />
    </Svg>
  ),
  phone: (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={colors.gray} strokeWidth={1.8}>
      <Rect x={7} y={2} width={10} height={20} rx={2} />
      <Path d="M11 18h2" />
    </Svg>
  ),
  lock: (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={colors.gray} strokeWidth={1.8}>
      <Rect x={5} y={11} width={14} height={9} rx={2} />
      <Path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </Svg>
  ),
  mail: (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={colors.gray} strokeWidth={1.8}>
      <Rect x={3} y={5} width={18} height={14} rx={2} />
      <Path d="m3 7 9 6 9-6" />
    </Svg>
  ),
};

const chevron = (
  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth={2}>
    <Path d="m9 6 6 6-6 6" />
  </Svg>
);

interface IconInputProps extends TextInputProps {
  icon: keyof typeof icons;
  showChevron?: boolean;
}

export function IconInput({ icon, showChevron = true, style, ...props }: IconInputProps) {
  return (
    <View style={styles.wrapper}>
      {icons[icon]}
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
