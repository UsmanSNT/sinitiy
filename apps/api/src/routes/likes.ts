import { Router } from "express";
import { prisma } from "../prisma";
import { requireAuth } from "../auth/middleware";

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
  const count = await prisma.like.count({ where: { postId } });
  return res.json({ liked: true, likeCount: count });
});
