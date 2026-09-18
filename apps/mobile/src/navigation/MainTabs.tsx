import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { MainTabParamList } from "./types";
import { HomeScreen } from "../screens/HomeScreen";
import { ServicesScreen } from "../screens/ServicesScreen";
import { CommunityScreen } from "../screens/CommunityScreen";
import { MyPageScreen } from "../screens/MyPageScreen";
import { HomeTabIcon, ServicesTabIcon, CommunityTabIcon, MyPageTabIcon } from "../components/TabIcons";
import { colors } from "../theme";

const Tab = createBottomTabNavigator<MainTabParamList>();

const icons: Record<keyof MainTabParamList, (props: { color: string }) => React.ReactElement> = {
  Home: ({ color }) => <HomeTabIcon color={color} size={24} />,
  Services: ({ color }) => <ServicesTabIcon color={color} size={24} />,
  Community: ({ color }) => <CommunityTabIcon color={color} size={24} />,
  MyPage: ({ color }) => <MyPageTabIcon color={color} size={24} />,
};

const labels: Record<keyof MainTabParamList, string> = {
  Home: "홈",
  Services: "서비스",
  Community: "커뮤니티",
  MyPage: "마이페이지",
};

export function MainTabs() {
  // Mobil qurilmaning o'z tugmalar paneli (home indicator/nav bar)dan
  // yuqoriroqqa chiqishi uchun xavfsiz zona (safe area) hisobga olinadi.
  const insets = useSafeAreaInsets();
  const bottomPad = Math.max(insets.bottom, 12);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.gray,
        tabBarLabel: labels[route.name as keyof MainTabParamList],
        tabBarIcon: ({ color }) => icons[route.name as keyof MainTabParamList]({ color }),
        tabBarLabelStyle: { fontSize: 12, fontWeight: "600" },
        tabBarStyle: {
          height: 58 + bottomPad,
          paddingTop: 8,
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
