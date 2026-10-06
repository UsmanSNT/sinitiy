import { Router } from "express";
import { prisma } from "../prisma";
import { serializeListing } from "./listings";
import { windowWhere } from "../lib/window";

export const feedRouter = Router();

// 당근'dagi 동네소식 kabi: faqat admin va tashkilotlar e'lonlari, oddiy foydalanuvchi postlari kirmaydi.
// Admin istalgan kategoriyada yozsa 공지, tashkilot faqat 동네소식 kategoriyasida yozsa 소식 bo'ladi.
feedRouter.get("/", async (req, res) => {
  const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 50);

  const [listings, posts] = await Promise.all([
    prisma.listing.findMany({
      where: { status: "active", ...windowWhere("publishStart", "publishEnd") },
      include: { org: true },
      orderBy: { createdAt: "desc" },
      take: limit,
    }),
    prisma.post.findMany({
      where: {
        status: "visible",
        OR: [
          { author: { userType: "admin" } },
          { author: { userType: "organization" }, category: { name: "동네소식" } },
        ],
      },
      include: { author: { include: { organizationProfile: true } } },
      orderBy: { createdAt: "desc" },
      take: limit,
    }),
  ]);

  const items = [
    ...listings.map((l) => ({
      id: `listing-${l.id}`,
      kind: "listing" as const,
      source: l.org.orgName,
      title: l.title,
      createdAt: l.createdAt,
      listing: serializeListing(l),
    })),
    ...posts.map((p) => ({
      id: `post-${p.id}`,
      kind: p.author.userType === "admin" ? ("notice" as const) : ("news" as const),
      source: p.author.userType === "admin" ? "시니티" : p.author.organizationProfile?.orgName ?? p.author.name,
      title: p.title,
      createdAt: p.createdAt,
      postId: p.id,
    })),
  ];

  items.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  return res.json(items.slice(0, limit));
});
