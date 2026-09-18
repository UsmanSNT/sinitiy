import { Router } from "express";
import { prisma } from "../prisma";
import { requireAuth } from "../auth/middleware";

export const meRouter = Router();

meRouter.get("/", requireAuth, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.auth!.userId },
    include: { organizationProfile: true },
  });
  if (!user) return res.status(404).json({ message: "사용자를 찾을 수 없습니다" });

  return res.json({
    id: user.id,
    email: user.email,
    name: user.name,
    phone: user.phone,
    userType: user.userType,
    status: user.status,
    createdAt: user.createdAt,
    organizationProfile: user.organizationProfile,
  });
});
