import { Router } from "express";
import { createAdRequestSchema } from "@sinity/shared";
import { prisma } from "../prisma";
import { requireAuth, requireRole } from "../auth/middleware";

export const adRequestsRouter = Router();

function serialize(ad: any) {
  return {
    id: ad.id,
    orgId: ad.orgId,
    orgName: ad.org?.orgName,
    title: ad.title,
    content: ad.content,
    images: ad.images,
    phone: ad.phone,
    homepage: ad.homepage,
    status: ad.status,
    adminNote: ad.adminNote,
    createdAt: ad.createdAt,
  };
}

// Tashkilotning o'z reklama so'rovlari (mypage uchun).
adRequestsRouter.get("/mine", requireAuth, requireRole("organization"), async (req, res) => {
  const items = await prisma.adRequest.findMany({
    where: { orgId: req.auth!.userId },
    include: { org: true },
    orderBy: { createdAt: "desc" },
  });
  return res.json(items.map(serialize));
});

adRequestsRouter.post("/", requireAuth, requireRole("organization"), async (req, res) => {
  const parsed = createAdRequestSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "잘못된 요청입니다" });

  const ad = await prisma.adRequest.create({
    data: { orgId: req.auth!.userId, ...parsed.data, homepage: parsed.data.homepage || null },
    include: { org: true },
  });

  return res.status(201).json(serialize(ad));
});

// Faqat tasdiqlangan reklamalar - foydalanuvchi tomonida tasodifiy ko'rsatish uchun.
adRequestsRouter.get("/approved", async (_req, res) => {
  const items = await prisma.adRequest.findMany({
    where: { status: "approved" },
    include: { org: true },
    orderBy: { createdAt: "desc" },
  });
  return res.json(items.map(serialize));
});

adRequestsRouter.get("/", requireAuth, requireRole("admin"), async (_req, res) => {
  const items = await prisma.adRequest.findMany({
    include: { org: true },
    orderBy: { createdAt: "desc" },
  });
  return res.json(items.map(serialize));
});

adRequestsRouter.patch("/:id", requireAuth, requireRole("admin"), async (req, res) => {
  const { status, adminNote } = req.body as { status: "approved" | "rejected"; adminNote?: string };

  const ad = await prisma.adRequest.update({
    where: { id: req.params.id },
    data: { status, adminNote },
    include: { org: true },
  });

  await prisma.notification.create({
    data: {
      userId: ad.orgId,
      type: status === "approved" ? "ad_approved" : "ad_rejected",
      refId: ad.id,
      message:
        status === "approved"
          ? `"${ad.title}" reklamangiz tasdiqlandi`
          : `"${ad.title}" reklamangiz rad etildi`,
    },
  });

  return res.json(serialize(ad));
});
