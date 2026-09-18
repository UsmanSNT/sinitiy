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
  const { listingType, page = "1", pageSize = "20" } = req.query as Record<string, string>;
  const take = Math.min(Number(pageSize) || 20, 50);
  const skip = (Math.max(Number(page) || 1, 1) - 1) * take;

  const where = {
    status: "active" as const,
    ...(listingType ? { listingType: listingType as any } : {}),
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

listingsRouter.get("/:id", async (req, res) => {
  const listing = await prisma.listing.findUnique({ where: { id: req.params.id }, include: { org: true } });
  if (!listing) return res.status(404).json({ message: "찾을 수 없습니다" });
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

  const listing = await prisma.listing.create({
    data: { orgId, ...parsed.data },
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
