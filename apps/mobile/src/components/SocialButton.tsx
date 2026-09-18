import { Pressable, StyleSheet, Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";

interface SocialButtonProps {
  icon: React.ReactNode;
  label: string;
  bg: string;
  color: string;
  bordered?: boolean;
  onPress?: () => void;
}

export function SocialButton({ icon, label, bg, color, bordered, onPress }: SocialButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.button,
        { backgroundColor: bg },
        bordered && { borderWidth: 1, borderColor: "#e5e7eb" },
      ]}
    >
      <View style={styles.iconSlot}>{icon}</View>
      <Text style={[styles.label, { color }]}>{label}</Text>
    </Pressable>
  );
}

export const KakaoIcon = () => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="#391B1B">
    <Path d="M12 3C6.48 3 2 6.48 2 10.8c0 2.7 1.78 5.08 4.47 6.47-.2.72-.72 2.6-.82 3-.13.5.18.5.38.36.16-.1 2.5-1.7 3.53-2.4.79.12 1.6.18 2.44.18 5.52 0 10-3.48 10-7.8S17.52 3 12 3Z" />
  </Svg>
);

export const NaverIcon = () => (
  <Svg width={16} height={16} viewBox="0 0 24 24" fill="white">
    <Path d="M13.6 12.4 8.9 5H5v14h4.4v-7.4l4.7 7.4H18V5h-4.4v7.4Z" />
  </Svg>
);

export const GoogleIcon = () => (
  <Svg width={18} height={18} viewBox="0 0 24 24">
    <Path fill="#4285F4" d="M21.6 12.23c0-.68-.06-1.36-.17-2H12v3.79h5.4a4.62 4.62 0 0 1-2 3.03v2.5h3.23c1.9-1.75 2.97-4.32 2.97-7.32Z" />
    <Path fill="#34A853" d="M12 22c2.7 0 4.96-.9 6.62-2.44l-3.23-2.5c-.9.6-2.05.96-3.4.96-2.6 0-4.8-1.76-5.6-4.13H3.06v2.6A10 10 0 0 0 12 22Z" />
    <Path fill="#FBBC05" d="M6.4 13.9a6 6 0 0 1 0-3.8v-2.6H3.06a10 10 0 0 0 0 9l3.34-2.6Z" />
    <Path fill="#EA4335" d="M12 6.6c1.47 0 2.79.5 3.82 1.5l2.87-2.87C16.95 3.5 14.7 2.5 12 2.5a10 10 0 0 0-8.94 5.5l3.34 2.6c.8-2.37 3-4 5.6-4Z" />
  </Svg>
);

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999,
    paddingVertical: 13,
  },
  iconSlot: { position: "absolute", left: 16 },
  label: { fontSize: 14, fontWeight: "700" },
});
