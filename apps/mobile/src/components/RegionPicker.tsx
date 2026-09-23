import { useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { KOREA_REGIONS } from "@sinity/shared";
import { colors } from "../theme";

interface Props {
  visible: boolean;
  // Tanlangan qiymat: null (전체지역), yoki "{시/도}" (butun shahar/viloyat),
  // yoki "{시/도} {시군구}" (aniq tuman) ko'rinishida.
  value: string | null;
  onSelect: (region: string | null) => void;
  onClose: () => void;
}

// Ikki bosqichli (시/도 -> 시군구) hudud tanlash oynasi. Ma'lumot packages/shared/src/koreaRegions.ts
// dan olinadi - shu bilan yaratish formasi (ListingFormScreen) va ko'rish/filtr ekranlari bir xil,
// izchil hudud nomlaridan foydalanadi.
export function RegionPicker({ visible, value, onSelect, onClose }: Props) {
  const insets = useSafeAreaInsets();
  const [activeSido, setActiveSido] = useState<string | null>(null);

  function close() {
    setActiveSido(null);
    onClose();
  }

  function choose(region: string | null) {
    onSelect(region);
    close();
  }

  const sidoOfValue = value?.split(" ")[0] ?? null;
  const region = activeSido ? KOREA_REGIONS.find((r) => r.sido === activeSido) : null;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={close}>
      <Pressable style={styles.backdrop} onPress={close} />
      <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <View style={styles.header}>
          {region ? (
            <Pressable style={styles.backBtn} onPress={() => setActiveSido(null)} hitSlop={10}>
              <MaterialIcons name="chevron-left" size={26} color={colors.navy} />
              <Text style={styles.title}>{region.sido}</Text>
            </Pressable>
          ) : (
            <Text style={styles.title}>지역 선택</Text>
          )}
          <Pressable accessibilityLabel="닫기" hitSlop={12} onPress={close}>
            <MaterialIcons name="close" size={24} color={colors.navy} />
          </Pressable>
        </View>

        <ScrollView style={styles.list}>
          {!region ? (
            <>
              <Pressable style={styles.row} onPress={() => choose(null)}>
                <Text style={[styles.rowText, value === null && styles.rowTextActive]}>전체지역</Text>
                {value === null && <MaterialIcons name="check" size={20} color={colors.brand} />}
              </Pressable>
              {KOREA_REGIONS.map((r) => (
                <Pressable key={r.sido} style={styles.row} onPress={() => setActiveSido(r.sido)}>
                  <Text style={[styles.rowText, sidoOfValue === r.sido && styles.rowTextActive]}>{r.sido}</Text>
                  <MaterialIcons name="chevron-right" size={20} color="#a4adba" />
                </Pressable>
              ))}
            </>
          ) : (
            <>
              <Pressable style={styles.row} onPress={() => choose(region.sido)}>
                <Text style={[styles.rowText, value === region.sido && styles.rowTextActive]}>
                  {region.sido} 전체
                </Text>
                {value === region.sido && <MaterialIcons name="check" size={20} color={colors.brand} />}
              </Pressable>
              {region.sigungu.map((g) => {
                const full = `${region.sido} ${g}`;
                const active = value === full;
                return (
                  <Pressable key={g} style={styles.row} onPress={() => choose(full)}>
                    <Text style={[styles.rowText, active && styles.rowTextActive]}>{g}</Text>
                    {active && <MaterialIcons name="check" size={20} color={colors.brand} />}
                  </Pressable>
                );
              })}
            </>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(15,23,42,0.45)" },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    maxHeight: "75%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#edf0f4",
  },
  backBtn: { flexDirection: "row", alignItems: "center", gap: 2 },
  title: { fontSize: 17, fontWeight: "800", color: colors.navy },
  list: { paddingHorizontal: 20 },
  row: {
    minHeight: 54,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f2f5",
  },
  rowText: { fontSize: 15, color: colors.navy },
  rowTextActive: { fontWeight: "800", color: colors.brand },
});
