import { Router } from "express";
import { prisma } from "../prisma";
import { requireAuth, requireRole } from "../auth/middleware";
import { serializeListing } from "./listings";
import { postInclude, serializePost } from "./posts";
import { sendPush } from "../push";

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
  const { status, rejectReason } = req.body as { status: string; rejectReason?: string };
  if (!["active", "closed", "hidden", "pending", "rejected"].includes(status)) {
    return res.status(400).json({ message: "잘못된 요청입니다" });
  }
  const reason = status === "rejected" ? (typeof rejectReason === "string" ? rejectReason.trim().slice(0, 500) : "") || null : null;
  const before = await prisma.listing.findUnique({ where: { id: req.params.id } });
  if (!before) return res.status(404).json({ message: "찾을 수 없습니다" });
  const listing = await prisma.listing.update({
    where: { id: req.params.id },
    data: { status: status as any, rejectReason: reason },
    include: { org: true },
  });

  // Review natijasi tashkilotga bildiriladi (faqat holat haqiqatan o'zgarganda).
  if (before.status !== status && (status === "active" || status === "rejected")) {
    const approved = status === "active";
    const message = approved ? `"${listing.title}" 공고가 승인되었습니다` : `"${listing.title}" 공고가 반려되었습니다${reason ? ` (사유: ${reason})` : ""}`;
    await prisma.notification.create({
      data: { userId: listing.orgId, type: approved ? "listing_approved" : "listing_rejected", refId: listing.id, message },
    });
    void sendPush([listing.orgId], "system", { title: "공고 심사 결과", body: message, data: { listingId: listing.id } });
  }
  return res.json(serializeListing(listing));
});

// 통계: hammasi bitta so'rovda (admin bosh sahifasi uchun), og'ir hisob-kitob yo'q - faqat count va oxirgi 7 kun.
const KST_OFFSET_MS = 9 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

function kstDate(date: Date) {
  return new Date(date.getTime() + KST_OFFSET_MS).toISOString().slice(0, 10);
}

adminRouter.get("/stats", async (_req, res) => {
  const now = Date.now();
  // 7 ta kalendar kun (bugun bilan) - Koreya vaqti bo'yicha, chunki foydalanuvchilar o'sha yerda.
  const days = Array.from({ length: 7 }, (_, i) => kstDate(new Date(now - (6 - i) * DAY_MS)));
  const since = new Date(new Date(`${days[0]}T00:00:00+09:00`));

  const [byType, suspended, newUsers, newPosts, posts, hiddenPosts, comments, likes, listingsByStatus, activeByType, ads, pendingReports, devices] =
    await Promise.all([
      prisma.user.groupBy({ by: ["userType"], _count: true }),
      prisma.user.count({ where: { status: "suspended" } }),
      prisma.user.findMany({ where: { createdAt: { gte: since } }, select: { createdAt: true } }),
      prisma.post.findMany({ where: { createdAt: { gte: since }, status: { not: "deleted" } }, select: { createdAt: true } }),
      prisma.post.count({ where: { status: "visible" } }),
      prisma.post.count({ where: { status: "hidden" } }),
      prisma.comment.count(),
      prisma.like.count(),
      prisma.listing.groupBy({ by: ["status"], _count: true }),
      prisma.listing.groupBy({ by: ["listingType"], where: { status: "active" }, _count: true }),
      prisma.adRequest.groupBy({ by: ["status"], _count: true }),
      prisma.report.count({ where: { status: "pending" } }),
      prisma.pushToken.count(),
    ]);

  const count = <T extends string>(rows: Array<Record<string, any>>, key: string, value: T) =>
    rows.find((r) => r[key] === value)?._count ?? 0;
  const perDay = (rows: Array<{ createdAt: Date }>, day: string) => rows.filter((r) => kstDate(r.createdAt) === day).length;

  return res.json({
    users: {
      total: byType.reduce((sum, r) => sum + r._count, 0),
      individual: count(byType, "userType", "individual"),
      organization: count(byType, "userType", "organization"),
      suspended,
      newLast7Days: newUsers.length,
    },
    content: { posts, hiddenPosts, comments, likes },
    listings: {
      active: count(listingsByStatus, "status", "active"),
      pending: count(listingsByStatus, "status", "pending"),
      rejected: count(listingsByStatus, "status", "rejected"),
      closed: count(listingsByStatus, "status", "closed"),
      byType: {
        job: count(activeByType, "listingType", "job"),
        health: count(activeByType, "listingType", "health"),
        education: count(activeByType, "listingType", "education"),
        life: count(activeByType, "listingType", "life"),
      },
    },
    ads: {
      pending: count(ads, "status", "pending"),
      approved: count(ads, "status", "approved"),
      rejected: count(ads, "status", "rejected"),
    },
    reports: { pending: pendingReports },
    push: { devices },
    daily: days.map((date) => ({ date, users: perDay(newUsers, date), posts: perDay(newPosts, date) })),
  });
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
