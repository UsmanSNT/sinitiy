import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { api } from "./api";
import { Notifications } from "./notifications";

const TOKEN_KEY = "sinity_push_token";

// Ilova ochiq paytida ham xabar tepada ko'rinadi.
Notifications?.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

// Push token olib serverga yuboradi. Quyidagi hollarda jimgina null qaytaradi (ilova buzilmaydi):
// - ruxsat berilmagan;
// - EAS projectId yo'q (hali `eas init` qilinmagan);
// - Expo Go (Android, SDK 53+) masofaviy push'ni qo'llamaydi - faqat dev/production build'da ishlaydi.
export async function registerPushToken(): Promise<string | null> {
  try {
    if (!Notifications) return null;

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "시니티 알림",
        importance: Notifications.AndroidImportance.DEFAULT,
      });
    }

    let { status } = await Notifications.getPermissionsAsync();
    if (status !== "granted") status = (await Notifications.requestPermissionsAsync()).status;
    if (status !== "granted") return null;

    const projectId = Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;
    if (!projectId) return null;

    const { data: token } = await Notifications.getExpoPushTokenAsync({ projectId });
    await api.post("/me/push-token", { token, platform: Platform.OS });
    await AsyncStorage.setItem(TOKEN_KEY, token);
    return token;
  } catch (err) {
    console.log("[push] ro'yxatdan o'tmadi:", (err as Error)?.message);
    return null;
  }
}

// Logout'dan OLDIN chaqiriladi (serverga hali login bilan murojaat qilinadi).
export async function unregisterPushToken() {
  try {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    if (!token) return;
    await api.delete(`/me/push-token?token=${encodeURIComponent(token)}`);
    await AsyncStorage.removeItem(TOKEN_KEY);
  } catch {
    // Server javob bermasa ham logout to'xtamasligi kerak.
  }
}
