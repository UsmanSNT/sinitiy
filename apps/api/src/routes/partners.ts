import { Router } from "express";
import { partnerSchema } from "@sinity/shared";
import { prisma } from "../prisma";
import { requireAuth, requireRole } from "../auth/middleware";
import { parseWindow, toKstDate, windowWhere } from "../lib/window";

export const partnersRouter = Router();

function serialize(p: any) {
  return { ...p, displayStart: toKstDate(p.displayStart), displayEnd: toKstDate(p.displayEnd) };
}

// Foydalanuvchilar uchun: faqat ko'rsatish davri ichidagi hamkorlar.
partnersRouter.get("/", async (_req, res) => {
  const items = await prisma.partnerCompany.findMany({
    where: windowWhere("displayStart", "displayEnd"),
    orderBy: { createdAt: "desc" },
  });
  return res.json(items.map(serialize));
});

// Admin boshqaruvi uchun: davrdan tashqaridagilar ham ko'rinadi. "/:id" dan oldin turishi shart.
partnersRouter.get("/admin/all", requireAuth, requireRole("admin"), async (_req, res) => {
  const items = await prisma.partnerCompany.findMany({ orderBy: { createdAt: "desc" } });
  return res.json(items.map(serialize));
});

function toData(input: ReturnType<typeof partnerSchema.parse>, window: { start: Date | null | undefined; end: Date | null | undefined }) {
  const { displayStart: _s, displayEnd: _e, homepage, location, category, service, description, ...rest } = input;
  return {
    ...rest,
    homepage: homepage || null,
    location: location || null,
    category: category || null,
    service: service || null,
    description: description || null,
    displayStart: window.start ?? null,
    displayEnd: window.end ?? null,
  };
}

partnersRouter.post("/", requireAuth, requireRole("admin"), async (req, res) => {
  const parsed = partnerSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: parsed.error.issues[0]?.message ?? "잘못된 요청입니다" });
  const window = parseWindow(parsed.data.displayStart, parsed.data.displayEnd);
  if ("error" in window) return res.status(400).json({ message: window.error });
  const item = await prisma.partnerCompany.create({ data: toData(parsed.data, window) });
  return res.status(201).json(serialize(item));
});

partnersRouter.put("/:id", requireAuth, requireRole("admin"), async (req, res) => {
  const parsed = partnerSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: parsed.error.issues[0]?.message ?? "잘못된 요청입니다" });
  const window = parseWindow(parsed.data.displayStart, parsed.data.displayEnd);
  if ("error" in window) return res.status(400).json({ message: window.error });
  const existing = await prisma.partnerCompany.findUnique({ where: { id: req.params.id } });
  if (!existing) return res.status(404).json({ message: "찾을 수 없습니다" });
  const item = await prisma.partnerCompany.update({ where: { id: existing.id }, data: toData(parsed.data, window) });
  return res.json(serialize(item));
});

partnersRouter.delete("/:id", requireAuth, requireRole("admin"), async (req, res) => {
  const existing = await prisma.partnerCompany.findUnique({ where: { id: req.params.id } });
  if (!existing) return res.status(404).json({ message: "찾을 수 없습니다" });
  await prisma.partnerCompany.delete({ where: { id: existing.id } });
  return res.status(204).send();
});
