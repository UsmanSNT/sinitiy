import { Router } from "express";
import { prisma } from "../prisma";
import { requireAuth, requireRole } from "../auth/middleware";

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
  const user = await prisma.user.update({ where: { id: req.params.id }, data: { status } });
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
  const post = await prisma.post.update({ where: { id: req.params.id }, data: { status } });
  return res.json(post);
});

// Tashkilot e'lonlarini boshqarish
adminRouter.get("/listings", async (_req, res) => {
  const listings = await prisma.listing.findMany({
    include: { org: true },
    orderBy: { createdAt: "desc" },
  });
  return res.json(listings);
});

adminRouter.patch("/listings/:id/status", async (req, res) => {
  const { status } = req.body as { status: "active" | "closed" | "hidden" };
  const listing = await prisma.listing.update({ where: { id: req.params.id }, data: { status } });
  return res.json(listing);
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
