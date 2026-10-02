import { Router } from "express";
import { prisma } from "../prisma";
import { requireAuth } from "../auth/middleware";
import { postInclude, serializePost } from "./posts";
import { PUSH_CATEGORIES } from "../push";

export const meRouter = Router();

meRouter.get("/", requireAuth, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.auth!.userId },
    include: { organizationProfile: true },
  });
  if (!user) return res.status(404).json({ message: "사용자를 찾을 수 없습니다" });

  return res.json({
    id: user.id,
    email: user.email,
    name: user.name,
    phone: user.phone,
    userType: user.userType,
    status: user.status,
    createdAt: user.createdAt,
    organizationProfile: user.organizationProfile,
  });
});

// "내 활동" sahifasi uchun: foydalanuvchining o'z postlari, izohlari va like bosgan postlari.
meRouter.get("/posts", requireAuth, async (req, res) => {
  const posts = await prisma.post.findMany({
    where: { authorId: req.auth!.userId, status: { not: "deleted" } },
    include: postInclude,
    orderBy: { createdAt: "desc" },
  });
  return res.json(posts.map(serializePost));
});

meRouter.get("/comments", requireAuth, async (req, res) => {
  const comments = await prisma.comment.findMany({
    where: { authorId: req.auth!.userId, post: { status: { not: "deleted" } } },
    include: { post: { select: { title: true } } },
    orderBy: { createdAt: "desc" },
  });
  return res.json(
    comments.map((c) => ({ id: c.id, postId: c.postId, postTitle: c.post.title, content: c.content, createdAt: c.createdAt }))
  );
});

meRouter.get("/likes", requireAuth, async (req, res) => {
  const likes = await prisma.like.findMany({
    where: { userId: req.auth!.userId, post: { status: "visible" } },
    include: { post: { include: postInclude } },
    orderBy: { createdAt: "desc" },
  });
  return res.json(likes.map((l) => serializePost(l.post)));
});

// --- Push: qurilma tokeni va kategoriya sozlamalari ---

const PUSH_TOKEN_RE = /^Expo(nent)?PushToken\[[\w-]+\]$/;

// Bir qurilma - bitta token: boshqa akkaunt bilan kirilsa token yangi egaga o'tadi.
meRouter.post("/push-token", requireAuth, async (req, res) => {
  const { token, platform } = req.body as { token?: unknown; platform?: unknown };
  if (typeof token !== "string" || !PUSH_TOKEN_RE.test(token)) {
    return res.status(400).json({ message: "잘못된 요청입니다" });
  }
  const userId = req.auth!.userId;
  const plat = typeof platform === "string" ? platform.slice(0, 20) : "unknown";
  await prisma.pushToken.upsert({
    where: { token },
    update: { userId, platform: plat },
    create: { token, userId, platform: plat },
  });
  return res.status(204).send();
});

// Logout'da: shu qurilmaga boshqa akkaunt xabari ketmasligi uchun.
meRouter.delete("/push-token", requireAuth, async (req, res) => {
  const token = String(req.query.token ?? "");
  await prisma.pushToken.deleteMany({ where: { token, userId: req.auth!.userId } });
  return res.status(204).send();
});

function withDefaults(prefs: unknown) {
  const saved = (prefs ?? {}) as Record<string, unknown>;
  return Object.fromEntries(PUSH_CATEGORIES.map((key) => [key, saved[key] !== false]));
}

meRouter.get("/notification-settings", requireAuth, async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.auth!.userId }, select: { notificationPrefs: true } });
  return res.json(withDefaults(user?.notificationPrefs));
});

meRouter.put("/notification-settings", requireAuth, async (req, res) => {
  const body = req.body as Record<string, unknown>;
  const entries = Object.entries(body ?? {});
  const valid = entries.length > 0 && entries.every(([k, v]) => (PUSH_CATEGORIES as readonly string[]).includes(k) && typeof v === "boolean");
  if (!valid) return res.status(400).json({ message: "잘못된 요청입니다" });

  const user = await prisma.user.findUnique({ where: { id: req.auth!.userId }, select: { notificationPrefs: true } });
  const merged = { ...withDefaults(user?.notificationPrefs), ...(body as Record<string, boolean>) };
  await prisma.user.update({ where: { id: req.auth!.userId }, data: { notificationPrefs: merged } });
  return res.json(merged);
});
