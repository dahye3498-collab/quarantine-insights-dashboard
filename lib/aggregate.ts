import { QuarantineData, AggregatedStats } from './types';

export const aggregateData = (data: QuarantineData[]): AggregatedStats => {
    if (data.length === 0) {
        return {
            totalVolume: 0,
            yearRange: [0, 0],
            topCountries: [],
            topProducts: [],
            byYear: []
        };
    }

    const totalVolume = data.reduce((acc, curr) => acc + curr.volume, 0);

    const years = data.map(d => d.year);
    const minYear = Math.min(...years);
    const maxYear = Math.max(...years);

    // 국가별 집계
    const countryMap: Record<string, number> = {};
    // 품명별 집계
    const productMap: Record<string, number> = {};
    // 연도별 집계
    const yearMap: Record<number, number> = {};

    data.forEach(d => {
        countryMap[d.country] = (countryMap[d.country] || 0) + d.volume;
        productMap[d.product] = (productMap[d.product] || 0) + d.volume;
        yearMap[d.year] = (yearMap[d.year] || 0) + d.volume;
    });

    const topCountries = Object.entries(countryMap)
        .map(([name, volume]) => ({ name, volume }))
        .sort((a, b) => b.volume - a.volume)
        .slice(0, 5);

    const topProducts = Object.entries(productMap)
        .map(([name, volume]) => ({ name, volume }))
        .sort((a, b) => b.volume - a.volume)
        .slice(0, 5);

    const byYear = Object.entries(yearMap)
        .map(([year, volume]) => ({ year: Number(year), volume }))
        .sort((a, b) => a.year - b.year);

    // YoY 계산 (가장 최근 연도 vs 그 전 연도)
    let yoyGrowth: number | undefined;
    if (byYear.length >= 2) {
        const latest = byYear[byYear.length - 1];
        const previous = byYear[byYear.length - 2];
        if (previous.volume > 0) {
            yoyGrowth = ((latest.volume - previous.volume) / previous.volume) * 100;
        }
    }

    return {
        totalVolume,
        yearRange: [minYear, maxYear],
        yoyGrowth,
        topCountries,
        topProducts,
        byYear
    };
};
