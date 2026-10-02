/**
 * Sinity - senior integrated info platform mobile app
 * @format
 */

import { useEffect } from "react";
import { NavigationContainer, createNavigationContainerRef } from "@react-navigation/native";
import type { NotificationResponse } from "expo-notifications";
import { useLastNotificationResponse } from "./src/lib/notifications";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "./src/context/AuthContext";
import { SplashScreen } from "./src/screens/SplashScreen";
import { LoginScreen } from "./src/screens/LoginScreen";
import { SignupScreen } from "./src/screens/SignupScreen";
import { MainTabs } from "./src/navigation/MainTabs";
import { PostDetailScreen } from "./src/screens/PostDetailScreen";
import { NewPostScreen } from "./src/screens/NewPostScreen";
import { JobWelfareScreen } from "./src/screens/JobWelfareScreen";
import { JobDetailScreen } from "./src/screens/JobDetailScreen";
import { HealthMedicalScreen } from "./src/screens/HealthMedicalScreen";
import { HealthDetailScreen } from "./src/screens/HealthDetailScreen";
import { EducationCultureScreen } from "./src/screens/EducationCultureScreen";
import { EducationDetailScreen } from "./src/screens/EducationDetailScreen";
import { LifeConvenienceScreen } from "./src/screens/LifeConvenienceScreen";
import { LifeConvenienceDetailScreen } from "./src/screens/LifeConvenienceDetailScreen";
import { NotificationsScreen } from "./src/screens/NotificationsScreen";
import { MyListingsScreen } from "./src/screens/MyListingsScreen";
import { ListingFormScreen } from "./src/screens/ListingFormScreen";
import { AdminListingsScreen } from "./src/screens/AdminListingsScreen";
import { AdminReportsScreen } from "./src/screens/AdminReportsScreen";
import { AdminPostsScreen } from "./src/screens/AdminPostsScreen";
import { AdminUsersScreen } from "./src/screens/AdminUsersScreen";
import { AdminAdsScreen } from "./src/screens/AdminAdsScreen";
import { AdminStatsScreen } from "./src/screens/AdminStatsScreen";
import { MyAdsScreen } from "./src/screens/MyAdsScreen";
import { AdFormScreen } from "./src/screens/AdFormScreen";
import { AdDetailScreen } from "./src/screens/AdDetailScreen";
import { PartnerInfoScreen } from "./src/screens/PartnerInfoScreen";
import { PartnerDetailScreen } from "./src/screens/PartnerDetailScreen";
import { InterestSettingsScreen } from "./src/screens/InterestSettingsScreen";
import { NotificationSettingsScreen } from "./src/screens/NotificationSettingsScreen";
import { CustomerCenterScreen } from "./src/screens/CustomerCenterScreen";
import { MyActivityScreen } from "./src/screens/MyActivityScreen";
import type { RootStackParamList } from "./src/navigation/types";

const Stack = createNativeStackNavigator<RootStackParamList>();
const navigationRef = createNavigationContainerRef<RootStackParamList>();

// Push bosilganda tegishli postga o'tadi (ilova yopiq yoki ochiq bo'lishidan qat'i nazar).
// Sovuq ishga tushishda navigatsiya hali tayyor bo'lmasligi mumkin - shuning uchun onReady'da ham urinamiz,
// bir xil bildirishnomaga ikki marta o'tmaslik uchun id bo'yicha eslab qolamiz.
let handledNotificationId: string | null = null;

function openFromNotification(response: NotificationResponse | null | undefined) {
  if (!response || !navigationRef.isReady()) return;
  const id = response.notification.request.identifier;
  if (id === handledNotificationId) return;
  const postId = response.notification.request.content.data?.postId;
  if (typeof postId !== "string") return;
  handledNotificationId = id;
  navigationRef.navigate("PostDetail", { postId });
}

function App() {
  const lastNotification = useLastNotificationResponse();
  useEffect(() => {
    openFromNotification(lastNotification);
  }, [lastNotification]);
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StatusBar barStyle="light-content" />
        <NavigationContainer ref={navigationRef} onReady={() => openFromNotification(lastNotification)}>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen name="PostDetail" component={PostDetailScreen} />
            <Stack.Screen name="NewPost" component={NewPostScreen} />
            <Stack.Screen name="JobWelfare" component={JobWelfareScreen} />
            <Stack.Screen name="JobDetail" component={JobDetailScreen} />
            <Stack.Screen name="HealthMedical" component={HealthMedicalScreen} />
            <Stack.Screen name="HealthDetail" component={HealthDetailScreen} />
            <Stack.Screen name="EducationCulture" component={EducationCultureScreen} />
            <Stack.Screen name="EducationDetail" component={EducationDetailScreen} />
            <Stack.Screen name="LifeConvenience" component={LifeConvenienceScreen} />
            <Stack.Screen name="LifeConvenienceDetail" component={LifeConvenienceDetailScreen} />
            <Stack.Screen name="Notifications" component={NotificationsScreen} />
            <Stack.Screen name="MyListings" component={MyListingsScreen} />
            <Stack.Screen name="ListingForm" component={ListingFormScreen} />
            <Stack.Screen name="AdminListings" component={AdminListingsScreen} />
            <Stack.Screen name="AdminReports" component={AdminReportsScreen} />
            <Stack.Screen name="AdminPosts" component={AdminPostsScreen} />
            <Stack.Screen name="AdminUsers" component={AdminUsersScreen} />
            <Stack.Screen name="AdminAds" component={AdminAdsScreen} />
            <Stack.Screen name="AdminStats" component={AdminStatsScreen} />
            <Stack.Screen name="MyAds" component={MyAdsScreen} />
            <Stack.Screen name="AdForm" component={AdFormScreen} />
            <Stack.Screen name="AdDetail" component={AdDetailScreen} />
            <Stack.Screen name="PartnerInfo" component={PartnerInfoScreen} />
            <Stack.Screen name="PartnerDetail" component={PartnerDetailScreen} />
            <Stack.Screen name="InterestSettings" component={InterestSettingsScreen} />
            <Stack.Screen name="NotificationSettings" component={NotificationSettingsScreen} />
            <Stack.Screen name="CustomerCenter" component={CustomerCenterScreen} />
            <Stack.Screen name="MyActivity" component={MyActivityScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

export default App;
