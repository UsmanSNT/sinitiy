import { randomBytes } from "node:crypto";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();


// Namunaviy tashkilotlar va e'lonlar (ilovadagi mock ma'lumotlarga mos). Har ishga tushganda qayta yaratiladi.
type Row = { org: string; listingType: "job" | "health" | "education" | "life"; category: string; region: string; title: string; period: string; content: string; phone: string; targetAudience: string; applyMethod: string };
const rows: Row[] = [
  { org: "서울시", listingType: "job", category: "일자리", region: "서울", title: "시니어 인턴십 참여자 모집", period: "2025.05.20 - 06.30", content: "시니어의 경험과 노하우를 활용한 사회활동에 함께할 참여자를 모집합니다. 지원자격과 일정을 확인하고 지금 신청해 보세요.", phone: "02-2133-7970", targetAudience: "만 60세 이상 시니어", applyMethod: "온라인 신청" },
  { org: "보건복지부", listingType: "job", category: "일자리", region: "전국", title: "노인일자리 및 사회활동 지원사업", period: "2025.05.15 - 06.15", content: "노인일자리 및 사회활동 지원사업 참여자를 모집합니다. 지역 시니어클럽을 통해 신청할 수 있습니다.", phone: "129", targetAudience: "만 65세 이상", applyMethod: "지역 시니어클럽 방문" },
  { org: "보건복지부", listingType: "job", category: "복지정책", region: "전국", title: "기초연금 신청 안내", period: "상시", content: "만 65세 이상 어르신 중 소득인정액이 기준 이하인 분께 기초연금을 지급합니다.", phone: "1355", targetAudience: "만 65세 이상", applyMethod: "주민센터 방문 또는 온라인 신청" },
  { org: "강남구", listingType: "job", category: "일자리", region: "서울 강남구", title: "경력·노하우 활용 인력 모집", period: "2025.05.10 - 05.31", content: "경력과 노하우를 활용해 지역사회에 기여할 시니어 인력을 모집합니다.", phone: "02-3423-5000", targetAudience: "만 60세 이상 시니어", applyMethod: "방문 신청 후 서류 접수" },
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
    // Email orgName'ning o'zidan (indeksdan emas) hosil qilinadi - shu bilan rows ro'yxati
    // tartibi o'zgarganda (masalan yangi qator qo'shilganda) eski email boshqa nomga
    // "surilib" qolmaydi (bu avval organization nomlari aralashib ketishiga sabab bo'lgan).
    const email = `seed-org-${Buffer.from(orgName).toString("hex")}@sinity.local`;
    const user = await prisma.user.upsert({
      where: { email },
      update: { name: orgName, organizationProfile: { update: { orgName } } },
      create: {
        email,
        name: orgName,
        userType: "organization",
        // Tasodifiy parol: seed tashkilotlari faqat e'lon egasi sifatida kerak, ularga hech kim kira olmasligi lozim.
        passwordHash: await bcrypt.hash(randomBytes(32).toString("hex"), 10),
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

const partners = [
  { name: "행복한 요양원", category: "제휴혜택", service: "요양·돌봄 서비스", recommended: true, location: "서울 강남구", address: "서울 강남구 테헤란로 123", phone: "02-111-2222", homepage: "https://www.happycare.co.kr", description: "쾌적한 환경과 전문적인 돌봄으로 시니어의 행복한 노후를 함께합니다." },
  { name: "시니어 여행센터", category: "추천서비스", service: "여행·레저 맞춤 상품", recommended: false, location: "서울 종로구", address: "서울 종로구 종로 45", phone: "02-222-3333", homepage: null, description: "시니어 맞춤형 국내외 여행 상품을 안내해 드립니다." },
  { name: "시니어 여행사", category: "추천서비스", service: "관광·테마 여행 상품", recommended: false, location: "부산 해운대구", address: "부산 해운대구 해운대로 200", phone: "051-333-4444", homepage: null, description: "편안한 일정의 테마 여행을 함께합니다." },
  { name: "건강검진센터", category: "제휴혜택", service: "건강·의료 제휴 프로그램", recommended: false, location: "전국", address: "서울 서초구 서초대로 77", phone: "1588-5555", homepage: null, description: "제휴 회원을 위한 건강검진 할인 프로그램을 제공합니다." },
];

// PartnerCompany'da unique kalit yo'q - nom bo'yicha topib yangilanadi, admin qo'shgan hamkorlar o'chirilmaydi.
async function seedPartners() {
  for (const p of partners) {
    const existing = await prisma.partnerCompany.findFirst({ where: { name: p.name } });
    if (existing) await prisma.partnerCompany.update({ where: { id: existing.id }, data: p });
    else await prisma.partnerCompany.create({ data: p });
  }
  console.log("Seed partners:", partners.length);
}

async function main() {
  const names = ["자유게시판", "동네소식", "취미생활"];
  for (const name of names) {
    await prisma.category.upsert({ where: { name }, update: {}, create: { name } });
  }
  console.log("Seed done:", names.join(", "));
  await seedListings();
  await seedPartners();
}

main().finally(() => prisma.$disconnect());
