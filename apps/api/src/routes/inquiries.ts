import { Router } from "express";
import { createInquirySchema } from "@sinity/shared";
import { prisma } from "../prisma";
import { sendPush } from "../push";
import { requireAuth, requireRole } from "../auth/middleware";

export const inquiriesRouter = Router();

function serialize(i: any) {
  return {
    id: i.id,
    userId: i.userId,
    userName: i.user?.name,
    title: i.title,
    content: i.content,
    answer: i.answer,
    answeredAt: i.answeredAt,
    createdAt: i.createdAt,
  };
}

inquiriesRouter.post("/", requireAuth, async (req, res) => {
  const parsed = createInquirySchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "제목과 내용을 입력해주세요" });
  const created = await prisma.inquiry.create({ data: { userId: req.auth!.userId, ...parsed.data } });
  return res.status(201).json(serialize(created));
});

inquiriesRouter.get("/mine", requireAuth, async (req, res) => {
  const items = await prisma.inquiry.findMany({ where: { userId: req.auth!.userId }, orderBy: { createdAt: "desc" } });
  return res.json(items.map(serialize));
});

// Admin: hamma savollar (javobsizlari birinchi), javob yozish.
inquiriesRouter.get("/", requireAuth, requireRole("admin"), async (_req, res) => {
  const items = await prisma.inquiry.findMany({ include: { user: true }, orderBy: { createdAt: "desc" } });
  items.sort((a, b) => Number(!!a.answer) - Number(!!b.answer));
  return res.json(items.map(serialize));
});

inquiriesRouter.patch("/:id/answer", requireAuth, requireRole("admin"), async (req, res) => {
  const answer = typeof req.body?.answer === "string" ? req.body.answer.trim() : "";
  if (!answer || answer.length > 2000) return res.status(400).json({ message: "답변을 입력해주세요" });
  const existing = await prisma.inquiry.findUnique({ where: { id: req.params.id } });
  if (!existing) return res.status(404).json({ message: "찾을 수 없습니다" });
  const updated = await prisma.inquiry.update({
    where: { id: existing.id },
    data: { answer, answeredAt: new Date() },
    include: { user: true },
  });
  const message = `"${updated.title}" 문의에 답변이 등록되었습니다`;
  await prisma.notification.create({
    data: { userId: updated.userId, type: "inquiry_answered", refId: updated.id, message },
  });
  void sendPush([updated.userId], "system", { title: "1:1 문의 답변", body: message, data: { inquiryId: updated.id } });
  return res.json(serialize(updated));
});
