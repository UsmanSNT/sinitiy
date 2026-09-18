import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import type { MainTabParamList } from "./types";
import { HomeScreen } from "../screens/HomeScreen";
import { ServicesScreen } from "../screens/ServicesScreen";
import { CommunityScreen } from "../screens/CommunityScreen";
import { MyPageScreen } from "../screens/MyPageScreen";
import { HomeTabIcon, ServicesTabIcon, CommunityTabIcon, MyPageTabIcon } from "../components/TabIcons";
import { colors } from "../theme";

const Tab = createBottomTabNavigator<MainTabParamList>();

const icons: Record<keyof MainTabParamList, (props: { color: string }) => React.ReactElement> = {
  Home: ({ color }) => <HomeTabIcon color={color} />,
  Services: ({ color }) => <ServicesTabIcon color={color} />,
  Community: ({ color }) => <CommunityTabIcon color={color} />,
  MyPage: ({ color }) => <MyPageTabIcon color={color} />,
};

const labels: Record<keyof MainTabParamList, string> = {
  Home: "홈",
  Services: "서비스",
  Community: "커뮤니티",
  MyPage: "마이페이지",
};

export function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.gray,
        tabBarLabel: labels[route.name as keyof MainTabParamList],
        tabBarIcon: ({ color }) => icons[route.name as keyof MainTabParamList]({ color }),
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Services" component={ServicesScreen} />
      <Tab.Screen name="Community" component={CommunityScreen} />
      <Tab.Screen name="MyPage" component={MyPageScreen} />
    </Tab.Navigator>
  );
}
