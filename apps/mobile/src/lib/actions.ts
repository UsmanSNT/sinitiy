import { Alert, Linking } from "react-native";

// Hali ulanmagan funksiyalar (SNS login, qidiruv va h.k.) bosilganda javobsiz qolmasligi uchun.
export function comingSoon() {
  Alert.alert("안내", "준비 중인 기능입니다.");
}

// E'londa alohida havola yo'q - "신청하기" topshirish tartibini ko'rsatib, qo'ng'iroq qilishni taklif qiladi.
export function showApplyInfo(applyMethod: string | undefined, phone: string) {
  Alert.alert("신청 방법", applyMethod ?? "문의 전화로 신청 방법을 확인해주세요.", [
    { text: "닫기", style: "cancel" },
    { text: "전화하기", onPress: () => Linking.openURL(`tel:${phone}`) },
  ]);
}
