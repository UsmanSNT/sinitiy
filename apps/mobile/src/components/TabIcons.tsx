import Svg, { Path, Circle, Rect } from "react-native-svg";
import { FamilyIcon } from "./HomeIcons";

interface Props {
  color: string;
  size?: number;
}

export const HomeTabIcon = ({ color, size = 22 }: Props) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
    <Path d="m3 11 9-7 9 7" />
    <Path d="M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9" />
  </Svg>
);

export const ServicesTabIcon = ({ color, size = 22 }: Props) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
    <Rect x={4} y={5} width={6} height={6} rx={1.6} />
    <Rect x={14} y={5} width={6} height={6} rx={1.6} />
    <Rect x={4} y={15} width={6} height={6} rx={1.6} />
    <Rect x={14} y={15} width={6} height={6} rx={1.6} />
  </Svg>
);

// Home kartasidagi (FamilyIcon) bilan bir xil ikon - Footer va Home mos kelishi uchun.
export const CommunityTabIcon = ({ color, size = 22 }: Props) => <FamilyIcon color={color} size={size} />;

export const MyPageTabIcon = ({ color, size = 22 }: Props) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round">
    <Circle cx={12} cy={8} r={4} />
    <Path d="M4 20c0-4 3.5-6 8-6s8 2 8 6" />
  </Svg>
);
