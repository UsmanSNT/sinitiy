import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import type { RootStackParamList } from "../navigation/types";
import { colors } from "../theme";

type Props = NativeStackScreenProps<RootStackParamList, "Notifications">;
type NoticeTag = "행사" | "공지" | "매체";
type NoticeItem = {
  id: string;
  tag: NoticeTag;
  title: string;
  date: string;
  unread: boolean;
};

const tagColors: Record<NoticeTag, string> = {
  행사: "#3d5ee1",
  공지: colors.accent,
  매체: "#e08a2b",
};

const initialNotices: NoticeItem[] = [
  { id: "1", tag: "행사", title: "시니티 요가 교실 참여자 모집", date: "05.20", unread: true },
  { id: "2", tag: "공지", title: "건강검진 지원 안내", date: "05.18", unread: true },
  { id: "3", tag: "매체", title: "동네모임 new 글이 올라왔어요!", date: "05.17", unread: true },
  { id: "4", tag: "행사", title: "시니어 스마트폰 교육 신청 마감 안내", date: "05.15", unread: false },
  { id: "5", tag: "공지", title: "시니어 교통카드 지원 일정 변경", date: "05.12", unread: false },
  { id: "6", tag: "매체", title: "관심 지역의 새 글이 등록되었습니다", date: "05.10", unread: false },
];

export function NotificationsScreen({ navigation }: Props) {
  const [notices, setNotices] = useState(initialNotices);

  function markAllRead() {
    setNotices((current) => current.map((item) => ({ ...item, unread: false })));
  }

  function markRead(id: string) {
    setNotices((current) => current.map((item) => (item.id === id ? { ...item, unread: false } : item)));
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <Pressable accessibilityLabel="뒤로" hitSlop={12} onPress={() => navigation.goBack()}>
          <MaterialIcons name="chevron-left" size={28} color={colors.navy} />
        </Pressable>
        <Text style={styles.headerTitle}>알림</Text>
        <Pressable accessibilityLabel="모두 읽음" hitSlop={12} onPress={markAllRead}>
          <Text style={styles.markAll}>모두 읽음</Text>
        </Pressable>
      </View>

      {notices.length === 0 ? (
        <View style={styles.empty}>
          <MaterialIcons name="notifications-none" size={42} color="#c5ced9" />
          <Text style={styles.emptyTitle}>새로운 알림이 없습니다</Text>
          <Text style={styles.emptyCopy}>행사·공지·매체의 새 소식이 오면 여기에 표시됩니다.</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
          {notices.map((item) => (
            <Pressable
              key={item.id}
              style={({ pressed }) => [styles.row, pressed && styles.pressed]}
              onPress={() => markRead(item.id)}
            >
              <Text style={[styles.tag, { color: tagColors[item.tag] }]}>{item.tag}</Text>
              <View style={styles.rowCopy}>
                <Text style={[styles.rowTitle, item.unread && styles.rowTitleUnread]} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={styles.rowDate}>{item.date}</Text>
              </View>
              {item.unread ? <View style={styles.unreadDot} /> : <View style={styles.unreadSpacer} />}
            </Pressable>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.white },
  header: { height: 52, flexDirection: "row", alignItems: "center", paddingHorizontal: 14 },
  headerTitle: { flex: 1, marginLeft: 7, fontSize: 18, fontWeight: "800", color: colors.navy },
  markAll: { fontSize: 12, fontWeight: "700", color: "#66758a" },
  list: { paddingHorizontal: 16, paddingBottom: 22 },
  row: { minHeight: 68, flexDirection: "row", alignItems: "center", borderBottomWidth: 1, borderBottomColor: "#edf0f4", paddingVertical: 12 },
  pressed: { opacity: 0.7 },
  tag: { width: 34, fontSize: 12, fontWeight: "800" },
  rowCopy: { flex: 1, minWidth: 0, paddingHorizontal: 8 },
  rowTitle: { fontSize: 13, fontWeight: "600", color: colors.navy },
  rowTitleUnread: { fontWeight: "800" },
  rowDate: { marginTop: 5, fontSize: 11, color: "#8390a2" },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#3d5ee1" },
  unreadSpacer: { width: 8, height: 8 },
  empty: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 32 },
  emptyTitle: { marginTop: 12, fontSize: 15, fontWeight: "800", color: colors.navy },
  emptyCopy: { marginTop: 6, fontSize: 12, color: "#8995a5", textAlign: "center", lineHeight: 18 },
});
