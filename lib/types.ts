export interface QuarantineData {
  item: string;      // 품명 (소정육, 냉동 등)
  category?: string; // 구분 (가금, 냉동, 냉장 등)
  product: string;   // 부위 (기타, 갈비, 삼겹살 등)
  country: string;   // 국가명
  volume: number;    // 검역량
  year: number;      // 연도
  month?: number;    // 월 (선택)
}

export interface AggregatedStats {
  totalVolume: number;
  yearRange: [number, number];
  yoyGrowth?: number;
  topCountries: { name: string; volume: number }[];
  topProducts: { name: string; volume: number }[];
  byYear: { year: number; volume: number }[];
}
