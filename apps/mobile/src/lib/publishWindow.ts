// 게시기간 / 노출기간 ("YYYY-MM-DD", KST) - ekranlarda holat va matn ko'rsatish uchun.
export type WindowState = "none" | "scheduled" | "live" | "expired";

function todayKst() {
  return new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

export function windowState(start: string | null, end: string | null): WindowState {
  if (!start && !end) return "none";
  const today = todayKst();
  if (start && today < start) return "scheduled";
  if (end && today > end) return "expired";
  return "live";
}

export function windowText(start: string | null, end: string | null): string | null {
  if (!start && !end) return null;
  const f = (d: string) => d.replace(/-/g, ".");
  return `${start ? f(start) : "상시"} ~ ${end ? f(end) : "상시"}`;
}
