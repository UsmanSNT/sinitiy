import { StyleSheet, Text } from "react-native";

type Props = { loading: boolean; error: boolean; empty: boolean };

export function ListState({ loading, error, empty }: Props) {
  if (loading) return <Text style={styles.text}>불러오는 중...</Text>;
  if (error) return <Text style={styles.text}>목록을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.</Text>;
  if (empty) return <Text style={styles.text}>등록된 정보가 없습니다.</Text>;
  return null;
}

const styles = StyleSheet.create({
  text: { textAlign: "center", color: "#8390a2", fontSize: 14, lineHeight: 20, marginTop: 40, paddingHorizontal: 20 },
});
