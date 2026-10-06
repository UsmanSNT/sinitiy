import { z } from "zod";

// Aloqa telefoni: faqat raqam/tire/bo'shliq; 02-xxx-xxxx, 0xx-xxx-xxxx, 010-xxxx-xxxx (9~11 raqam, 0 bilan boshlanadi)
// yoki 1588-xxxx kabi 8 xonali vakillik raqami. 0000000000 kabi bir xil raqamlar rad etiladi.
export function isValidKoreanPhone(value: string): boolean {
  const v = value.trim();
  if (!/^[0-9\-\s]+$/.test(v)) return false;
  const digits = v.replace(/\D/g, "");
  if (/^(\d)\1+$/.test(digits)) return false;
  if (/^0\d{8,10}$/.test(digits)) return true;
  return /^1[5-8]\d{6}$/.test(digits);
}
const contactPhone = z.string().refine(isValidKoreanPhone, "전화번호를 올바르게 입력해주세요");

// Ro'yxatdan o'tish - user_type tanlanadi, organization bo'lsa business_number majburiy.
export const signupIndividualSchema = z.object({
  userType: z.literal("individual"),
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1),
  phone: z.string().min(9).optional(),
});

export const signupOrganizationSchema = z.object({
  userType: z.literal("organization"),
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1),
  phone: z.string().min(9).optional(),
  businessNumber: z.string().min(10, "사업자번호는 10자리입니다"),
  orgName: z.string().min(1),
  address: z.string().optional(),
  homepage: z.string().url().optional().or(z.literal("")),
});

export const signupSchema = z.discriminatedUnion("userType", [
  signupIndividualSchema,
  signupOrganizationSchema,
]);

export type SignupInput = z.infer<typeof signupSchema>;

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type LoginInput = z.infer<typeof loginSchema>;

// Yuklangan rasm DB'da nisbiy yo'l sifatida saqlanadi (/api/uploads/<fayl>) - emulyator,
// staging va production'da host har xil bo'lgani uchun to'liq URL saqlab bo'lmaydi.
export const uploadedImagePath = z.string().regex(/^\/api\/uploads\/[\w-]+\.(jpg|png|webp)$/);
const httpImageUrl = z.string().url().regex(/^https?:\/\//);

export const createPostSchema = z.object({
  categoryId: z.string().min(1),
  title: z.string().min(1).max(200),
  content: z.string().min(1),
  images: z.array(z.union([httpImageUrl, uploadedImagePath])).max(3).default([]),
  region: z.string().max(50).optional().or(z.literal("")),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;

export const createCommentSchema = z.object({
  postId: z.string().min(1),
  content: z.string().min(1).max(1000),
});

export type CreateCommentInput = z.infer<typeof createCommentSchema>;

export const reportSchema = z.object({
  targetType: z.enum(["post", "comment"]),
  targetId: z.string().min(1),
  reason: z.string().min(1).max(500),
});

export type ReportInput = z.infer<typeof reportSchema>;

const imageList = z.array(z.union([httpImageUrl, uploadedImagePath])).max(3).default([]);
// Bo'sh qator ham ruxsat (formada maydon bo'sh qoldirilganda); http(s) manzil bo'lishi shart.
// Sana: "YYYY-MM-DD" (KST). Bo'sh qator - cheklovsiz.
export const dateOnly = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "날짜 형식이 올바르지 않습니다").optional().or(z.literal(""));

const optionalUrl = z.string().url().regex(/^https?:\/\//).optional().or(z.literal(""));

export const createListingSchema = z.object({
  listingType: z.enum(["job", "health", "education", "life"]),
  title: z.string().min(1).max(200),
  images: imageList,
  content: z.string().min(1),
  category: z.string().max(50).optional(),
  region: z.string().max(50).optional(),
  summary: z.string().max(200).optional(),
  period: z.string().max(100).optional(),
  targetAudience: z.string().min(1),
  applyMethod: z.string().min(1),
  applyUrl: optionalUrl,
  publishStart: dateOnly,
  publishEnd: dateOnly,
  phone: contactPhone,
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export type CreateListingInput = z.infer<typeof createListingSchema>;

export const createAdRequestSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1),
  images: imageList,
  phone: contactPhone,
  homepage: z.string().url().optional().or(z.literal("")),
  displayStart: dateOnly,
  displayEnd: dateOnly,
});

export type CreateAdRequestInput = z.infer<typeof createAdRequestSchema>;

export const createCategorySchema = z.object({
  name: z.string().min(1).max(50),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;

export const createInquirySchema = z.object({
  title: z.string().trim().min(1).max(100),
  content: z.string().trim().min(1).max(2000),
});

export type CreateInquiryInput = z.infer<typeof createInquirySchema>;

export const partnerSchema = z.object({
  name: z.string().trim().min(1).max(100),
  location: z.string().max(50).optional().or(z.literal("")),
  address: z.string().trim().min(1).max(200),
  phone: contactPhone,
  homepage: optionalUrl,
  category: z.string().max(50).optional().or(z.literal("")),
  service: z.string().max(100).optional().or(z.literal("")),
  description: z.string().max(1000).optional().or(z.literal("")),
  recommended: z.boolean().default(false),
  images: imageList,
  displayStart: dateOnly,
  displayEnd: dateOnly,
});

export type PartnerInput = z.infer<typeof partnerSchema>;
