import Svg, { Path, Circle } from "react-native-svg";

export const BellIcon = ({ color = "#ffffff", size = 20 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
    <Path d="M13.7 21a2 2 0 0 1-3.4 0" />
  </Svg>
);

export const BriefcaseIcon = ({ color = "#3fae5c", size = 20 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M4 8h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z" />
    <Path d="M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <Path d="M3 13h18" />
    <Path d="M11 13.2h2v1.6h-2z" fill={color} />
  </Svg>
);

// Yurak + puls chizig'i: yurak to'liq rangda, puls chizig'i oq.
export const HeartbeatIcon = ({ color = "#3d5ee1", size = 20 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      d="M12 21s-7.5-4.6-10-9.3C.4 8.4 2 5 5.4 5c2 0 3.4 1 4.6 2.6C11.2 6 12.6 5 14.6 5 18 5 19.6 8.4 22 11.7 19.5 16.4 12 21 12 21Z"
      fill={color}
    />
    <Path
      d="M3.5 12.3h3l1.3-3 2 6.4 1.7-4.4 1 1h4"
      fill="none"
      stroke="#ffffff"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Oila/hamjamiyat ikonkasi: yurak + uch kishi - Home kartasi va Footer'da bir xil ishlatiladi.
export const FamilyIcon = ({ color = "#e2536b", size = 20 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M12 3.3c-1.9-1.7-4.8-.9-5.4 1.5C6 7.2 7.7 9 12 11.2c4.3-2.2 6-4 5.4-6.4-.6-2.4-3.5-3.2-5.4-1.5Z" />
    <Circle cx={7} cy={16} r={2} />
    <Circle cx={17} cy={16} r={2} />
    <Circle cx={12} cy={17} r={2.2} />
    <Path d="M3.5 21c0-2.4 1.6-3.8 3.5-3.8" />
    <Path d="M20.5 21c0-2.4-1.6-3.8-3.5-3.8" />
    <Path d="M8 21c0-2.6 1.8-4.2 4-4.2s4 1.6 4 4.2" />
  </Svg>
);

export const MegaphoneIcon = ({ color = "#e08a2b", size = 20 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M3 11v2a2 2 0 0 0 2 2h1l1 5h2l-1-5h2l7 4V6l-7 4H5a2 2 0 0 0-2 2Z" />
    <Path d="M17 9.5v5" />
    <Path d="M20.5 8.5a5 5 0 0 1 0 7" opacity={0.7} />
    <Path d="M22.5 6.5a8 8 0 0 1 0 11" opacity={0.4} />
  </Svg>
);
