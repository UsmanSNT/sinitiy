import { Linking } from "react-native";
import { Alert } from "./alert";

// Hali ulanmagan funksiyalar (SNS login, qidiruv va h.k.) bosilganda javobsiz qolmasligi uchun.
export function comingSoon() {
  Alert.alert("안내", "준비 중인 기능입니다.");
}

// "신청하기": e'londa tashqi havola bo'lsa to'g'ridan-to'g'ri ochadi; bo'lmasa topshirish tartibini ko'rsatib,
// qo'ng'iroq qilishni taklif qiladi.
export function showApplyInfo(applyMethod: string | undefined, phone: string, applyUrl?: string) {
  if (applyUrl) {
    Alert.alert("신청 방법", `${applyMethod ?? "온라인 신청"}

신청 페이지로 이동합니다.`, [
      { text: "닫기", style: "cancel" },
      { text: "신청 페이지 열기", onPress: () => Linking.openURL(applyUrl) },
    ]);
    return;
  }
  Alert.alert("신청 방법", applyMethod ?? "문의 전화로 신청 방법을 확인해주세요.", [
    { text: "닫기", style: "cancel" },
    { text: "전화하기", onPress: () => Linking.openURL(`tel:${phone}`) },
  ]);
}
