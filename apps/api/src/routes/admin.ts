import { Router } from "express";
import { prisma } from "../prisma";
import { requireAuth, requireRole } from "../auth/middleware";
import { serializeListing } from "./listings";

export const adminRouter = Router();

adminRouter.use(requireAuth, requireRole("admin"));

// A'zolar ro'yxati (user + org)
adminRouter.get("/users", async (req, res) => {
  const { userType } = req.query as Record<string, string>;
  const users = await prisma.user.findMany({
    where: userType ? { userType: userType as any } : undefined,
    include: { organizationProfile: true },
    orderBy: { createdAt: "desc" },
  });
  return res.json(users);
});

adminRouter.patch("/users/:id/status", async (req, res) => {
  const { status } = req.body as { status: "active" | "suspended" };
  const user = await prisma.user.update({ where: { id: req.params.id }, data: { status: status as any } });
  return res.json(user);
});

// Foydalanuvchi/tashkilot postlarini boshqarish
adminRouter.get("/posts", async (_req, res) => {
  const posts = await prisma.post.findMany({
    include: { author: true, category: true, _count: { select: { likes: true, comments: true, reports: true } } },
    orderBy: { createdAt: "desc" },
  });
  return res.json(posts);
});

adminRouter.patch("/posts/:id/status", async (req, res) => {
  const { status } = req.body as { status: "visible" | "hidden" | "deleted" };
  const post = await prisma.post.update({ where: { id: req.params.id }, data: { status: status as any } });
  return res.json(post);
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
