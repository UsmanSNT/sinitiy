import { Router } from "express";
import { createListingCommentSchema } from "@sinity/shared";
import { prisma } from "../prisma";
import { requireAuth } from "../auth/middleware";

export const listingCommentsRouter = Router();

function serialize(comment: { id: string; listingId: string; authorId: string; content: string; createdAt: Date; author: { name: string } }) {
  return {
    id: comment.id,
    listingId: comment.listingId,
    authorId: comment.authorId,
    authorName: comment.author.name,
    content: comment.content,
    createdAt: comment.createdAt,
  };
}

listingCommentsRouter.get("/listing/:listingId", async (req, res) => {
  const comments = await prisma.listingComment.findMany({
    where: { listingId: req.params.listingId },
    include: { author: true },
    orderBy: { createdAt: "asc" },
  });
  return res.json(comments.map(serialize));
});

// Faqat ro'yxatdan o'tganlar yozadi, va faqat hozir ko'rinib turgan e'longa (listings.ts GET /:id bilan bir xil qoida).
listingCommentsRouter.post("/", requireAuth, async (req, res) => {
  const parsed = createListingCommentSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "잘못된 요청입니다" });

  const listing = await prisma.listing.findUnique({ where: { id: parsed.data.listingId } });
  const now = new Date();
  const live = listing && listing.status === "active" && (!listing.publishStart || listing.publishStart <= now) && (!listing.publishEnd || listing.publishEnd >= now);
  if (!live) return res.status(404).json({ message: "찾을 수 없습니다" });

  const comment = await prisma.listingComment.create({
    data: { listingId: parsed.data.listingId, authorId: req.auth!.userId, content: parsed.data.content },
    include: { author: true },
  });
  return res.status(201).json(serialize(comment));
});

listingCommentsRouter.delete("/:id", requireAuth, async (req, res) => {
  const comment = await prisma.listingComment.findUnique({ where: { id: req.params.id } });
  if (!comment) return res.status(404).json({ message: "찾을 수 없습니다" });
  if (comment.authorId !== req.auth!.userId && req.auth!.userType !== "admin") {
    return res.status(403).json({ message: "권한이 없습니다" });
  }
  await prisma.listingComment.delete({ where: { id: req.params.id } });
  return res.status(204).send();
});
