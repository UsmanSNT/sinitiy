import { z } from "zod";

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

export const createPostSchema = z.object({
  categoryId: z.string().min(1),
  title: z.string().min(1).max(200),
  content: z.string().min(1),
  images: z.array(z.string().url()).default([]),
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

export const createListingSchema = z.object({
  listingType: z.enum(["job", "health", "education", "life"]),
  title: z.string().min(1).max(200),
  images: z.array(z.string().url()).default([]),
  content: z.string().min(1),
  category: z.string().max(50).optional(),
  region: z.string().max(50).optional(),
  summary: z.string().max(200).optional(),
  period: z.string().max(100).optional(),
  targetAudience: z.string().min(1),
  applyMethod: z.string().min(1),
  phone: z.string().min(9),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export type CreateListingInput = z.infer<typeof createListingSchema>;

export const createAdRequestSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1),
  images: z.array(z.string().url()).default([]),
  phone: z.string().min(9),
  homepage: z.string().url().optional().or(z.literal("")),
});

export type CreateAdRequestInput = z.infer<typeof createAdRequestSchema>;

export const createCategorySchema = z.object({
  name: z.string().min(1).max(50),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
