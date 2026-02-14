import { QuarantineData, AggregatedStats } from './types';

export const aggregateData = (data: QuarantineData[]): AggregatedStats => {
    if (data.length === 0) {
        return {
            totalVolume: 0,
            yearRange: [0, 0],
            topCountries: [],
            topProducts: [],
            byYear: [],
            byMonth: [],
            countriesStacked: [],
            monthlyAverages: {
                currentYear: { year: 0, average: 0 },
                previousYear: null
            }
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

    // 월별 집계 (YYYY-MM 키 사용)
    const monthMap: Record<string, { key: string; year: number; month: number; volume: number }> = {};
    data.forEach(d => {
        const m = d.month || 1;
        const key = `${d.year}-${String(m).padStart(2, '0')}`;
        if (!monthMap[key]) {
            monthMap[key] = { key, year: d.year, month: m, volume: 0 };
        }
        monthMap[key].volume += d.volume;
    });

    const byMonth = Object.values(monthMap).sort((a, b) => b.key.localeCompare(a.key)).slice(0, 24).reverse(); // 최근 24개월

    // 평균 기준선 계산
    const latestYear = byYear.length > 0 ? byYear[byYear.length - 1].year : 0;
    const prevYear = latestYear - 1;

    const calcYearAvg = (y: number) => {
        const yearData = data.filter(d => d.year === y);
        if (yearData.length === 0) return 0;
        const total = yearData.reduce((acc, curr) => acc + curr.volume, 0);
        // 고유 월 개수로 나누기 (데이터가 있는 월 기준)
        const uniqueMonths = new Set(yearData.map(d => d.month || 1)).size;
        return uniqueMonths > 0 ? total / uniqueMonths : 0;
    };

    const monthlyAverages = {
        currentYear: { year: latestYear, average: calcYearAvg(latestYear) },
        previousYear: latestYear > minYear ? { year: prevYear, average: calcYearAvg(prevYear) } : null
    };

    // 국가별 연도별 누적 데이터 (Top 5 국가)
    const stackedCountryMap: Record<string, Record<number, number>> = {};
    const topCountryNames = topCountries.map(c => c.name);

    data.forEach(d => {
        if (topCountryNames.includes(d.country)) {
            if (!stackedCountryMap[d.country]) stackedCountryMap[d.country] = {};
            stackedCountryMap[d.country][d.year] = (stackedCountryMap[d.country][d.year] || 0) + d.volume;
        }
    });

    const countriesStacked = topCountries.map(c => ({
        name: c.name,
        total: c.volume,
        ...stackedCountryMap[c.name]
    }));

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
        byYear,
        byMonth,
        countriesStacked,
        monthlyAverages
    };
};
