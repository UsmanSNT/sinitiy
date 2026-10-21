import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import type { MainTabParamList } from "./types";
import { HomeScreen } from "../screens/HomeScreen";
import { ServicesScreen } from "../screens/ServicesScreen";
import { CommunityScreen } from "../screens/CommunityScreen";
import { MyPageScreen } from "../screens/MyPageScreen";
import { HomeTabIcon, ServicesTabIcon, CommunityTabIcon, MyPageTabIcon } from "../components/TabIcons";
import { TAB_ICON_SIZE, TAB_LABEL_LINE, TAB_LABEL_SIZE, useTabBarMetrics } from "../lib/useTabBarMetrics";
import { colors } from "../theme";

const Tab = createBottomTabNavigator<MainTabParamList>();

const icons: Record<keyof MainTabParamList, (props: { color: string }) => React.ReactElement> = {
  Home: ({ color }) => <HomeTabIcon color={color} size={TAB_ICON_SIZE} />,
  Services: ({ color }) => <ServicesTabIcon color={color} size={TAB_ICON_SIZE} />,
  Community: ({ color }) => <CommunityTabIcon color={color} size={TAB_ICON_SIZE} />,
  MyPage: ({ color }) => <MyPageTabIcon color={color} size={TAB_ICON_SIZE} />,
};

const labels: Record<keyof MainTabParamList, string> = {
  Home: "홈",
  Services: "서비스",
  Community: "커뮤니티",
  MyPage: "마이페이지",
};

export function MainTabs() {
  const { basePad, bottomPad, height } = useTabBarMetrics();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.gray,
        tabBarLabel: labels[route.name as keyof MainTabParamList],
        tabBarIcon: ({ color }) => icons[route.name as keyof MainTabParamList]({ color }),
        tabBarLabelStyle: { fontSize: TAB_LABEL_SIZE, lineHeight: TAB_LABEL_LINE, fontWeight: "700", includeFontPadding: false },
        tabBarStyle: {
          height,
          paddingTop: basePad,
          paddingBottom: bottomPad,
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Services" component={ServicesScreen} />
      <Tab.Screen name="Community" component={CommunityScreen} />
      <Tab.Screen name="MyPage" component={MyPageScreen} />
    </Tab.Navigator>
  );
}
