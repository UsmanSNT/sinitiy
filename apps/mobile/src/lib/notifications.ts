import { Platform } from "react-native";
import Constants, { ExecutionEnvironment } from "expo-constants";
import type * as NotificationsType from "expo-notifications";

// Expo Go (Android, SDK 53+) expo-notifications'ni import qilishning o'zidayoq xato beradi va butun
// ilovani yiqitadi. Shuning uchun modul faqat dev/production build'da (va Expo Go bo'lmagan muhitda)
// yuklanadi; Expo Go va web'da null - push o'chiq, qolgan ilova odatdagidek ishlaydi.
export const pushSupported = Platform.OS !== "web" && Constants.executionEnvironment !== ExecutionEnvironment.StoreClient;

export const Notifications: typeof NotificationsType | null = pushSupported
  ? (require("expo-notifications") as typeof NotificationsType)
  : null;

// Hook shartli chaqirilmasligi uchun doimiy qiymatga qarab tanlanadi (ilova umri davomida o'zgarmaydi).
export const useLastNotificationResponse: () => NotificationsType.NotificationResponse | null | undefined =
  Notifications ? Notifications.useLastNotificationResponse : () => null;
