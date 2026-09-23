// Eski e'lonlarda hudud "서울 강남구", "서울" yoki "전국" kabi erkin matn sifatida saqlangan
// (RegionPicker orqali kiritilgan yangilari esa to'liq rasmiy "{시/도} {시군구}" ko'rinishida
// bo'ladi). Shu farqni hisobga olib, aniq moslik o'rniga "o'z ichiga oladi" mantig'i ishlatiladi.
const SIDO_SUFFIXES = ["특별자치시", "특별자치도", "통합특별시", "광역시", "특별시", "자치도", "자치시", "도"];

function sidoShortName(sido: string): string {
  for (const suffix of SIDO_SUFFIXES) {
    if (sido.endsWith(suffix)) return sido.slice(0, -suffix.length);
  }
  return sido;
}

// filter: RegionPicker'dan kelgan "{시/도}" yoki "{시/도} {시군구}" qiymati, yoki null (전체지역).
export function matchesRegionFilter(filter: string | null, listingRegion: string | null): boolean {
  if (!filter) return true;
  if (!listingRegion || listingRegion.includes("전국")) return true;

  const [sido, sigungu] = filter.split(" ");
  const shortSido = sidoShortName(sido);
  if (!listingRegion.includes(shortSido) && !listingRegion.includes(sido)) return false;
  if (!sigungu || listingRegion.includes(sigungu)) return true;

  // Tuman tanlangan, lekin e'londa faqat shahar darajasi bor - baribir ko'rsatiladi
  // (aniqroq ma'lumot yo'qligi sababli natijani yashirmagan ma'qul).
  return listingRegion.trim() === shortSido || listingRegion.trim() === sido;
}
