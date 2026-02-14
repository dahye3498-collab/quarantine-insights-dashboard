'use client';

import React from 'react';
import { Search, X, RotateCcw, Calendar } from 'lucide-react';

export interface FilterState {
    search: string;
    startDate: string; // YYYY-MM
    endDate: string;   // YYYY-MM
    items: string[];
    products: string[]; // 부위
    countries: string[];
}

interface Props {
    data: any[];
    filters: FilterState;
    setFilters: (filters: FilterState | ((prev: FilterState) => FilterState)) => void;
    availableFilters: {
        items: string[];
        products: string[];
        countries: string[];
    };
}

export default function Filters({ filters, setFilters, availableFilters }: Props) {
    const resetFilters = () => {
        setFilters({
            search: '',
            startDate: '',
            endDate: '',
            items: [],
            products: [],
            countries: []
        });
    };

    const toggleFilter = (type: 'items' | 'products' | 'countries', value: string) => {
        setFilters(prev => {
            const current = prev[type];
            const next = current.includes(value)
                ? current.filter(v => v !== value)
                : [...current, value];
            return { ...prev, [type]: next };
        });
    };

    const handleDateChange = (type: 'startDate' | 'endDate', value: string) => {
        setFilters(prev => ({ ...prev, [type]: value }));
    };

    const removeChip = (type: keyof FilterState, value?: any) => {
        if (type === 'search' || type === 'startDate' || type === 'endDate') {
            setFilters(prev => ({ ...prev, [type]: '' }));
        } else {
            setFilters(prev => ({
                ...prev,
                [type]: (prev[type] as string[]).filter(v => v !== value)
            }));
        }
    };

    return (
        <div className="space-y-6 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Global Search */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">전역 검색</label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            value={filters.search}
                            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                            placeholder="국가명 등 검색..."
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                    </div>
                </div>

                {/* Date Range */}
                <div className="space-y-2 lg:col-span-2">
                    <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        기간 조회
                    </label>
                    <div className="flex items-center gap-2">
                        <input
                            type="month"
                            value={filters.startDate}
                            onChange={(e) => handleDateChange('startDate', e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-slate-400">~</span>
                        <input
                            type="month"
                            value={filters.endDate}
                            onChange={(e) => handleDateChange('endDate', e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {/* Reset Button */}
                <div className="flex items-end justify-end">
                    <button
                        onClick={resetFilters}
                        className="flex items-center justify-center gap-2 px-4 py-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100 h-[42px]"
                    >
                        <RotateCcw className="w-4 h-4" />
                        <span className="text-sm font-medium">초기화</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-slate-100 pt-4">
                {/* Item Filter (품목) */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">품목 선택</label>
                    <select
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                        onChange={(e) => {
                            if (e.target.value) toggleFilter('items', e.target.value);
                            e.target.value = '';
                        }}
                    >
                        <option value="">품목 선택...</option>
                        {availableFilters.items.map(i => (
                            <option key={i} value={i}>{i}</option>
                        ))}
                    </select>
                </div>

                {/* Product Filter (부위) */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">부위 선택</label>
                    <select
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                        onChange={(e) => {
                            if (e.target.value) toggleFilter('products', e.target.value);
                            e.target.value = '';
                        }}
                    >
                        <option value="">부위 선택...</option>
                        {availableFilters.products.map(p => (
                            <option key={p} value={p}>{p}</option>
                        ))}
                    </select>
                </div>

                {/* Country Filter */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">국가 선택</label>
                    <select
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                        onChange={(e) => {
                            if (e.target.value) toggleFilter('countries', e.target.value);
                            e.target.value = '';
                        }}
                    >
                        <option value="">국가 선택...</option>
                        {availableFilters.countries.map(c => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Filter Chips */}
            <div className="flex flex-wrap gap-2">
                {filters.search && (
                    <FilterChip label={`검색: ${filters.search}`} onRemove={() => removeChip('search')} />
                )}
                {filters.startDate && (
                    <FilterChip label={`시작: ${filters.startDate}`} onRemove={() => removeChip('startDate')} />
                )}
                {filters.endDate && (
                    <FilterChip label={`종료: ${filters.endDate}`} onRemove={() => removeChip('endDate')} />
                )}
                {filters.items.map(i => (
                    <FilterChip key={i} label={`품목: ${i}`} onRemove={() => removeChip('items', i)} />
                ))}
                {filters.products.map(p => (
                    <FilterChip key={p} label={`부위: ${p}`} onRemove={() => removeChip('products', p)} />
                ))}
                {filters.countries.map(c => (
                    <FilterChip key={c} label={`국가: ${c}`} onRemove={() => removeChip('countries', c)} />
                ))}
            </div>
        </div>
    );
}

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
    return (
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-100 animate-in fade-in zoom-in duration-200">
            {label}
            <button onClick={onRemove} className="p-0.5 hover:bg-blue-200 rounded-full transition-colors">
                <X className="w-3 h-3" />
            </button>
        </div>
    );
}
