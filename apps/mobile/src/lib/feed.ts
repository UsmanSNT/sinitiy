import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { FeedItem, ListingType } from "@sinity/shared";
import type { RootStackParamList } from "../navigation/types";
import { api } from "./api";
import { listingImage } from "./listingImage";

const listingTags: Record<ListingType, { label: string; color: string }> = {
  job: { label: "일자리", color: "#3fae5c" },
  health: { label: "건강", color: "#3d5ee1" },
  education: { label: "교육", color: "#7a5cd6" },
  life: { label: "생활", color: "#1a9aa0" },
};

export function feedTag(item: FeedItem) {
  if (item.kind === "notice") return { label: "공지", color: "#e2536b" };
  if (item.kind === "news") return { label: "소식", color: "#e08a2b" };
  return listingTags[item.listing!.listingType];
}

// 당근 kabi nisbiy vaqt: yaqin xabarlar "3시간 전", eskilari sana bilan.
export function feedTime(iso: string) {
  const date = new Date(iso);
  const diffMin = Math.floor((Date.now() - date.getTime()) / 60000);
  if (diffMin < 1) return "방금";
  if (diffMin < 60) return `${diffMin}분 전`;
  if (diffMin < 60 * 24) return `${Math.floor(diffMin / 60)}시간 전`;
  const days = Math.floor(diffMin / (60 * 24));
  if (days === 1) return "어제";
  if (days < 7) return `${days}일 전`;
  return `${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
}

export function useFeed(limit: number) {
  const [items, setItems] = useState<FeedItem[] | null>(null);
  const [error, setError] = useState(false);

  const load = useCallback(() => {
    setError(false);
    api
      .get<FeedItem[]>(`/feed?limit=${limit}`)
      .then(setItems)
      .catch(() => setError(true));
  }, [limit]);

  useFocusEffect(load);

  return { items: items ?? [], loading: items === null && !error, error, reload: load };
}

// Lenta hammaga umumiy, shuning uchun "o'qildi" holati serverda emas, qurilmada saqlanadi.
const READ_KEY = "sinity_feed_read_ids";
const MAX_READ_IDS = 300;

export async function loadFeedReadIds(): Promise<Set<string>> {
  try {
    const raw = await AsyncStorage.getItem(READ_KEY);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

export async function markFeedRead(ids: string[]): Promise<Set<string>> {
  const next = new Set([...(await loadFeedReadIds()), ...ids]);
  await AsyncStorage.setItem(READ_KEY, JSON.stringify([...next].slice(-MAX_READ_IDS))).catch(() => {});
  return next;
}

const detailRoutes = {
  job: "JobDetail",
  health: "HealthDetail",
  education: "EducationDetail",
  life: "LifeConvenienceDetail",
} as const;

// Bosh sahifadan ochilganda orasiga 알림 ro'yxati qo'yiladi: yangilikdan orqaga qaytganda
// foydalanuvchi to'g'ridan-to'g'ri Home'ga emas, barcha yangiliklar (전체) ro'yxatiga tushadi.
export function openFeedItem(
  navigation: Pick<NativeStackNavigationProp<RootStackParamList>, "navigate">,
  item: FeedItem,
  options: { viaList?: boolean } = {}
) {
  if (options.viaList) navigation.navigate("Notifications");
  if (item.postId) {
    navigation.navigate("PostDetail", { postId: item.postId });
    return;
  }
  const l = item.listing!;
  navigation.navigate(detailRoutes[l.listingType], {
    title: l.title,
    organization: l.orgName,
    period: l.period ?? "",
    category: l.category ?? "",
    image: listingImage(l, 0),
    content: l.content,
    phone: l.phone,
    targetAudience: l.targetAudience,
    applyMethod: l.applyMethod,
    from: "Home",
  });
}
