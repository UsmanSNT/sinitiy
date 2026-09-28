import type { AdRequestStatus } from "@sinity/shared";

// Rasm bo'lmagan banner uchun fon rangi - karuseldagi tartib bo'yicha, shunda yonma-yon bannerlar doim har xil rangda.
const bannerColors = ["#1d3a6e", "#1a7f55", "#b8571a", "#5b45b0", "#13727a"];

export function bannerColor(index: number) {
  return bannerColors[index % bannerColors.length];
}

export const adStatusMeta: Record<AdRequestStatus, { label: string; fg: string; bg: string }> = {
  pending: { label: "심사 중", fg: "#c77b0a", bg: "#fff3dd" },
  approved: { label: "게시 중", fg: "#1a9a5a", bg: "#e3f7ec" },
  rejected: { label: "반려", fg: "#d4483f", bg: "#fdeaea" },
};
