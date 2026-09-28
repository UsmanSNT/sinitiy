import { Router } from "express";
import { reportSchema } from "@sinity/shared";
import { prisma } from "../prisma";
import { requireAuth, requireRole } from "../auth/middleware";

export const reportsRouter = Router();

reportsRouter.post("/", requireAuth, async (req, res) => {
  const parsed = reportSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "잘못된 요청입니다" });

  const { targetType, targetId, reason } = parsed.data;

  const report = await prisma.report.create({
    data: {
      targetType,
      postId: targetType === "post" ? targetId : undefined,
      commentId: targetType === "comment" ? targetId : undefined,
      reporterId: req.auth!.userId,
      reason,
    },
  });

  return res.status(201).json(report);
});

reportsRouter.get("/", requireAuth, requireRole("admin"), async (_req, res) => {
  const reports = await prisma.report.findMany({
    include: { reporter: true, post: true, comment: true },
    orderBy: { createdAt: "desc" },
  });
  return res.json(
    reports.map((r) => ({
      id: r.id,
      targetType: r.targetType,
      reason: r.reason,
      status: r.status,
      createdAt: r.createdAt,
      reporterName: r.reporter.name,
      postId: r.postId ?? r.comment?.postId ?? null,
      postTitle: r.post?.title ?? null,
      postStatus: r.post?.status ?? null,
      commentContent: r.comment?.content ?? null,
    }))
  );
});

reportsRouter.patch("/:id", requireAuth, requireRole("admin"), async (req, res) => {
  const { status } = req.body as { status: string };
  if (!["pending", "reviewed", "dismissed"].includes(status)) return res.status(400).json({ message: "잘못된 요청입니다" });
  const report = await prisma.report.update({ where: { id: req.params.id }, data: { status: status as any } });
  return res.json(report);
});
