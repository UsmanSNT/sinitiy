import { Pressable, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { MainTabParamList, RootStackParamList } from "../navigation/types";
import { HomeTabIcon, ServicesTabIcon, CommunityTabIcon, MyPageTabIcon } from "./TabIcons";
import { useTabBarMetrics } from "../lib/useTabBarMetrics";
import { colors } from "../theme";

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

const tabs = Object.keys(labels) as Array<keyof MainTabParamList>;

interface Props {
  // Ushbu ekran mantiqan qaysi pastki menyu bo'limiga tegishli ekanini bildiradi
  // (MainTabs tashqarisidagi push qilingan ekranlarda ham footer bir xil ko'rinishi uchun).
  active?: keyof MainTabParamList;
}

// MainTabs.tsx dagi pastki menyu bilan bir xil ko'rinishdagi footer,
// Stack orqali Main tashqarisiga push qilingan ekranlar (JobWelfare, HealthDetail va h.k.)
// uchun ham pastki menyu doim ko'rinib turishi maqsadida ishlatiladi.
export function BottomNav({ active }: Props) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { basePad, bottomPad } = useTabBarMetrics();

  return (
    <View style={[styles.bar, { paddingTop: basePad, paddingBottom: bottomPad }]}>
      {tabs.map((tab) => {
        const isActive = tab === active;
        const color = isActive ? colors.accent : colors.gray;
        return (
          <Pressable
            key={tab}
            style={styles.item}
            accessibilityLabel={labels[tab]}
            onPress={() => navigation.navigate("Main", { screen: tab })}
          >
            {icons[tab]({ color })}
            <Text style={[styles.label, { color }]}>{labels[tab]}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#edf0f4",
    backgroundColor: colors.white,
  },
  item: { flex: 1, alignItems: "center", justifyContent: "center", gap: 2 },
  label: { fontSize: 11, fontWeight: "600", includeFontPadding: false },
});
