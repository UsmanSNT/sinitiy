import { Router } from "express";
import { prisma } from "../prisma";
import { requireAuth } from "../auth/middleware";
import { postInclude, serializePost } from "./posts";

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
