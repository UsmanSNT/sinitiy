import { useCallback, useMemo, useState } from "react";
import { FlatList, Image, ImageSourcePropType, Pressable, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { PaginatedResult, Post } from "@sinity/shared";
import type { RootStackParamList } from "../navigation/types";
import { api } from "../lib/api";
import { colors } from "../theme";

type CommunityPost = Post & { thumbnail?: ImageSourcePropType; sample?: boolean };

const tabs = ["전체", "자유게시판", "동네모임"] as const;
const fallbackImages = [
  require("../../assets/thumbnails/hiking.jpg"),
  require("../../assets/thumbnails/board-game.jpg"),
  require("../../assets/thumbnails/coffee.jpg"),
];
const samplePosts: CommunityPost[] = [
  {
    id: "sample-hiking", authorId: "sample", authorName: "서초 산우회", categoryId: "club",
    categoryName: "동네모임", title: "동네 산책 함께해요!", content: "이번 주말, 가까운 공원에서 함께 걸어요.",
    images: [], thumbnail: fallbackImages[0], likeCount: 12, commentCount: 5, reportCount: 0,
    status: "visible", createdAt: new Date().toISOString(), sample: true,
  },
  {
    id: "sample-board", authorId: "sample", authorName: "행복한 모임", categoryId: "club",
    categoryName: "동네모임", title: "바둑 동호회 회원 모집", content: "초보자도 환영합니다. 편하게 오세요.",
    images: [], thumbnail: fallbackImages[1], likeCount: 8, commentCount: 3, reportCount: 0,
    status: "visible", createdAt: new Date().toISOString(), sample: true,
  },
  {
    id: "sample-cafe", authorId: "sample", authorName: "마포 이웃", categoryId: "free",
    categoryName: "자유게시판", title: "우리동네 카페 추천", content: "분위기 좋은 카페를 공유해요.",
    images: [], thumbnail: fallbackImages[2], likeCount: 15, commentCount: 6, reportCount: 0,
    status: "visible", createdAt: new Date().toISOString(), sample: true,
  },
];

export function CommunityScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [posts, setPosts] = useState<CommunityPost[]>(samplePosts);
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("전체");

  const load = useCallback(() => {
    api.get<PaginatedResult<Post>>("/posts")
      .then((res) => setPosts(res.items.length ? res.items : samplePosts))
      .catch(() => setPosts(samplePosts));
  }, []);
  useFocusEffect(useCallback(() => load(), [load]));

  const visiblePosts = useMemo(
    () => posts.filter((post) => activeTab === "전체" || post.categoryName === activeTab),
    [activeTab, posts]
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>커뮤니티</Text>
        <View style={styles.headerActions}>
          <Pressable accessibilityLabel="검색" hitSlop={12}>
            <MaterialIcons name="search" size={23} color={colors.navy} />
          </Pressable>
          <Pressable accessibilityLabel="글쓰기" hitSlop={12} onPress={() => navigation.navigate("NewPost")}>
            <MaterialIcons name="add" size={25} color={colors.navy} />
          </Pressable>
        </View>
      </View>
      <View style={styles.tabs}>
        {tabs.map((tab) => (
          <Pressable key={tab} onPress={() => setActiveTab(tab)} style={styles.tab}>
            <Text style={[styles.tabLabel, activeTab === tab && styles.tabLabelActive]}>{tab}</Text>
            {activeTab === tab && <View style={styles.tabIndicator} />}
          </Pressable>
        ))}
      </View>
      <FlatList
        data={visiblePosts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<Text style={styles.empty}>아직 게시글이 없습니다.</Text>}
        renderItem={({ item, index }) => {
          const source = item.thumbnail ?? (item.images[0] ? { uri: item.images[0] } : fallbackImages[index % 3]);
          return (
            <Pressable
              style={({ pressed }) => [styles.postCard, pressed && styles.pressed]}
              onPress={() => !item.sample && navigation.navigate("PostDetail", { postId: item.id })}
            >
              <View style={styles.postCopy}>
                <Text style={styles.postTitle} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.postMeta} numberOfLines={1}>{item.authorName} · {item.categoryName}</Text>
                <Text style={styles.postBody} numberOfLines={2}>{item.content}</Text>
                <View style={styles.stats}>
                  <MaterialCommunityIcons name="heart-outline" size={14} color="#8290a4" />
                  <Text style={styles.statText}>{item.likeCount}</Text>
                  <MaterialCommunityIcons name="comment-outline" size={14} color="#8290a4" />
                  <Text style={styles.statText}>{item.commentCount}</Text>
                </View>
              </View>
              <Image source={source} style={styles.thumbnail} />
            </Pressable>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 18, paddingTop: 54, paddingBottom: 8, backgroundColor: colors.white },
  title: { fontSize: 20, fontWeight: "800", color: colors.navy },
  headerActions: { flexDirection: "row", alignItems: "center", gap: 18 },
  tabs: { flexDirection: "row", backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: "#eef1f5" },
  tab: { flex: 1, alignItems: "center", paddingTop: 10, height: 43 },
  tabLabel: { fontSize: 13, fontWeight: "600", color: "#8792a4" },
  tabLabelActive: { color: "#2468d7", fontWeight: "800" },
  tabIndicator: { position: "absolute", bottom: 0, width: 42, height: 3, borderRadius: 2, backgroundColor: "#3979dc" },
  list: { padding: 12, paddingBottom: 20, gap: 10 },
  empty: { textAlign: "center", color: colors.gray, marginTop: 40 },
  postCard: { minHeight: 112, flexDirection: "row", alignItems: "center", backgroundColor: colors.white, borderWidth: 1, borderColor: "#e8edf3", borderRadius: 8, padding: 12, shadowColor: "#1d2b45", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 5, elevation: 1 },
  pressed: { opacity: 0.75 },
  postCopy: { flex: 1, minWidth: 0, paddingRight: 12 },
  postTitle: { fontSize: 15, fontWeight: "800", color: colors.navy },
  postMeta: { marginTop: 4, fontSize: 10, color: "#8995a7" },
  postBody: { marginTop: 8, fontSize: 12, lineHeight: 17, color: "#536176" },
  stats: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 8 },
  statText: { marginRight: 10, fontSize: 11, color: "#8290a4" },
  thumbnail: { width: 72, height: 72, borderRadius: 7, backgroundColor: "#eef1f5" },
});
