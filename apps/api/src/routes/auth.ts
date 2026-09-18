import { Router } from "express";
import bcrypt from "bcryptjs";
import { signupSchema, loginSchema } from "@sinity/shared";
import { prisma } from "../prisma";
import { signAccessToken, signRefreshToken } from "../auth/jwt";

export const authRouter = Router();

authRouter.post("/signup", async (req, res) => {
  const parsed = signupSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "잘못된 요청입니다", errors: parsed.error.flatten() });
  }
  const input = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) {
    return res.status(409).json({ message: "이미 등록된 이메일입니다" });
  }

  if (input.userType === "organization") {
    const existingOrg = await prisma.organizationProfile.findUnique({
      where: { businessNumber: input.businessNumber },
    });
    if (existingOrg) {
      return res.status(409).json({ message: "이미 등록된 사업자번호입니다" });
    }
  }

  const passwordHash = await bcrypt.hash(input.password, 10);

  const user = await prisma.user.create({
    data: {
      email: input.email,
      passwordHash,
      name: input.name,
      phone: input.phone,
      userType: input.userType,
      ...(input.userType === "organization"
        ? {
            organizationProfile: {
              create: {
                businessNumber: input.businessNumber,
                orgName: input.orgName,
                address: input.address,
                homepage: input.homepage || null,
              },
            },
          }
        : {}),
    },
    include: { organizationProfile: true },
  });

  const payload = { userId: user.id, userType: user.userType };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  return res.status(201).json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      userType: user.userType,
      status: user.status,
      createdAt: user.createdAt,
      organizationProfile: user.organizationProfile,
    },
    accessToken,
    refreshToken,
  });
});

authRouter.post("/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "잘못된 요청입니다" });
  }
  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({
    where: { email },
    include: { organizationProfile: true },
  });
  if (!user) {
    return res.status(401).json({ message: "이메일 또는 비밀번호가 올바르지 않습니다" });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ message: "이메일 또는 비밀번호가 올바르지 않습니다" });
  }

  if (user.status === "suspended") {
    return res.status(403).json({ message: "계정이 정지되었습니다" });
  }

  const payload = { userId: user.id, userType: user.userType };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  return res.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      userType: user.userType,
      status: user.status,
      createdAt: user.createdAt,
      organizationProfile: user.organizationProfile,
    },
    accessToken,
    refreshToken,
  });
});
