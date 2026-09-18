import Svg, { Path, Circle } from "react-native-svg";

export const BellIcon = ({ color = "#ffffff", size = 20 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
    <Path d="M13.7 21a2 2 0 0 1-3.4 0" />
  </Svg>
);

export const BriefcaseIcon = ({ color = "#3d5ee1", size = 20 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M4 8h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z" />
    <Path d="M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <Path d="M3 13h18" />
  </Svg>
);

export const HeartIcon = ({ color = "#e2536b", size = 20 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 21s-7.5-4.6-10-9.3C.4 8.4 2 5 5.4 5c2 0 3.4 1 4.6 2.6C11.2 6 12.6 5 14.6 5 18 5 19.6 8.4 22 11.7 19.5 16.4 12 21 12 21Z" />
  </Svg>
);

export const PeopleIcon = ({ color = "#3fae5c", size = 20 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
    <Circle cx={9} cy={8} r={3} />
    <Path d="M2 20c0-3.3 3.1-5 7-5s7 1.7 7 5" />
    <Path d="M16 4.5a3 3 0 0 1 0 5.8" />
    <Path d="M18 20c0-2.6-1.4-4.2-3.5-4.8" />
  </Svg>
);

export const MegaphoneIcon = ({ color = "#e08a2b", size = 20 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M3 11v2a2 2 0 0 0 2 2h1l1 5h2l-1-5h2l7 4V6l-7 4H5a2 2 0 0 0-2 2Z" />
    <Path d="M17 9.5v5" />
  </Svg>
);
