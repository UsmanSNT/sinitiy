import { MaterialCommunityIcons } from "@expo/vector-icons";

interface Props {
  color: string;
  size?: number;
}

export const HomeTabIcon = ({ color, size = 22 }: Props) => (
  <MaterialCommunityIcons name="home-variant-outline" size={size} color={color} />
);

export const ServicesTabIcon = ({ color, size = 22 }: Props) => (
  <MaterialCommunityIcons name="view-grid-outline" size={size} color={color} />
);

// Home kartasidagi (커뮤니티) bilan bir xil ikon - Footer va Home mos kelishi uchun.
export const CommunityTabIcon = ({ color, size = 22 }: Props) => (
  <MaterialCommunityIcons name="account-group-outline" size={size} color={color} />
);

export const MyPageTabIcon = ({ color, size = 22 }: Props) => (
  <MaterialCommunityIcons name="account-circle-outline" size={size} color={color} />
);
