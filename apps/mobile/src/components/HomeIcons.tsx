import { MaterialCommunityIcons, FontAwesome5, MaterialIcons } from "@expo/vector-icons";

interface IconProps {
  color?: string;
  size?: number;
}

// Barcha ikonlar @expo/vector-icons (MaterialCommunityIcons) - tayyor, professional ikon
// to'plamidan olingan, qo'lda chizilmagan.

// Android'da ikon-shrift (icon font) harflari o'z chegarasi ichida tepa/pastga nosimmetrik
// bo'sh joy bilan chiziladi (font descender uchun zaxira), shu sabab ikon vizual jihatdan
// markazdan siljib ko'rinadi - includeFontPadding:false shu zaxirani olib tashlaydi.
const iconStyle = { includeFontPadding: false } as const;

export const BellIcon = ({ color = "#ffffff", size = 20 }: IconProps) => (
  <MaterialCommunityIcons name="bell-outline" size={size} color={color} style={iconStyle} />
);

export const BriefcaseIcon = ({ color = "#3fae5c", size = 20 }: IconProps) => (
  <MaterialIcons name="business-center" size={size} color={color} style={iconStyle} />
);

export const HeartbeatIcon = ({ color = "#3d5ee1", size = 20 }: IconProps) => (
  <FontAwesome5 name="heartbeat" size={size} color={color} style={iconStyle} />
);

export const FamilyIcon = ({ color = "#e2536b", size = 20 }: IconProps) => (
  <MaterialIcons name="diversity-1" size={size} color={color} style={iconStyle} />
);

export const MegaphoneIcon = ({ color = "#e08a2b", size = 20 }: IconProps) => (
  <MaterialIcons name="campaign" size={size} color={color} style={iconStyle} />
);
