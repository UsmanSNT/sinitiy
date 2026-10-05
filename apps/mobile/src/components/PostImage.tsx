import { useEffect, useState } from "react";
import { Image, Modal, Pressable, StyleSheet, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Original nisbat saqlanadi (poster/matnli rasm qirqilmaydi); bosilganda to'liq ekranda ochiladi.
// Nisbat noma'lum paytda 4:3 ko'rsatiladi, juda uzun/keng rasmlar 1:2 ~ 2:1 oralig'ida cheklanadi.
export function PostImage({ uri }: { uri: string }) {
  const [ratio, setRatio] = useState(4 / 3);
  const [open, setOpen] = useState(false);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    let alive = true;
    Image.getSize(
      uri,
      (w, h) => alive && w > 0 && h > 0 && setRatio(Math.min(Math.max(w / h, 0.5), 2)),
      () => {}
    );
    return () => {
      alive = false;
    };
  }, [uri]);

  return (
    <>
      <Pressable accessibilityLabel="이미지 크게 보기" onPress={() => setOpen(true)} style={[styles.box, { aspectRatio: ratio }]}>
        <Image source={{ uri }} style={styles.fill} resizeMode="contain" />
      </Pressable>
      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <View style={styles.backdrop}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setOpen(false)} />
          <Image source={{ uri }} style={styles.full} resizeMode="contain" />
          <Pressable accessibilityLabel="닫기" hitSlop={12} onPress={() => setOpen(false)} style={[styles.close, { top: insets.top + 12 }]}>
            <MaterialIcons name="close" size={26} color="#ffffff" />
          </Pressable>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  box: { width: "100%", borderRadius: 14, marginTop: 14, overflow: "hidden", backgroundColor: "#eef1f5" },
  fill: { width: "100%", height: "100%" },
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.92)", alignItems: "center", justifyContent: "center" },
  full: { width: "100%", height: "100%" },
  close: { position: "absolute", right: 16, width: 40, height: 40, borderRadius: 20, backgroundColor: "rgba(255,255,255,0.18)", alignItems: "center", justifyContent: "center" },
});
