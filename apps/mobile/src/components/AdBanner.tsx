import { useCallback, useEffect, useRef, useState } from "react";
import { ImageBackground, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { AdRequest } from "@sinity/shared";
import type { RootStackParamList } from "../navigation/types";
import { api } from "../lib/api";
import { bannerColor } from "../lib/adMeta";

const AUTO_SLIDE_MS = 5000;

// Admin tasdiqlagan tashkilot reklamalari. Bir nechta bo'lsa 5 soniyada almashadi;
// foydalanuvchi o'zi sursa taymer shu joydan qaytadan boshlanadi. Reklama bo'lmasa hech narsa chizilmaydi.
export function AdBanner() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [ads, setAds] = useState<AdRequest[]>([]);
  const [index, setIndex] = useState(0);
  const [width, setWidth] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  useFocusEffect(
    useCallback(() => {
      api
        .get<AdRequest[]>("/ad-requests/approved")
        .then((items) => {
          setAds(items);
          setIndex(0);
          scrollRef.current?.scrollTo({ x: 0, animated: false });
        })
        .catch(() => setAds([]));
    }, [])
  );

  useEffect(() => {
    if (ads.length < 2 || !width) return;
    const timer = setTimeout(() => {
      const next = (index + 1) % ads.length;
      scrollRef.current?.scrollTo({ x: next * width, animated: true });
      setIndex(next);
    }, AUTO_SLIDE_MS);
    return () => clearTimeout(timer);
  }, [index, ads.length, width]);

  if (ads.length === 0) return null;

  return (
    <View style={styles.wrap} onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => width && setIndex(Math.round(e.nativeEvent.contentOffset.x / width))}
      >
        {ads.map((ad, i) => (
          <Pressable
            key={ad.id}
            accessibilityLabel={`광고, ${ad.title}`}
            style={{ width }}
            onPress={() => navigation.navigate("AdDetail", { ad, color: bannerColor(i) })}
          >
            {ad.images[0] ? (
              <ImageBackground source={{ uri: ad.images[0] }} style={styles.slide} imageStyle={styles.slideImage}>
                <View style={styles.imageShade} />
                <SlideContent ad={ad} />
              </ImageBackground>
            ) : (
              <View style={[styles.slide, { backgroundColor: bannerColor(i) }]}>
                <MaterialCommunityIcons name="bullhorn-variant" size={54} color="rgba(255,255,255,0.18)" style={styles.decor} />
                <SlideContent ad={ad} />
              </View>
            )}
          </Pressable>
        ))}
      </ScrollView>
      {ads.length > 1 && (
        <View style={styles.counter}>
          <Text style={styles.counterText}>{index + 1} / {ads.length}</Text>
        </View>
      )}
    </View>
  );
}

function SlideContent({ ad }: { ad: AdRequest }) {
  return (
    <>
      <Text style={styles.adTag}>광고</Text>
      <Text style={styles.title} numberOfLines={2}>{ad.title}</Text>
      <Text style={styles.body} numberOfLines={1}>{ad.content}</Text>
      <Text style={styles.org} numberOfLines={1}>{ad.orgName} · 자세히 보기 ›</Text>
    </>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: 4, marginBottom: 14, borderRadius: 14, overflow: "hidden" },
  slide: { height: 148, paddingHorizontal: 18, paddingVertical: 16, justifyContent: "center", overflow: "hidden" },
  slideImage: { borderRadius: 14 },
  imageShade: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(10,20,40,0.5)" },
  decor: { position: "absolute", right: 18, top: 16 },
  adTag: { alignSelf: "flex-start", overflow: "hidden", borderRadius: 9, backgroundColor: "rgba(255,255,255,0.22)", paddingHorizontal: 8, paddingVertical: 2, fontSize: 12, fontWeight: "800", color: "#ffffff" },
  title: { marginTop: 8, paddingRight: 56, fontSize: 19, fontWeight: "800", color: "#ffffff", lineHeight: 25 },
  body: { marginTop: 4, paddingRight: 30, fontSize: 14, color: "rgba(255,255,255,0.88)" },
  org: { marginTop: 8, fontSize: 13, fontWeight: "700", color: "rgba(255,255,255,0.8)" },
  counter: { position: "absolute", right: 10, bottom: 10, borderRadius: 10, backgroundColor: "rgba(0,0,0,0.35)", paddingHorizontal: 8, paddingVertical: 2 },
  counterText: { fontSize: 12, fontWeight: "700", color: "#ffffff" },
});
