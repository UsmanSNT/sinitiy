import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import type { MainTabParamList } from "./types";
import { HomeScreen } from "../screens/HomeScreen";
import { ServicesScreen } from "../screens/ServicesScreen";
import { CommunityScreen } from "../screens/CommunityScreen";
import { MyPageScreen } from "../screens/MyPageScreen";
import { HomeTabIcon, ServicesTabIcon, CommunityTabIcon, MyPageTabIcon } from "../components/TabIcons";
import { useTabBarMetrics } from "../lib/useTabBarMetrics";
import { colors } from "../theme";

const Tab = createBottomTabNavigator<MainTabParamList>();

const icons: Record<keyof MainTabParamList, (props: { color: string }) => React.ReactElement> = {
  Home: ({ color }) => <HomeTabIcon color={color} size={22} />,
  Services: ({ color }) => <ServicesTabIcon color={color} size={22} />,
  Community: ({ color }) => <CommunityTabIcon color={color} size={22} />,
  MyPage: ({ color }) => <MyPageTabIcon color={color} size={22} />,
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
        tabBarLabelStyle: { fontSize: 11, fontWeight: "600", includeFontPadding: false },
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
