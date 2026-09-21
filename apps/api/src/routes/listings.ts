import { Router } from "express";
import { createListingSchema } from "@sinity/shared";
import { prisma } from "../prisma";
import { requireAuth, requireRole } from "../auth/middleware";

export const listingsRouter = Router();

function serializeListing(listing: any) {
  return {
    id: listing.id,
    orgId: listing.orgId,
    orgName: listing.org?.orgName,
    listingType: listing.listingType,
    title: listing.title,
    images: listing.images,
    content: listing.content,
    category: listing.category,
    region: listing.region,
    summary: listing.summary,
    period: listing.period,
    targetAudience: listing.targetAudience,
    applyMethod: listing.applyMethod,
    phone: listing.phone,
    latitude: listing.latitude,
    longitude: listing.longitude,
    status: listing.status,
    createdAt: listing.createdAt,
  };
}

listingsRouter.get("/", async (req, res) => {
  const { listingType, category, region, q, page = "1", pageSize = "20" } = req.query as Record<string, string>;
  const take = Math.min(Number(pageSize) || 20, 50);
  const skip = (Math.max(Number(page) || 1, 1) - 1) * take;

  const where = {
    status: "active" as const,
    ...(listingType ? { listingType: listingType as any } : {}),
    ...(category ? { category } : {}),
    ...(region ? { region } : {}),
    ...(q ? { title: { contains: q, mode: "insensitive" as const } } : {}),
  };

  const [items, total] = await Promise.all([
    prisma.listing.findMany({
      where,
      include: { org: true },
      orderBy: { createdAt: "desc" },
      take,
      skip,
    }),
    prisma.listing.count({ where }),
  ]);

  return res.json({ items: items.map(serializeListing), total, page: Number(page) || 1, pageSize: take });
});

// Tashkilot o'z e'lonlarini (pending/rejected ham) ko'radi. "/:id" dan OLDIN turishi shart.
listingsRouter.get("/mine", requireAuth, requireRole("organization"), async (req, res) => {
  const items = await prisma.listing.findMany({
    where: { orgId: req.auth!.userId, status: { not: "hidden" } },
    include: { org: true },
    orderBy: { createdAt: "desc" },
  });
  return res.json(items.map(serializeListing));
});

listingsRouter.get("/:id", async (req, res) => {
  const listing = await prisma.listing.findUnique({ where: { id: req.params.id }, include: { org: true } });
  if (!listing || listing.status !== "active") return res.status(404).json({ message: "찾을 수 없습니다" });
  return res.json(serializeListing(listing));
});

// Faqat tashkilot (org) va admin yozishi mumkin.
listingsRouter.post("/", requireAuth, requireRole("organization", "admin"), async (req, res) => {
  const parsed = createListingSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "잘못된 요청입니다" });

  const orgId = req.body.orgId ?? req.auth!.userId;
  if (req.auth!.userType === "organization" && orgId !== req.auth!.userId) {
    return res.status(403).json({ message: "권한이 없습니다" });
  }

  // Tashkilot e'loni admin tasdiqlaguncha ko'rinmaydi; admin yozsa darhol faol.
  const status = req.auth!.userType === "admin" ? "active" : "pending";
  const listing = await prisma.listing.create({
    data: { orgId, ...parsed.data, status },
    include: { org: true },
  });

  return res.status(201).json(serializeListing(listing));
});

listingsRouter.put("/:id", requireAuth, requireRole("organization", "admin"), async (req, res) => {
  const listing = await prisma.listing.findUnique({ where: { id: req.params.id } });
  if (!listing) return res.status(404).json({ message: "찾을 수 없습니다" });
  if (req.auth!.userType === "organization" && listing.orgId !== req.auth!.userId) {
    return res.status(403).json({ message: "권한이 없습니다" });
  }

  const parsed = createListingSchema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "잘못된 요청입니다" });

  const updated = await prisma.listing.update({
    where: { id: req.params.id },
    data: parsed.data,
    include: { org: true },
  });

  return res.json(serializeListing(updated));
});

listingsRouter.delete("/:id", requireAuth, requireRole("organization", "admin"), async (req, res) => {
  const listing = await prisma.listing.findUnique({ where: { id: req.params.id } });
  if (!listing) return res.status(404).json({ message: "찾을 수 없습니다" });
  if (req.auth!.userType === "organization" && listing.orgId !== req.auth!.userId) {
    return res.status(403).json({ message: "권한이 없습니다" });
  }
  await prisma.listing.update({ where: { id: req.params.id }, data: { status: "hidden" } });
  return res.status(204).send();
});
