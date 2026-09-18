import { Router } from "express";
import { createPostSchema } from "@sinity/shared";
import { prisma } from "../prisma";
import { requireAuth } from "../auth/middleware";

export const postsRouter = Router();

function serializePost(post: any) {
  return {
    id: post.id,
    authorId: post.authorId,
    authorName: post.author?.name,
    categoryId: post.categoryId,
    categoryName: post.category?.name,
    title: post.title,
    content: post.content,
    images: post.images,
    likeCount: post._count?.likes ?? 0,
    commentCount: post._count?.comments ?? 0,
    reportCount: post._count?.reports ?? 0,
    status: post.status,
    createdAt: post.createdAt,
  };
}

postsRouter.get("/", async (req, res) => {
  const { categoryId, page = "1", pageSize = "20" } = req.query as Record<string, string>;
  const take = Math.min(Number(pageSize) || 20, 50);
  const skip = (Math.max(Number(page) || 1, 1) - 1) * take;

  const where = {
    status: "visible" as const,
    ...(categoryId ? { categoryId } : {}),
  };

  const [items, total] = await Promise.all([
    prisma.post.findMany({
      where,
      include: {
        author: true,
        category: true,
        _count: { select: { likes: true, comments: true, reports: true } },
      },
      orderBy: { createdAt: "desc" },
      take,
      skip,
    }),
    prisma.post.count({ where }),
  ]);

  return res.json({
    items: items.map(serializePost),
    total,
    page: Number(page) || 1,
    pageSize: take,
  });
});

postsRouter.get("/:id", async (req, res) => {
  const post = await prisma.post.findUnique({
    where: { id: req.params.id },
    include: {
      author: true,
      category: true,
      _count: { select: { likes: true, comments: true, reports: true } },
    },
  });
  if (!post || post.status === "deleted") return res.status(404).json({ message: "찾을 수 없습니다" });
  return res.json(serializePost(post));
});

postsRouter.post("/", requireAuth, async (req, res) => {
  const parsed = createPostSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "잘못된 요청입니다" });

  const post = await prisma.post.create({
    data: {
      authorId: req.auth!.userId,
      categoryId: parsed.data.categoryId,
      title: parsed.data.title,
      content: parsed.data.content,
      images: parsed.data.images,
    },
    include: {
      author: true,
      category: true,
      _count: { select: { likes: true, comments: true, reports: true } },
    },
  });

  return res.status(201).json(serializePost(post));
});

postsRouter.put("/:id", requireAuth, async (req, res) => {
  const post = await prisma.post.findUnique({ where: { id: req.params.id } });
  if (!post) return res.status(404).json({ message: "찾을 수 없습니다" });
  if (post.authorId !== req.auth!.userId && req.auth!.userType !== "admin") {
    return res.status(403).json({ message: "권한이 없습니다" });
  }

  const parsed = createPostSchema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "잘못된 요청입니다" });

  const updated = await prisma.post.update({
    where: { id: req.params.id },
    data: parsed.data,
    include: {
      author: true,
      category: true,
      _count: { select: { likes: true, comments: true, reports: true } },
    },
  });

  return res.json(serializePost(updated));
});

postsRouter.delete("/:id", requireAuth, async (req, res) => {
  const post = await prisma.post.findUnique({ where: { id: req.params.id } });
  if (!post) return res.status(404).json({ message: "찾을 수 없습니다" });
  if (post.authorId !== req.auth!.userId && req.auth!.userType !== "admin") {
    return res.status(403).json({ message: "권한이 없습니다" });
  }

  await prisma.post.update({ where: { id: req.params.id }, data: { status: "deleted" } });
  return res.status(204).send();
});
