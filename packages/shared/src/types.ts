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
  phone: string;
  latitude: number | null;
  longitude: number | null;
  status: "active" | "closed" | "hidden" | "pending" | "rejected";
  createdAt: string;
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
