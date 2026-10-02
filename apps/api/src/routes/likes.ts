import { Router } from "express";
import { prisma } from "../prisma";
import { requireAuth } from "../auth/middleware";
import { sendPush } from "../push";

export const likesRouter = Router();

likesRouter.get("/:postId", requireAuth, async (req, res) => {
  const existing = await prisma.like.findUnique({
    where: { postId_userId: { postId: req.params.postId, userId: req.auth!.userId } },
  });
  return res.json({ liked: Boolean(existing) });
});

likesRouter.post("/:postId", requireAuth, async (req, res) => {
  const { postId } = req.params;
  const userId = req.auth!.userId;

  const existing = await prisma.like.findUnique({
    where: { postId_userId: { postId, userId } },
  });

  if (existing) {
    await prisma.like.delete({ where: { id: existing.id } });
    const count = await prisma.like.count({ where: { postId } });
    return res.json({ liked: false, likeCount: count });
  }

  await prisma.like.create({ data: { postId, userId } });

  // Post egasiga xabar. Like'ni olib-qo'yib bosib spam qilmaslik uchun bir odamdan bitta xabar.
  const post = await prisma.post.findUnique({ where: { id: postId }, select: { authorId: true } });
  if (post && post.authorId !== userId) {
    const liker = await prisma.user.findUnique({ where: { id: userId }, select: { name: true } });
    const message = `${liker?.name ?? "누군가"}님이 회원님의 게시글을 좋아합니다`;
    const duplicate = await prisma.notification.findFirst({
      where: { userId: post.authorId, type: "like", refId: postId, message },
    });
    if (!duplicate) {
      await prisma.notification.create({ data: { userId: post.authorId, type: "like", refId: postId, message } });
      void sendPush([post.authorId], "like", { title: "좋아요", body: message, data: { postId } });
    }
  }

  const count = await prisma.like.count({ where: { postId } });
  return res.json({ liked: true, likeCount: count });
});
