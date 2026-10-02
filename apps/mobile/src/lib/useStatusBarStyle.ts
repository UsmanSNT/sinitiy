import { useCallback } from "react";
import { StatusBar } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

// Ekran fokus olganda status bar belgilarini fonga moslaydi: to'q fonda oq, och fonda to'q belgilar.
// (Global holat "light-content"; har ekran o'zinikini o'rnatgani uchun orqaga qaytganda ham to'g'ri bo'ladi.)
export function useStatusBarStyle(style: "light-content" | "dark-content") {
  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle(style);
    }, [style])
  );
}
