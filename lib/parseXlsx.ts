import { QuarantineData } from "./types";

const normalizeKey = (key: string): string =>
  key.replace(/\s+/g, "").toLowerCase().replace(/[^a-z0-9가-힣]/g, "");

const normalizeVolume = (val: unknown): number => {
  if (typeof val === "number") return Number.isFinite(val) ? val : 0;
  if (typeof val === "string") {
    const cleaned = val.replace(/,/g, "").trim();
    const num = Number(cleaned);
    return Number.isFinite(num) ? num : 0;
  }
  return 0;
};

const normalizeYear = (val: unknown): number => {
  if (typeof val === "number") return Number.isFinite(val) ? val : 0;
  if (typeof val === "string") {
    const num = parseInt(val.match(/\d+/)?.[0] || "0", 10);
    return Number.isFinite(num) ? num : 0;
  }
  return 0;
};

const COLUMN_MAPPINGS: Record<string, string[]> = {
  item: ["품명", "대분류", "category", "품목"],
  category: ["구분", "분류", "타입", "type", "classification"],
  product: ["부위", "세부품명", "itemname", "product", "part"],
  country: ["국가명", "국가", "수출국", "country", "origin"],
  volume: ["검역량", "중량", "중량kgea", "수량", "weight", "volume", "quantity"],
  year: ["연도", "년도", "year"],
  month: ["월", "month"],
};

export const parseQuarantineXlsx = async (file: File): Promise<QuarantineData[]> => {
  // ✅ 배포 안정: 동적 import
  const XLSX = await import("xlsx");

  const buf = await file.arrayBuffer();
  const workbook = XLSX.read(buf, { type: "array" });
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];

  const jsonData = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet, { defval: "" });
  if (!jsonData.length) return [];

  const keys = Object.keys(jsonData[0] ?? {});
  const mapping: Record<string, string> = {};

  for (const key of keys) {
    const normalized = normalizeKey(key);
    for (const [target, synonyms] of Object.entries(COLUMN_MAPPINGS)) {
      const hit = synonyms.some((syn) => {
        const ns = normalizeKey(syn);
        return normalized === ns || normalized.includes(ns);
      });
      if (hit) {
        mapping[target] = key;
        break;
      }
    }
  }

  const required = ["item", "country", "volume", "year"];
  const missing = required.filter((req) => !mapping[req]);
  if (missing.length) throw new Error(`필수 컬럼이 누락되었습니다: ${missing.join(", ")}`);

  return jsonData
    .map((row) => ({
      item: String(row[mapping["item"]] ?? "").trim(),
      category: mapping["category"] ? String(row[mapping["category"]] ?? "").trim() : undefined,
      product: String((row[mapping["product"]] ?? row[mapping["item"]] ?? "") as unknown).trim(),
      country: String(row[mapping["country"]] ?? "").trim(),
      volume: normalizeVolume(row[mapping["volume"]]),
      year: normalizeYear(row[mapping["year"]]),
      month: mapping["month"] ? normalizeYear(row[mapping["month"]]) : undefined,
    }))
    .filter((d) => d.year > 0 && d.volume >= 0);
};
