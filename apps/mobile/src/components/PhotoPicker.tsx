import { useState } from "react";
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { imageUri, uploadImage } from "../lib/api";
import { colors } from "../theme";

interface Props {
  images: string[];
  onChange: (images: string[]) => void;
  onError: (message: string) => void;
  max?: number;
}

// Rasm tanlash + serverga yuklash (jamiyat posti, e'lon va reklama formalari uchun umumiy).
export function PhotoPicker({ images, onChange, onError, max = 3 }: Props) {
  const [uploading, setUploading] = useState(false);

  async function pickImage() {
    if (images.length >= max || uploading) return;
    try {
      const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], quality: 0.6, base64: true });
      const asset = result.canceled ? null : result.assets[0];
      if (!asset) return;
      if (!asset.base64) throw new Error("이미지를 불러오지 못했습니다");
      setUploading(true);
      const path = await uploadImage(asset.base64, asset.mimeType ?? "image/jpeg");
      onChange([...images, path]);
    } catch (err: any) {
      onError(err?.message ?? "이미지 업로드에 실패했습니다");
    } finally {
      setUploading(false);
    }
  }

  return (
    <View style={styles.row}>
      {images.map((path) => (
        <View key={path} style={styles.box}>
          <Image source={{ uri: imageUri(path) }} style={styles.photo} />
          <Pressable accessibilityLabel="사진 삭제" hitSlop={8} onPress={() => onChange(images.filter((p) => p !== path))} style={styles.remove}>
            <MaterialIcons name="close" size={16} color={colors.white} />
          </Pressable>
        </View>
      ))}
      {images.length < max && (
        <Pressable onPress={pickImage} disabled={uploading} style={[styles.box, styles.add]}>
          {uploading ? (
            <ActivityIndicator color={colors.brand} />
          ) : (
            <>
              <MaterialIcons name="add-a-photo" size={26} color={colors.brand} />
              <Text style={styles.addText}>사진 {images.length}/{max}</Text>
            </>
          )}
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 14 },
  box: { width: 96, height: 96, borderRadius: 14, overflow: "visible" },
  photo: { width: 96, height: 96, borderRadius: 14, backgroundColor: "#eef1f5" },
  remove: { position: "absolute", top: -6, right: -6, width: 24, height: 24, borderRadius: 12, backgroundColor: "#4b5563", alignItems: "center", justifyContent: "center" },
  add: { borderWidth: 1, borderColor: colors.border, borderStyle: "dashed", alignItems: "center", justifyContent: "center", gap: 4 },
  addText: { fontSize: 13, color: colors.gray },
});
