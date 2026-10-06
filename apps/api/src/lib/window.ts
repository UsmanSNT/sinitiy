// Sana oynasi (게시기간 / 노출기간): "YYYY-MM-DD" (KST) <-> DateTime.
const KST = "+09:00";

export function windowWhere(startField: string, endField: string, now = new Date()) {
  return {
    AND: [
      { OR: [{ [startField]: null }, { [startField]: { lte: now } }] },
      { OR: [{ [endField]: null }, { [endField]: { gte: now } }] },
    ],
  };
}

export function toKstDate(date: Date | null | undefined): string | null {
  if (!date) return null;
  return new Date(date.getTime() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

// undefined - maydon yuborilmagan (o'zgartirmaslik); "" - tozalash (null); "YYYY-MM-DD" - Date.
function parseDay(value: string | undefined, endOfDay: boolean): Date | null | undefined {
  if (value === undefined) return undefined;
  if (value === "") return null;
  const d = new Date(`${value}T${endOfDay ? "23:59:59.999" : "00:00:00.000"}${KST}`);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

// Natija: { start, end } (undefined = o'zgartirmaslik, null = tozalash) yoki Korean xato matni.
export function parseWindow(
  start: string | undefined,
  end: string | undefined,
  existing?: { start: Date | null; end: Date | null }
): { start: Date | null | undefined; end: Date | null | undefined } | { error: string } {
  const s = parseDay(start, false);
  const e = parseDay(end, true);
  if ((start && s === undefined) || (end && e === undefined)) return { error: "날짜 형식이 올바르지 않습니다" };
  const finalStart = s === undefined ? existing?.start ?? null : s;
  const finalEnd = e === undefined ? existing?.end ?? null : e;
  if (finalStart && finalEnd && finalStart > finalEnd) return { error: "종료일은 시작일 이후여야 합니다" };
  return { start: s, end: e };
}
