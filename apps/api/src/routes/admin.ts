import { Router } from "express";
import { prisma } from "../prisma";
import { requireAuth, requireRole } from "../auth/middleware";
import { serializeListing } from "./listings";
import { postInclude, serializePost } from "./posts";

export const adminRouter = Router();

// Parol hash va boshqa ichki maydonlar tashqariga chiqmasligi uchun faqat kerakli maydonlar qaytariladi.
function serializeAdminUser(user: any) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    phone: user.phone,
    userType: user.userType,
    status: user.status,
    createdAt: user.createdAt,
    orgName: user.organizationProfile?.orgName ?? null,
    verified: user.organizationProfile?.verified ?? null,
  };
}

adminRouter.use(requireAuth, requireRole("admin"));

// A'zolar ro'yxati (user + org)
adminRouter.get("/users", async (req, res) => {
  const { userType } = req.query as Record<string, string>;
  const users = await prisma.user.findMany({
    where: userType ? { userType: userType as any } : undefined,
    include: { organizationProfile: true },
    orderBy: { createdAt: "desc" },
  });
  return res.json(users.map(serializeAdminUser));
});

adminRouter.patch("/users/:id/status", async (req, res) => {
  const { status } = req.body as { status: string };
  if (!["active", "suspended"].includes(status)) return res.status(400).json({ message: "잘못된 요청입니다" });
  const target = await prisma.user.findUnique({ where: { id: req.params.id } });
  if (!target) return res.status(404).json({ message: "사용자를 찾을 수 없습니다" });
  if (target.userType === "admin") return res.status(403).json({ message: "관리자 계정은 정지할 수 없습니다" });
  const user = await prisma.user.update({
    where: { id: req.params.id },
    data: { status: status as any },
    include: { organizationProfile: true },
  });
  return res.json(serializeAdminUser(user));
});

// Foydalanuvchi/tashkilot postlarini boshqarish
adminRouter.get("/posts", async (_req, res) => {
  const posts = await prisma.post.findMany({
    where: { status: { not: "deleted" } },
    include: postInclude,
    orderBy: { createdAt: "desc" },
  });
  return res.json(posts.map(serializePost));
});

adminRouter.patch("/posts/:id/status", async (req, res) => {
  const { status } = req.body as { status: string };
  if (!["visible", "hidden", "deleted"].includes(status)) return res.status(400).json({ message: "잘못된 요청입니다" });
  const post = await prisma.post.update({ where: { id: req.params.id }, data: { status: status as any }, include: postInclude });
  return res.json(serializePost(post));
});

// Tashkilot e'lonlarini boshqarish
adminRouter.get("/listings", async (req, res) => {
  const { status } = req.query as Record<string, string>;
  const listings = await prisma.listing.findMany({
    where: status ? { status: status as any } : {},
    include: { org: true },
    orderBy: { createdAt: "desc" },
  });
  return res.json(listings.map(serializeListing));
});

adminRouter.patch("/listings/:id/status", async (req, res) => {
  const { status } = req.body as { status: string };
  if (!["active", "closed", "hidden", "pending", "rejected"].includes(status)) {
    return res.status(400).json({ message: "잘못된 요청입니다" });
  }
  const listing = await prisma.listing.update({
    where: { id: req.params.id },
    data: { status: status as any },
    include: { org: true },
  });
  return res.json(serializeListing(listing));
});

// Sayt sozlamalari
adminRouter.get("/settings", async (_req, res) => {
  const settings = await prisma.adminSetting.findMany();
  return res.json(Object.fromEntries(settings.map((s) => [s.key, s.value])));
});

adminRouter.put("/settings/:key", async (req, res) => {
  const { value } = req.body as { value: string };
  const setting = await prisma.adminSetting.upsert({
    where: { key: req.params.key },
    update: { value },
    create: { key: req.params.key, value },
  });
  return res.json(setting);
});
