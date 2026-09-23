import { MaterialIcons } from "@expo/vector-icons";
import { FamilyIcon } from "./HomeIcons";

interface Props {
  color: string;
  size?: number;
}

// Android'da ikon-shrift harflari o'z chegarasi ichida tepa/pastga nosimmetrik bo'sh joy
// bilan chiziladi - includeFontPadding:false shu zaxirani olib tashlab, ikonni tugma
// markaziga vizual jihatdan aniq joylashtiradi (HomeIcons.tsx dagi bilan bir xil sabab).
const iconStyle = { includeFontPadding: false } as const;

export const HomeTabIcon = ({ color, size = 22 }: Props) => (
  <MaterialIcons name="home" size={size} color={color} style={iconStyle} />
);

export const ServicesTabIcon = ({ color, size = 22 }: Props) => (
  <MaterialIcons name="widgets" size={size} color={color} style={iconStyle} />
);

// Home kartasidagi (커뮤니티) bilan bir xil ikon - Footer va Home mos kelishi uchun.
export const CommunityTabIcon = ({ color, size = 22 }: Props) => (
  <FamilyIcon color={color} size={size} />
);

export const MyPageTabIcon = ({ color, size = 22 }: Props) => (
  <MaterialIcons name="person" size={size} color={color} style={iconStyle} />
);
