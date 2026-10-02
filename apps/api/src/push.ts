import { prisma } from "./prisma";

// Foydalanuvchi 알림 설정 ekranidagi kategoriyalar. "system" - sozlamaga bog'liq emas
// (masalan, reklama tasdiqlandi): foydalanuvchi o'zi kutgan javob, o'chirib bo'lmaydi.
export const PUSH_CATEGORIES = ["notice", "newPost", "comment", "like", "event", "partner"] as const;
export type PushCategory = (typeof PUSH_CATEGORIES)[number] | "system";

// Expo Push Service Android'da FCM, iOS'da APNs orqali yetkazadi. Testda lokal soxta serverga yo'naltiriladi.
const EXPO_PUSH_URL = process.env.EXPO_PUSH_URL ?? "https://exp.host/--/api/v2/push/send";
const CHUNK_SIZE = 100;

interface PushMessage {
  title: string;
  body: string;
  data?: Record<string, string>;
}

type Target = string[] | "all";

// Hech qachon throw qilmaydi: push xatosi asosiy so'rovni (komment yozish, like...) buzmasligi kerak.
export async function sendPush(target: Target, category: PushCategory, message: PushMessage): Promise<void> {
  try {
    const rows = await prisma.pushToken.findMany({
      where: target === "all" ? {} : { userId: { in: target } },
      include: { user: { select: { status: true, notificationPrefs: true } } },
    });

    const tokens = rows
      .filter((row) => {
        if (row.user.status !== "active") return false;
        if (category === "system") return true;
        const prefs = row.user.notificationPrefs as Record<string, unknown> | null;
        return prefs?.[category] !== false;
      })
      .map((row) => row.token);

    for (let i = 0; i < tokens.length; i += CHUNK_SIZE) {
      await sendChunk(tokens.slice(i, i + CHUNK_SIZE), message);
    }
  } catch (err) {
    console.error("[push] yuborib bo'lmadi:", err);
  }
}

async function sendChunk(tokens: string[], message: PushMessage) {
  const res = await fetch(EXPO_PUSH_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(
      tokens.map((to) => ({ to, title: message.title, body: message.body, data: message.data, sound: "default", channelId: "default" }))
    ),
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) {
    console.error("[push] Expo javobi:", res.status);
    return;
  }

  // Javob tartibi so'rov tartibi bilan bir xil: o'chirilgan qurilma tokenlarini bazadan tozalaymiz.
  const { data } = (await res.json()) as { data?: Array<{ status: string; details?: { error?: string } }> };
  const dead = tokens.filter((_, i) => data?.[i]?.status === "error" && data[i].details?.error === "DeviceNotRegistered");
  if (dead.length) await prisma.pushToken.deleteMany({ where: { token: { in: dead } } });
}
