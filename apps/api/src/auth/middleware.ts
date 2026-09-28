import { NextFunction, Request, Response } from "express";
import { verifyAccessToken, JwtPayload } from "./jwt";
import { prisma } from "../prisma";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      auth?: JwtPayload;
    }
  }
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "로그인이 필요합니다" });
  }
  try {
    const token = header.slice("Bearer ".length);
    req.auth = verifyAccessToken(token);
  } catch {
    return res.status(401).json({ message: "토큰이 유효하지 않거나 만료되었습니다" });
  }
  // Admin foydalanuvchini to'xtatsa, token muddati tugashini kutmasdan darhol ta'sir qilishi uchun.
  const user = await prisma.user.findUnique({ where: { id: req.auth.userId }, select: { status: true } });
  if (!user) return res.status(401).json({ message: "로그인이 필요합니다" });
  if (user.status === "suspended") return res.status(403).json({ message: "계정이 정지되었습니다" });
  next();
}

export function requireRole(...roles: Array<"individual" | "organization" | "admin">) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.auth || !roles.includes(req.auth.userType)) {
      return res.status(403).json({ message: "권한이 없습니다" });
    }
    next();
  };
}
