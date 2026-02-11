import * as XLSX from 'xlsx';
import { QuarantineData } from './types';

/**
 * 컬럼명 정규화: 공백 제거, 소문자화, 특수문자 제거
 */
const normalizeKey = (key: string): string => {
    return key.replace(/\s+/g, '').toLowerCase().replace(/[^a-z0-9가-힣]/g, '');
};

/**
 * 검역량(숫자) 정규화: 쉼표 제거, 숫자로 변환. NaN인 경우 0으로 처리.
 */
const normalizeVolume = (val: any): number => {
    if (typeof val === 'number') return val;
    if (typeof val === 'string') {
        const cleaned = val.replace(/,/g, '');
        const num = parseFloat(cleaned);
        return isNaN(num) ? 0 : num;
    }
    return 0;
};

/**
 * 연도 정규화: 숫자로 변환
 */
const normalizeYear = (val: any): number => {
    if (typeof val === 'number') return val;
    if (typeof val === 'string') {
        const num = parseInt(val.match(/\d+/)?.[0] || '0', 10);
        return num;
    }
    return 0;
};

const COLUMN_MAPPINGS: Record<string, string[]> = {
    item: ['품명', '대분류', 'category', '품목'],
    category: ['구분', '분류', '타입', 'type', 'classification'],
    product: ['부위', '세부품명', 'itemname', 'product', 'part'],
    country: ['국가명', '국가', '수출국', 'country', 'origin'],
    volume: ['검역량', '중량', '중량kgea', '수량', 'weight', 'volume', 'quantity'],
    year: ['연도', '년도', 'year'],
    month: ['월', 'month']
};

export const parseQuarantineXlsx = async (file: File): Promise<QuarantineData[]> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target?.result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];

                // JSON으로 변환 (header: 1을 사용하면 2차원 배열로 나옴)
                const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);

                if (jsonData.length === 0) {
                    resolve([]);
                    return;
                }

                // 실제 컬럼명과 정규화된 매핑 찾기
                const keys = Object.keys(jsonData[0]);
                const mapping: Record<string, string> = {};

                keys.forEach(key => {
                    const normalized = normalizeKey(key);
                    for (const [target, synonyms] of Object.entries(COLUMN_MAPPINGS)) {
                        if (synonyms.some(syn => normalizeKey(syn) === normalized || normalized.includes(normalizeKey(syn)))) {
                            mapping[target] = key;
                            break;
                        }
                    }
                });

                // 필수 컬럼 체크 (품명, 국가명, 검역량, 연도 정도는 필수라고 가정)
                const required = ['item', 'country', 'volume', 'year'];
                const missing = required.filter(req => !mapping[req]);

                if (missing.length > 0) {
                    throw new Error(`필수 컬럼이 누락되었습니다: ${missing.join(', ')}`);
                }

                const results: QuarantineData[] = jsonData.map((row: any) => ({
                    item: String(row[mapping['item']] || ''),
                    category: mapping['category'] ? String(row[mapping['category']] || '') : undefined,
                    product: String(row[mapping['product']] || row[mapping['item']] || ''), // 부위 없으면 품명으로 대체
                    country: String(row[mapping['country']] || ''),
                    volume: normalizeVolume(row[mapping['volume']]),
                    year: normalizeYear(row[mapping['year']]),
                    month: mapping['month'] ? normalizeYear(row[mapping['month']]) : undefined
                })).filter(d => d.year > 0 && d.volume >= 0); // 기본 검증

                resolve(results);
            } catch (err) {
                reject(err);
            }
        };
        reader.onerror = (err) => reject(err);
        reader.readAsArrayBuffer(file);
    });
};
