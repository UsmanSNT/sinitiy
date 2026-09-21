import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();


// Namunaviy tashkilotlar va e'lonlar (ilovadagi mock ma'lumotlarga mos). Har ishga tushganda qayta yaratiladi.
type Row = { org: string; listingType: "health" | "education" | "life"; category: string; region: string; title: string; period: string; content: string; phone: string; targetAudience: string; applyMethod: string };
const rows: Row[] = [
  { org: "강남구보건소", listingType: "health", category: "병원", region: "서울 강남구", title: "강남시니어 건강검진센터", period: "무료 건강검진 안내", content: "만 60세 이상 시니어를 대상으로 무료 건강검진을 지원합니다. 건강한 노후를 위한 정밀검진, 지금 신청하세요!", phone: "02-987-6543", targetAudience: "만 60세 이상 주민", applyMethod: "전화 신청" },
  { org: "서울시", listingType: "health", category: "예방·검진", region: "서울", title: "독감 예방접종 지원사업", period: "2025.09 - 10", content: "독감 예방접종 비용을 지원합니다. 가까운 지정 의료기관에서 접종하세요.", phone: "02-120", targetAudience: "만 65세 이상", applyMethod: "지정 의료기관 방문" },
  { org: "보건소", listingType: "health", category: "건강정보", region: "전국", title: "치매 예방 프로그램", period: "상시 모집", content: "치매 예방 인지 훈련 프로그램입니다. 가까운 보건소에서 참여할 수 있습니다.", phone: "1899-9988", targetAudience: "만 60세 이상", applyMethod: "보건소 방문 또는 전화" },
  { org: "서초시립경로교육원", listingType: "education", category: "교육", region: "서울 서초구", title: "시니어 스마트폰 교육", period: "05.20", content: "스마트폰 기본부터 실생활 활용까지 시니어 맞춤형 교육으로 더 편리한 일상을 함께하세요.", phone: "02-345-6789", targetAudience: "만 60세 이상", applyMethod: "온라인 신청" },
  { org: "강남구", listingType: "education", category: "문화·여가", region: "서울 강남구", title: "시니어 요가 교실", period: "05.25", content: "매주 진행되는 시니어 요가 수업입니다.", phone: "02-3423-5000", targetAudience: "만 60세 이상", applyMethod: "전화 신청" },
  { org: "서울역사박물관", listingType: "education", category: "행사", region: "서울 종로구", title: "전통문화 체험 행사", period: "06.10", content: "전통문화를 함께 체험하는 시니어 행사입니다.", phone: "02-724-0114", targetAudience: "만 60세 이상", applyMethod: "현장 접수" },
  { org: "강남시니어센터", listingType: "education", category: "문화·여가", region: "서울 강남구", title: "시니어 영화 관람 프로그램", period: "05.28", content: "함께 영화를 관람하는 문화 프로그램입니다.", phone: "02-567-1234", targetAudience: "만 60세 이상", applyMethod: "전화 신청" },
  { org: "서울시", listingType: "life", category: "교통", region: "서울", title: "시니어 교통카드 지원", period: "상시 신청", content: "대중교통 이용 요금을 지원하는 교통카드를 발급합니다.", phone: "02-120", targetAudience: "만 65세 이상", applyMethod: "주민센터 방문" },
  { org: "강남구", listingType: "life", category: "교통", region: "서울 강남구", title: "어르신 콜택시 이용 안내", period: "2025.09 - 12", content: "이동이 불편한 어르신을 위한 콜택시 이용 안내입니다.", phone: "02-3423-5000", targetAudience: "만 65세 이상", applyMethod: "전화 신청" },
  { org: "국토교통부", listingType: "life", category: "주거", region: "전국", title: "주택 수리 지원사업", period: "2025.05 - 08", content: "노후 주택 수리 및 안전 설비를 지원합니다.", phone: "1599-0001", targetAudience: "저소득 어르신", applyMethod: "주민센터 신청" },
  { org: "LH", listingType: "life", category: "주거", region: "전국", title: "공공임대주택 입주 안내", period: "상시 모집", content: "어르신을 위한 공공임대주택 입주자를 모집합니다.", phone: "1600-1004", targetAudience: "만 65세 이상 무주택자", applyMethod: "온라인 신청" },
  { org: "강남시니어복지관", listingType: "life", category: "생활지원", region: "서울 강남구", title: "도시락 배달 서비스", period: "주 5회 지원", content: "거동이 불편한 어르신께 도시락을 배달해 드립니다.", phone: "02-567-8901", targetAudience: "독거 어르신", applyMethod: "전화 신청" },
  { org: "보건복지부", listingType: "life", category: "생활지원", region: "전국", title: "가사·간병 방문 지원", period: "상시 신청", content: "가사와 간병을 방문하여 지원합니다.", phone: "129", targetAudience: "만 65세 이상", applyMethod: "주민센터 신청" },
];

async function seedListings() {
  const orgNames = [...new Set(rows.map((r) => r.org))];
  const orgIds: Record<string, string> = {};

  for (const [n, orgName] of orgNames.entries()) {
    const email = `seed-org-${n + 1}@sinity.local`;
    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        name: orgName,
        userType: "organization",
        passwordHash: await bcrypt.hash("seed-org-not-for-login", 10),
        organizationProfile: { create: { businessNumber: `000-00-${String(n + 1).padStart(5, "0")}`, orgName, verified: true } },
      },
    });
    orgIds[orgName] = user.id;
  }

  // Seed e'lonlarini har safar tozalab qayta yaratamiz (haqiqiy tashkilot e'lonlariga tegmaydi).
  await prisma.listing.deleteMany({ where: { orgId: { in: Object.values(orgIds) } } });
  for (const { org, ...r } of [...rows].reverse()) {
    await prisma.listing.create({ data: { ...r, orgId: orgIds[org], status: "active" } });
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
