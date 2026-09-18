import { Router } from "express";
import { prisma } from "../prisma";
import { requireAuth } from "../auth/middleware";

export const notificationsRouter = Router();

notificationsRouter.get("/", requireAuth, async (req, res) => {
  const items = await prisma.notification.findMany({
    where: { userId: req.auth!.userId },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  return res.json(items);
});

notificationsRouter.patch("/:id/read", requireAuth, async (req, res) => {
  const notif = await prisma.notification.findUnique({ where: { id: req.params.id } });
  if (!notif || notif.userId !== req.auth!.userId) return res.status(404).json({ message: "찾을 수 없습니다" });
  const updated = await prisma.notification.update({ where: { id: req.params.id }, data: { isRead: true } });
  return res.json(updated);
});
