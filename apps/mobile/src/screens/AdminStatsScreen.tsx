import { useCallback, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppHeader } from "../components/AppHeader";
import type { AdminStats } from "@sinity/shared";
import type { RootStackParamList } from "../navigation/types";
import { api } from "../lib/api";
import { ListState } from "../components/ListState";
import { BottomNav } from "../components/BottomNav";
import { colors } from "../theme";

type Props = NativeStackScreenProps<RootStackParamList, "AdminStats">;

const CHART_HEIGHT = 96;

function StatGrid({ items }: { items: Array<{ label: string; value: number; tone?: string }> }) {
  return (
    <View style={styles.grid}>
      {items.map((item) => (
        <View key={item.label} style={styles.stat}>
          <Text style={[styles.statValue, item.tone ? { color: item.tone } : null]}>{item.value.toLocaleString("ko-KR")}</Text>
          <Text style={styles.statLabel}>{item.label}</Text>
        </View>
      ))}
    </View>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.card}>{children}</View>
    </View>
  );
}

export function AdminStatsScreen({ navigation }: Props) {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState(false);

  const load = useCallback(() => {
    setError(false);
    api.get<AdminStats>("/admin/stats").then(setStats).catch(() => setError(true));
  }, []);
  useFocusEffect(load);

  // 심사 kutayotgan ishlar: bosilsa tegishli boshqaruv ekraniga o'tadi.
  const todo = stats
    ? [
        { label: "공고 심사", value: stats.listings.pending, route: "AdminListings" as const },
        { label: "광고 심사", value: stats.ads.pending, route: "AdminAds" as const },
        { label: "신고 처리", value: stats.reports.pending, route: "AdminReports" as const },
      ]
    : [];

  const maxDaily = stats ? Math.max(1, ...stats.daily.flatMap((d) => [d.users, d.posts])) : 1;

  return (
    <SafeAreaView style={styles.safeArea} edges={[]}>
      <AppHeader />
      <View style={styles.header}>
        <Pressable accessibilityLabel="뒤로" hitSlop={12} onPress={() => navigation.goBack()}>
          <MaterialIcons name="chevron-left" size={28} color={colors.navy} />
        </Pressable>
        <Text style={styles.headerTitle}>통계</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ListState loading={stats === null && !error} error={error} empty={false} />
        {stats ? (
          <>
            <Section title="처리 대기">
              <View style={styles.todoRow}>
                {todo.map((t) => (
                  <Pressable
                    key={t.label}
                    onPress={() => navigation.navigate(t.route)}
                    style={({ pressed }) => [styles.todo, t.value > 0 && styles.todoActive, pressed && { opacity: 0.7 }]}
                  >
                    <Text style={[styles.todoValue, t.value > 0 && { color: "#d4483f" }]}>{t.value}</Text>
                    <Text style={styles.statLabel}>{t.label}</Text>
                  </Pressable>
                ))}
              </View>
            </Section>

            <Section title="회원">
              <StatGrid
                items={[
                  { label: "전체 회원", value: stats.users.total },
                  { label: "최근 7일 가입", value: stats.users.newLast7Days, tone: colors.accent },
                  { label: "일반 회원", value: stats.users.individual },
                  { label: "기관 회원", value: stats.users.organization },
                  { label: "이용 정지", value: stats.users.suspended, tone: stats.users.suspended ? "#d4483f" : undefined },
                ]}
              />
            </Section>

            <Section title="최근 7일">
              <View style={styles.legend}>
                <View style={[styles.dot, { backgroundColor: colors.brand }]} />
                <Text style={styles.legendText}>가입</Text>
                <View style={[styles.dot, { backgroundColor: colors.accent }]} />
                <Text style={styles.legendText}>게시글</Text>
              </View>
              <View style={styles.chart}>
                {stats.daily.map((d) => (
                  <View key={d.date} style={styles.chartCol}>
                    <View style={styles.bars}>
                      <View style={[styles.bar, { height: Math.max(3, (d.users / maxDaily) * CHART_HEIGHT), backgroundColor: colors.brand }]} />
                      <View style={[styles.bar, { height: Math.max(3, (d.posts / maxDaily) * CHART_HEIGHT), backgroundColor: colors.accent }]} />
                    </View>
                    <Text style={styles.chartValue}>{d.users}/{d.posts}</Text>
                    <Text style={styles.chartDay}>{d.date.slice(5).replace("-", ".")}</Text>
                  </View>
                ))}
              </View>
            </Section>

            <Section title="커뮤니티">
              <StatGrid
                items={[
                  { label: "게시글", value: stats.content.posts },
                  { label: "댓글", value: stats.content.comments },
                  { label: "좋아요", value: stats.content.likes },
                  { label: "숨김 게시글", value: stats.content.hiddenPosts },
                ]}
              />
            </Section>

            <Section title="공고 (게시 중)">
              <StatGrid
                items={[
                  { label: "전체", value: stats.listings.active },
                  { label: "일자리·복지", value: stats.listings.byType.job },
                  { label: "건강·의료", value: stats.listings.byType.health },
                  { label: "교육·문화", value: stats.listings.byType.education },
                  { label: "생활편의", value: stats.listings.byType.life },
                ]}
              />
            </Section>

            <Section title="배너 광고">
              <StatGrid
                items={[
                  { label: "게시 중", value: stats.ads.approved, tone: colors.accent },
                  { label: "심사 대기", value: stats.ads.pending },
                  { label: "반려", value: stats.ads.rejected },
                ]}
              />
            </Section>

            <Section title="푸시 알림">
              <StatGrid items={[{ label: "등록된 기기", value: stats.push.devices }]} />
            </Section>
          </>
        ) : null}
      </ScrollView>
      <BottomNav active="MyPage" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f7f8fa" },
  header: { height: 52, flexDirection: "row", alignItems: "center", paddingHorizontal: 14, backgroundColor: colors.white },
  headerTitle: { marginLeft: 7, fontSize: 20, fontWeight: "800", color: colors.navy },
  content: { padding: 16, paddingBottom: 28, gap: 18 },
  section: { gap: 8 },
  sectionTitle: { fontSize: 17, fontWeight: "800", color: colors.navy, paddingHorizontal: 4 },
  card: { backgroundColor: colors.white, borderRadius: 16, borderWidth: 1, borderColor: colors.border, padding: 14 },
  grid: { flexDirection: "row", flexWrap: "wrap", rowGap: 14 },
  stat: { width: "50%" },
  statValue: { fontSize: 26, fontWeight: "800", color: colors.navy },
  statLabel: { marginTop: 2, fontSize: 13, color: "#8390a2" },
  todoRow: { flexDirection: "row", gap: 10 },
  todo: { flex: 1, alignItems: "center", paddingVertical: 12, borderRadius: 12, backgroundColor: "#f3f4f6" },
  todoActive: { backgroundColor: "#fdeaea" },
  todoValue: { fontSize: 28, fontWeight: "800", color: colors.navy },
  legend: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 10 },
  legendText: { fontSize: 13, color: "#8390a2", marginRight: 10 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  chart: { flexDirection: "row", justifyContent: "space-between" },
  chartCol: { flex: 1, alignItems: "center" },
  bars: { height: CHART_HEIGHT, flexDirection: "row", alignItems: "flex-end", gap: 3 },
  bar: { width: 9, borderRadius: 3 },
  chartValue: { marginTop: 6, fontSize: 11, fontWeight: "700", color: colors.navy },
  chartDay: { marginTop: 2, fontSize: 11, color: "#8390a2" },
});
