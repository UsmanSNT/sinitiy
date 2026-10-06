import { Router } from "express";
import { createAdRequestSchema } from "@sinity/shared";
import { prisma } from "../prisma";
import { sendPush } from "../push";
import { requireAuth, requireRole } from "../auth/middleware";
import { parseWindow, toKstDate, windowWhere } from "../lib/window";

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
    displayStart: toKstDate(ad.displayStart),
    displayEnd: toKstDate(ad.displayEnd),
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

  const { displayStart, displayEnd, ...fields } = parsed.data;
  const window = parseWindow(displayStart, displayEnd);
  if ("error" in window) return res.status(400).json({ message: window.error });

  const ad = await prisma.adRequest.create({
    data: { orgId: req.auth!.userId, ...fields, homepage: fields.homepage || null, displayStart: window.start ?? null, displayEnd: window.end ?? null },
    include: { org: true },
  });

  return res.status(201).json(serialize(ad));
});

// Tashkilot o'z so'rovini tahrirlaydi; tasdiqlangan yoki rad etilgan bo'lsa qayta tekshiruvga ("pending") qaytadi.
adRequestsRouter.put("/:id", requireAuth, requireRole("organization"), async (req, res) => {
  const ad = await prisma.adRequest.findUnique({ where: { id: req.params.id } });
  if (!ad) return res.status(404).json({ message: "찾을 수 없습니다" });
  if (ad.orgId !== req.auth!.userId) return res.status(403).json({ message: "권한이 없습니다" });

  const parsed = createAdRequestSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "잘못된 요청입니다" });

  const { displayStart, displayEnd, ...fields } = parsed.data;
  const window = parseWindow(displayStart, displayEnd);
  if ("error" in window) return res.status(400).json({ message: window.error });

  const updated = await prisma.adRequest.update({
    where: { id: ad.id },
    data: { ...fields, homepage: fields.homepage || null, displayStart: window.start ?? null, displayEnd: window.end ?? null, status: "pending", adminNote: null },
    include: { org: true },
  });
  return res.json(serialize(updated));
});

// Faqat tasdiqlangan reklamalar - foydalanuvchi tomonida tasodifiy ko'rsatish uchun.
adRequestsRouter.get("/approved", async (_req, res) => {
  const items = await prisma.adRequest.findMany({
    where: { status: "approved", ...windowWhere("displayStart", "displayEnd") },
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
  const { status, adminNote } = req.body as { status: string; adminNote?: string };
  if (!["approved", "rejected"].includes(status)) return res.status(400).json({ message: "잘못된 요청입니다" });

  const ad = await prisma.adRequest.update({
    where: { id: req.params.id },
    data: { status: status as "approved" | "rejected", adminNote: adminNote?.trim() || null },
    include: { org: true },
  });

  const message =
    status === "approved" ? `"${ad.title}" 광고가 승인되었습니다` : `"${ad.title}" 광고가 반려되었습니다`;
  await prisma.notification.create({
    data: { userId: ad.orgId, type: status === "approved" ? "ad_approved" : "ad_rejected", refId: ad.id, message },
  });
  void sendPush([ad.orgId], "system", { title: "광고 심사 결과", body: message, data: { adId: ad.id } });

  return res.json(serialize(ad));
});

// Tashkilot o'z so'rovini (istalgan holatda) bekor qiladi, admin esa istalganini o'chiradi.
adRequestsRouter.delete("/:id", requireAuth, requireRole("organization", "admin"), async (req, res) => {
  const ad = await prisma.adRequest.findUnique({ where: { id: req.params.id } });
  if (!ad) return res.status(404).json({ message: "찾을 수 없습니다" });
  if (req.auth!.userType === "organization" && ad.orgId !== req.auth!.userId) {
    return res.status(403).json({ message: "권한이 없습니다" });
  }
  await prisma.adRequest.delete({ where: { id: ad.id } });
  return res.status(204).send();
});
