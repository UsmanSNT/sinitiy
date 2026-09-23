import { Router } from "express";
import { createCommentSchema } from "@sinity/shared";
import { prisma } from "../prisma";
import { requireAuth } from "../auth/middleware";

export const commentsRouter = Router();

commentsRouter.get("/post/:postId", async (req, res) => {
  const comments = await prisma.comment.findMany({
    where: { postId: req.params.postId },
    include: { author: true },
    orderBy: { createdAt: "asc" },
  });
  return res.json(
    comments.map((c) => ({
      id: c.id,
      postId: c.postId,
      authorId: c.authorId,
      authorName: c.author.name,
      content: c.content,
      createdAt: c.createdAt,
    }))
  );
});

commentsRouter.post("/", requireAuth, async (req, res) => {
  const parsed = createCommentSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "잘못된 요청입니다" });

  const post = await prisma.post.findUnique({ where: { id: parsed.data.postId } });
  if (!post) return res.status(404).json({ message: "게시글을 찾을 수 없습니다" });

  const comment = await prisma.comment.create({
    data: {
      postId: parsed.data.postId,
      authorId: req.auth!.userId,
      content: parsed.data.content,
    },
    include: { author: true },
  });

  // Post egasiga push-uchun notification yozuvi (haqiqiy push FCM integratsiyasi keyingi bosqichda).
  if (post.authorId !== req.auth!.userId) {
    await prisma.notification.create({
      data: {
        userId: post.authorId,
        type: "comment",
        refId: post.id,
        message: `${comment.author.name}님이 회원님의 게시글에 댓글을 남겼습니다`,
      },
    });
  }

  return res.status(201).json({
    id: comment.id,
    postId: comment.postId,
    authorId: comment.authorId,
    authorName: comment.author.name,
    content: comment.content,
    createdAt: comment.createdAt,
  });
});

commentsRouter.delete("/:id", requireAuth, async (req, res) => {
  const comment = await prisma.comment.findUnique({ where: { id: req.params.id } });
  if (!comment) return res.status(404).json({ message: "찾을 수 없습니다" });
  if (comment.authorId !== req.auth!.userId && req.auth!.userType !== "admin") {
    return res.status(403).json({ message: "권한이 없습니다" });
  }
  await prisma.comment.delete({ where: { id: req.params.id } });
  return res.status(204).send();
});
