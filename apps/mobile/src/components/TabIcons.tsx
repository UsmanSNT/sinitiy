import { MaterialIcons } from "@expo/vector-icons";
import { FamilyIcon } from "./HomeIcons";

interface Props {
  color: string;
  size?: number;
}

export const HomeTabIcon = ({ color, size = 22 }: Props) => (
  <MaterialIcons name="home" size={size} color={color} />
);

export const ServicesTabIcon = ({ color, size = 22 }: Props) => (
  <MaterialIcons name="widgets" size={size} color={color} />
);

// Home kartasidagi (커뮤니티) bilan bir xil ikon - Footer va Home mos kelishi uchun.
export const CommunityTabIcon = ({ color, size = 22 }: Props) => (
  <FamilyIcon color={color} size={size} />
);

export const MyPageTabIcon = ({ color, size = 22 }: Props) => (
  <MaterialIcons name="person" size={size} color={color} />
);
