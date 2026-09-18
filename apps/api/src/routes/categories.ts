import { Router } from "express";
import { createCategorySchema } from "@sinity/shared";
import { prisma } from "../prisma";
import { requireAuth, requireRole } from "../auth/middleware";

export const categoriesRouter = Router();

categoriesRouter.get("/", async (_req, res) => {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  return res.json(categories);
});

categoriesRouter.post("/", requireAuth, requireRole("admin"), async (req, res) => {
  const parsed = createCategorySchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "잘못된 요청입니다" });

  const category = await prisma.category.create({ data: { name: parsed.data.name } });
  return res.status(201).json(category);
});

categoriesRouter.delete("/:id", requireAuth, requireRole("admin"), async (req, res) => {
  await prisma.category.delete({ where: { id: req.params.id } });
  return res.status(204).send();
});
