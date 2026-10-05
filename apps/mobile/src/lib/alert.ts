import { Alert as NativeAlert, Platform } from "react-native";
import type { AlertButton } from "react-native";

// react-native-web'da Alert.alert umuman ishlamaydi (hech narsa chiqmaydi, onPress ham chaqirilmaydi).
// Veb'da window.alert/confirm ishlatiladi; mobilda oddiy native Alert. Imzosi Alert.alert bilan bir xil.
function webAlert(title: string, message?: string, buttons?: AlertButton[]) {
  const text = message ? `${title}

${message}` : title;
  const actions = buttons ?? [];
  const cancel = actions.find((b) => b.style === "cancel");
  const others = actions.filter((b) => b !== cancel);
  if (others.length === 0) {
    window.alert(text);
    cancel?.onPress?.();
    return;
  }
  // Tasdiqlash: OK -> asosiy (oxirgi) tugma, Cancel -> bekor qilish tugmasi.
  const primary = others[others.length - 1];
  if (window.confirm(`${text}

[${primary.text}]`)) primary.onPress?.();
  else cancel?.onPress?.();
}

export const Alert = {
  alert(title: string, message?: string, buttons?: AlertButton[]) {
    if (Platform.OS === "web") webAlert(title, message, buttons);
    else NativeAlert.alert(title, message, buttons);
  },
};
