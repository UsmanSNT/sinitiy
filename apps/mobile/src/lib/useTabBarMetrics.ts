import { useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const CONTENT_HEIGHT = 50;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

// Pastki tab-bar/footer (MainTabs.tsx va BottomNav.tsx) uchun umumiy o'lcham hisobi.
// Bo'shliq ekran kengligining ~2%i asosida hisoblanadi (6-10px oralig'ida cheklangan) -
// shu bilan turli o'lchamdagi qurilmalarda nisbat saqlanadi, lekin kichik ekranlarda
// haddan tashqari kattalashib joy yemaydi. Tepa va baza-pastki bo'shliq bir xil -
// qurilmaning haqiqiy xavfsiz zonasi (home indicator/gesture bar) faqat pastga
// qo'shimcha sifatida qo'shiladi, shuning uchun tugma atrofi vizual muvozanatli bo'ladi.
export function useTabBarMetrics() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const basePad = Math.round(clamp(width * 0.02, 6, 10));
  const bottomPad = basePad + insets.bottom;
  return { basePad, bottomPad, height: CONTENT_HEIGHT + basePad + bottomPad };
}
