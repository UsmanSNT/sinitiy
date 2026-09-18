import { MaterialCommunityIcons } from "@expo/vector-icons";

interface IconProps {
  color?: string;
  size?: number;
}

// Barcha ikonlar @expo/vector-icons (MaterialCommunityIcons) - tayyor, professional ikon
// to'plamidan olingan, qo'lda chizilmagan.

export const BellIcon = ({ color = "#ffffff", size = 20 }: IconProps) => (
  <MaterialCommunityIcons name="bell-outline" size={size} color={color} />
);

export const BriefcaseIcon = ({ color = "#3fae5c", size = 20 }: IconProps) => (
  <MaterialCommunityIcons name="briefcase-outline" size={size} color={color} />
);

export const HeartbeatIcon = ({ color = "#3d5ee1", size = 20 }: IconProps) => (
  <MaterialCommunityIcons name="heart-pulse" size={size} color={color} />
);

export const FamilyIcon = ({ color = "#e2536b", size = 20 }: IconProps) => (
  <MaterialCommunityIcons name="account-group-outline" size={size} color={color} />
);

export const MegaphoneIcon = ({ color = "#e08a2b", size = 20 }: IconProps) => (
  <MaterialCommunityIcons name="bullhorn-outline" size={size} color={color} />
);
