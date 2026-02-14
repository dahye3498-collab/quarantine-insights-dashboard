'use client';

import UploadBox from "@/components/UploadBox";
import Filters from "@/components/Filters";
import KpiCards from "@/components/KpiCards";
import Charts from "@/components/Charts";
import DataTable from "@/components/DataTable";


export default function Home() {
  const [rawData, setRawData] = useState<QuarantineData[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    startDate: '',
    endDate: '',
    items: [],
    products: [],
    countries: []
  });

  // 필터링된 데이터 계산
  const filteredData = useMemo(() => {
    return rawData.filter(d => {
      // 검색 (국가명 등)
      const matchSearch = !filters.search ||
        d.country.toLowerCase().includes(filters.search.toLowerCase());

      // 기간 조회 (YYYY-MM 문자열 비교)
      const rowDate = `${d.year}-${String(d.month || 1).padStart(2, '0')}`;
      const matchStartDate = !filters.startDate || rowDate >= filters.startDate;
      const matchEndDate = !filters.endDate || rowDate <= filters.endDate;

      // 품목, 부위, 국가 선택
      const matchItem = filters.items.length === 0 || filters.items.includes(d.item);
      const matchProduct = filters.products.length === 0 || filters.products.includes(d.product);
      const matchCountry = filters.countries.length === 0 || filters.countries.includes(d.country);

      return matchSearch && matchStartDate && matchEndDate && matchItem && matchProduct && matchCountry;
    });
  }, [rawData, filters]);

  // 인사이트 집계 데이터 계산
  const stats = useMemo(() => aggregateData(filteredData), [filteredData]);

  // 필터 옵션 추출
  const availableFilters = useMemo(() => {
    return {
      items: Array.from(new Set(rawData.map(d => d.item))).sort(),
      products: Array.from(new Set(rawData.map(d => d.product))).sort(),
      countries: Array.from(new Set(rawData.map(d => d.country))).sort()
    };
  }, [rawData]);

  return (
    <main className="min-h-screen bg-slate-50/50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 py-6 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-xl">
              <LayoutDashboard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 leading-tight">연도별 검역량 인사이트</h1>
              <p className="text-xs text-slate-500 font-medium tracking-wide uppercase">Quarantine Insights Dashboard</p>
            </div>
          </div>

          {rawData.length > 0 && (
            <div className="hidden md:flex items-center gap-6">
              <div className="text-right">
                <p className="text-xs text-slate-400 font-medium">총 로드된 데이터</p>
                <p className="text-sm font-bold text-slate-700">{rawData.length.toLocaleString()} 행</p>
              </div>
              <button
                onClick={() => setRawData([])}
                className="text-sm text-slate-500 hover:text-red-600 font-medium transition-colors"
              >
                다른 파일 업로드
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 mt-8 space-y-8">
        {rawData.length === 0 ? (
          <div className="py-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <UploadBox onDataLoaded={setRawData} />

            <div className="max-w-2xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-start gap-4">
                <div className="p-2 bg-blue-50 rounded-lg shrink-0">
                  <FileSpreadsheet className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 mb-1">엑셀 자동 분석</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    컬럼명이 다르더라도 지능적으로 매칭하여 품목, 국가별 통계를 즉시 산출합니다.
                  </p>
                </div>
              </div>
              <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-start gap-4">
                <div className="p-2 bg-indigo-50 rounded-lg shrink-0">
                  <Info className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 mb-1">실시간 인사이트</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    원하는 조건으로 필터링하면 차트와 KPI가 즉시 업데이트되어 트렌드를 파악할 수 있습니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in duration-500">
            <Filters
              data={rawData}
              filters={filters}
              setFilters={setFilters}
              availableFilters={availableFilters}
            />

            <KpiCards stats={stats} />

            <Charts stats={stats} />

            <DataTable data={filteredData} globalFilter={filters.search} />
          </div>
        )}
      </div>
    </main>
  );
}
