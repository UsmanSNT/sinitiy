import type { Listing, ListingType } from "@sinity/shared";

export const listingTypeLabel: Record<ListingType, string> = {
  job: "일자리·복지",
  health: "건강·의료",
  education: "교육·문화·행사",
  life: "생활편의",
};

// Ilova ekranlaridagi tablar bilan bir xil kategoriyalar.
export const categoriesByType: Record<ListingType, string[]> = {
  job: [],
  health: ["병원", "건강정보", "예방·검진"],
  education: ["교육", "문화·여가", "행사"],
  life: ["교통", "주거", "생활지원"],
};

export const statusLabel: Record<Listing["status"], string> = {
  pending: "승인 대기",
  active: "게시 중",
  rejected: "반려",
  closed: "마감",
  hidden: "숨김",
};

export const statusColor: Record<Listing["status"], { fg: string; bg: string }> = {
  pending: { fg: "#c77b0a", bg: "#fff3dd" },
  active: { fg: "#1a9a5a", bg: "#e3f7ec" },
  rejected: { fg: "#d4483f", bg: "#fdeaea" },
  closed: { fg: "#6b7688", bg: "#eef1f5" },
  hidden: { fg: "#6b7688", bg: "#eef1f5" },
};
