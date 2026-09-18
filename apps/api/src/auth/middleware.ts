import { NextFunction, Request, Response } from "express";
import { verifyAccessToken, JwtPayload } from "./jwt";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      auth?: JwtPayload;
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "로그인이 필요합니다" });
  }
  try {
    const token = header.slice("Bearer ".length);
    req.auth = verifyAccessToken(token);
    next();
  } catch {
    return res.status(401).json({ message: "토큰이 유효하지 않거나 만료되었습니다" });
  }
}

export function requireRole(...roles: Array<"individual" | "organization" | "admin">) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.auth || !roles.includes(req.auth.userType)) {
      return res.status(403).json({ message: "권한이 없습니다" });
    }
    next();
  };
}
