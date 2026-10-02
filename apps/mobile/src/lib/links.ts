import { Alert, Linking } from "react-native";

async function open(url: string, failMessage: string) {
  try {
    await Linking.openURL(url);
  } catch {
    Alert.alert("안내", failMessage);
  }
}

// Bazada homepage "example.com" yoki "www.example.com" ko'rinishida ham bo'lishi mumkin -
// sxemasiz bo'lsa openURL xato beradi, shuning uchun https:// qo'shiladi.
export function openHomepage(homepage: string) {
  const url = /^https?:\/\//i.test(homepage.trim()) ? homepage.trim() : `https://${homepage.trim()}`;
  return open(url, "홈페이지를 열 수 없습니다.");
}

export function callPhone(phone: string) {
  return open(`tel:${phone.replace(/[^\d+]/g, "")}`, "전화를 걸 수 없습니다.");
}

// Koordinata bo'lmagani uchun manzil matni bo'yicha qidiriladi; Android'da Google Maps
// ilovasi bo'lsa shu ochiladi, bo'lmasa brauzerda.
export function openMap(address: string) {
  return open(
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`,
    "지도를 열 수 없습니다."
  );
}
