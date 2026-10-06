// Umumiy domen tiplari - web va mobile (React Native) ilovalarida bir xil ishlatiladi.

export type UserType = "individual" | "organization" | "admin";

export interface User {
  id: string;
  email: string;
  phone: string | null;
  name: string;
  userType: UserType;
  status: "active" | "suspended";
  createdAt: string;
}

export interface OrganizationProfile {
  userId: string;
  businessNumber: string;
  orgName: string;
  address: string | null;
  phone: string | null;
  homepage: string | null;
}

export interface AuthUser extends User {
  organizationProfile?: OrganizationProfile | null;
}

export interface Category {
  id: string;
  name: string;
  type: "community";
  createdAt: string;
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  categoryId: string;
  categoryName: string;
  title: string;
  content: string;
  images: string[];
  likeCount: number;
  commentCount: number;
  reportCount: number;
  status: "visible" | "hidden" | "deleted";
  createdAt: string;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: string;
}

export interface MyComment {
  id: string;
  postId: string;
  postTitle: string;
  content: string;
  createdAt: string;
}

export type ListingType = "job" | "health" | "education" | "life";

export interface Listing {
  id: string;
  orgId: string;
  orgName: string;
  listingType: ListingType;
  title: string;
  images: string[];
  content: string;
  category: string | null;
  region: string | null;
  summary: string | null;
  period: string | null;
  targetAudience: string;
  applyMethod: string;
  applyUrl: string | null;
  phone: string;
  latitude: number | null;
  longitude: number | null;
  status: "active" | "closed" | "hidden" | "pending" | "rejected";
  createdAt: string;
}

// Admin ekranlari uchun (parol va ichki maydonlarsiz).
export interface AdminUser {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  userType: UserType;
  status: "active" | "suspended";
  createdAt: string;
  orgName: string | null;
  verified: boolean | null;
}

export interface AdminReport {
  id: string;
  targetType: "post" | "comment";
  reason: string;
  status: "pending" | "reviewed" | "dismissed";
  createdAt: string;
  reporterName: string;
  postId: string | null;
  postTitle: string | null;
  postStatus: Post["status"] | null;
  commentContent: string | null;
}

// Bosh sahifadagi "오늘의 알림" lentasi: admin 공지, tashkilot 동네소식 postlari va tasdiqlangan e'lonlar.
export type FeedKind = "notice" | "news" | "listing";

export interface FeedItem {
  id: string;
  kind: FeedKind;
  source: string;
  title: string;
  createdAt: string;
  postId?: string;
  listing?: Listing;
}

export type AdRequestStatus = "pending" | "approved" | "rejected";

export interface AdRequest {
  id: string;
  orgId: string;
  orgName: string;
  title: string;
  content: string;
  images: string[];
  phone: string;
  homepage: string | null;
  status: AdRequestStatus;
  adminNote: string | null;
  createdAt: string;
}

export interface PartnerCompany {
  id: string;
  name: string;
  location: string | null;
  address: string;
  phone: string;
  homepage: string | null;
  category: string | null;
  service: string | null;
  description: string | null;
  recommended: boolean;
}

export type NotificationType = "comment" | "like" | "ad_approved" | "ad_rejected" | "announcement";

export interface AppNotification {
  id: string;
  userId: string;
  type: NotificationType;
  refId: string | null;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

// Admin 통계 sahifasi uchun (GET /api/admin/stats).
export interface AdminStats {
  users: { total: number; individual: number; organization: number; suspended: number; newLast7Days: number };
  content: { posts: number; hiddenPosts: number; comments: number; likes: number };
  listings: { active: number; pending: number; rejected: number; closed: number; byType: Record<ListingType, number> };
  ads: { pending: number; approved: number; rejected: number };
  reports: { pending: number };
  push: { devices: number };
  // Oxirgi 7 kun (Asia/Seoul sanasi bilan), eskidan yangiga.
  daily: Array<{ date: string; users: number; posts: number }>;
}

export interface Inquiry {
  id: string;
  userId: string;
  userName?: string;
  title: string;
  content: string;
  answer: string | null;
  answeredAt: string | null;
  createdAt: string;
}
