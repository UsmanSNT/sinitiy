import { StyleSheet, Text, TextInput, View } from "react-native";
import { colors } from "../theme";

// "YYYY-MM-DD" - bo'sh qoldirilsa cheklovsiz. Raqam kiritilganda tire o'zi qo'yiladi (20261005 -> 2026-10-05).
export function formatDateInput(raw: string) {
  const d = raw.replace(/\D/g, "").slice(0, 8);
  if (d.length <= 4) return d;
  if (d.length <= 6) return `${d.slice(0, 4)}-${d.slice(4)}`;
  return `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6)}`;
}

function isRealDate(v: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return false;
  const d = new Date(`${v}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === v;
}

// Formani yuborishdan oldin: xato matni yoki null.
export function validateDateRange(start: string, end: string): string | null {
  if (start && !isRealDate(start)) return "시작일을 올바르게 입력해주세요 (예: 2026-10-05)";
  if (end && !isRealDate(end)) return "종료일을 올바르게 입력해주세요 (예: 2026-10-31)";
  if (start && end && start > end) return "종료일은 시작일 이후여야 합니다";
  return null;
}

interface Props {
  label: string;
  start: string;
  end: string;
  onChange: (start: string, end: string) => void;
}

export function DateRangeFields({ label, start, end, onChange }: Props) {
  return (
    <>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.row}>
        <TextInput
          value={start}
          onChangeText={(v) => onChange(formatDateInput(v), end)}
          placeholder="시작일 YYYY-MM-DD"
          placeholderTextColor={colors.gray}
          keyboardType="number-pad"
          maxLength={10}
          style={[styles.input, { outlineStyle: "none" } as any]}
        />
        <Text style={styles.tilde}>~</Text>
        <TextInput
          value={end}
          onChangeText={(v) => onChange(start, formatDateInput(v))}
          placeholder="종료일 YYYY-MM-DD"
          placeholderTextColor={colors.gray}
          keyboardType="number-pad"
          maxLength={10}
          style={[styles.input, { outlineStyle: "none" } as any]}
        />
      </View>
      <Text style={styles.hint}>비워두면 기간 제한 없이 게시됩니다. 종료일이 지나면 자동으로 숨겨집니다.</Text>
    </>
  );
}

const styles = StyleSheet.create({
  label: { marginTop: 16, marginBottom: 7, fontSize: 14, fontWeight: "800", color: colors.navy },
  row: { flexDirection: "row", alignItems: "center", gap: 8 },
  input: { flex: 1, borderWidth: 1, borderColor: "#dfe5eb", borderRadius: 8, paddingHorizontal: 12, paddingVertical: 11, fontSize: 14, color: colors.navy },
  tilde: { fontSize: 16, color: "#8390a2" },
  hint: { marginTop: 6, fontSize: 12, color: colors.gray },
});
