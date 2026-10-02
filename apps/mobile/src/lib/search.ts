// Qidiruv so'rovi bo'sh bo'lsa hammasi mos; aks holda berilgan maydonlardan birortasida
// (katta-kichik harfga e'tiborsiz) so'z bo'lsa mos hisoblanadi.
export function matchesQuery(query: string, ...fields: Array<string | null | undefined>): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return fields.some((f) => f?.toLowerCase().includes(q));
}
