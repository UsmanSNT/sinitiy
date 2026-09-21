import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();


// Namunaviy tashkilot va e'lonlar (ilovadagi mock ma'lumotlarga mos). Bir necha marta ishlatsa ham dublikat bo'lmaydi.
async function seedListings() {
  const email = "seed-org@sinity.local";
  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name: "시니티 샘플기관",
      userType: "organization",
      passwordHash: await bcrypt.hash("seed-org-not-for-login", 10),
      organizationProfile: {
        create: { businessNumber: "000-00-00000", orgName: "강남시니어센터", verified: true },
      },
    },
  });

  const base = { orgId: user.id, status: "active" as const, applyMethod: "전화 문의", phone: "02-1234-5678", targetAudience: "만 60세 이상" };
  const rows = [
    { listingType: "health", category: "병원", region: "서울 강남구", title: "강남시니어 건강검진센터", summary: "강남구보건소 · 무료 건강검진 안내", period: "상시", content: "만 65세 이상 어르신을 위한 무료 건강검진을 운영합니다." },
    { listingType: "health", category: "예방·검진", region: "서울", title: "독감 예방접종 지원사업", summary: "서울시 · 2025.09 - 10", period: "2025.09 - 10", content: "독감 예방접종 비용을 지원합니다." },
    { listingType: "health", category: "건강정보", region: "전국", title: "치매 예방 프로그램", summary: "보건소 · 상시 모집", period: "상시 모집", content: "치매 예방 인지 훈련 프로그램입니다." },
    { listingType: "education", category: "문화·여가", region: "서울 강남구", title: "시니어 요가 교실", summary: "강남구 · 05.25", period: "05.25", content: "매주 진행되는 시니어 요가 수업입니다." },
    { listingType: "education", category: "문화·여가", region: "서울 강남구", title: "시니어 영화 관람 프로그램", summary: "강남시니어센터 · 05.28", period: "05.28", content: "함께 영화를 관람하는 문화 프로그램입니다." },
    { listingType: "life", category: "교통", region: "서울", title: "어르신 교통비 지원", summary: "서울시 · 상시", period: "상시", content: "대중교통 이용 요금을 지원합니다." },
    { listingType: "life", category: "주거", region: "서울", title: "주거환경 개선 지원", summary: "강남구청 · 상시", period: "상시", content: "노후 주택 수리 및 안전 설비를 지원합니다." },
  ] as const;

  for (const r of rows) {
    const exists = await prisma.listing.findFirst({ where: { orgId: user.id, title: r.title } });
    if (!exists) await prisma.listing.create({ data: { ...base, ...r } });
  }
  console.log("Seed listings:", rows.length);
}

async function main() {
  const names = ["자유게시판", "동네소식", "취미생활"];
  for (const name of names) {
    await prisma.category.upsert({ where: { name }, update: {}, create: { name } });
  }
  console.log("Seed done:", names.join(", "));
  await seedListings();
}

main().finally(() => prisma.$disconnect());
