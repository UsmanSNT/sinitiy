import { Router } from "express";
import { prisma } from "../prisma";
import { requireAuth, requireRole } from "../auth/middleware";

export const partnersRouter = Router();

partnersRouter.get("/", async (_req, res) => {
  const items = await prisma.partnerCompany.findMany({ orderBy: { createdAt: "desc" } });
  return res.json(items);
});

partnersRouter.post("/", requireAuth, requireRole("admin"), async (req, res) => {
  const { name, location, address, phone, homepage } = req.body;
  if (!name || !address || !phone) {
    return res.status(400).json({ message: "잘못된 요청입니다" });
  }
  const item = await prisma.partnerCompany.create({ data: { name, location, address, phone, homepage } });
  return res.status(201).json(item);
});

partnersRouter.put("/:id", requireAuth, requireRole("admin"), async (req, res) => {
  const { name, location, address, phone, homepage } = req.body;
  const item = await prisma.partnerCompany.update({
    where: { id: req.params.id },
    data: { name, location, address, phone, homepage },
  });
  return res.json(item);
});

partnersRouter.delete("/:id", requireAuth, requireRole("admin"), async (req, res) => {
  await prisma.partnerCompany.delete({ where: { id: req.params.id } });
  return res.status(204).send();
});
