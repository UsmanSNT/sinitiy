/**
 * Sinity - senior integrated info platform mobile app
 * @format
 */

import { NavigationContainer } from "@react-navigation/native";
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
import { PartnerInfoScreen } from "./src/screens/PartnerInfoScreen";
import { PartnerDetailScreen } from "./src/screens/PartnerDetailScreen";
import { InterestSettingsScreen } from "./src/screens/InterestSettingsScreen";
import { NotificationSettingsScreen } from "./src/screens/NotificationSettingsScreen";
import { CustomerCenterScreen } from "./src/screens/CustomerCenterScreen";
import type { RootStackParamList } from "./src/navigation/types";

const Stack = createNativeStackNavigator<RootStackParamList>();

function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StatusBar barStyle="light-content" />
        <NavigationContainer>
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
            <Stack.Screen name="PartnerInfo" component={PartnerInfoScreen} />
            <Stack.Screen name="PartnerDetail" component={PartnerDetailScreen} />
            <Stack.Screen name="InterestSettings" component={InterestSettingsScreen} />
            <Stack.Screen name="NotificationSettings" component={NotificationSettingsScreen} />
            <Stack.Screen name="CustomerCenter" component={CustomerCenterScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

export default App;
