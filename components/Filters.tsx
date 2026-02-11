'use client';

import React from 'react';
import { Search, X, RotateCcw } from 'lucide-react';

export interface FilterState {
    search: string;
    years: number[];
    items: string[];
    countries: string[];
}

interface Props {
    data: any[];
    filters: FilterState;
    setFilters: (filters: FilterState | ((prev: FilterState) => FilterState)) => void;
    availableFilters: {
        years: number[];
        items: string[];
        countries: string[];
    };
}

export default function Filters({ filters, setFilters, availableFilters }: Props) {
    const resetFilters = () => {
        setFilters({
            search: '',
            years: [],
            items: [],
            countries: []
        });
    };

    const toggleFilter = (type: keyof Omit<FilterState, 'search'>, value: any) => {
        setFilters(prev => {
            const current = prev[type] as any[];
            const next = current.includes(value)
                ? current.filter(v => v !== value)
                : [...current, value];
            return { ...prev, [type]: next };
        });
    };

    const removeChip = (type: keyof FilterState, value?: any) => {
        if (type === 'search') {
            setFilters(prev => ({ ...prev, search: '' }));
        } else {
            setFilters(prev => ({
                ...prev,
                [type]: (prev[type] as any[]).filter(v => v !== value)
            }));
        }
    };

    return (
        <div className="space-y-6 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-end gap-4">
                {/* Search */}
                <div className="flex-1 space-y-2">
                    <label className="text-sm font-medium text-slate-700">전역 검색</label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            value={filters.search}
                            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                            placeholder="품명, 국가명으로 검색..."
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                    </div>
                </div>

                {/* Year Filter */}
                <div className="w-full md:w-48 space-y-2">
                    <label className="text-sm font-medium text-slate-700">연도 선택</label>
                    <select
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                        onChange={(e) => {
                            if (e.target.value) toggleFilter('years', Number(e.target.value));
                            e.target.value = '';
                        }}
                    >
                        <option value="">연도 선택...</option>
                        {availableFilters.years.map(y => (
                            <option key={y} value={y}>{y}년</option>
                        ))}
                    </select>
                </div>

                {/* Item Filter */}
                <div className="w-full md:w-48 space-y-2">
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

                {/* Reset Button */}
                <button
                    onClick={resetFilters}
                    className="flex items-center justify-center gap-2 px-4 py-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100"
                >
                    <RotateCcw className="w-4 h-4" />
                    <span className="text-sm font-medium">초기화</span>
                </button>
            </div>

            {/* Filter Chips */}
            <div className="flex flex-wrap gap-2">
                {filters.search && (
                    <FilterChip label={`검색: ${filters.search}`} onRemove={() => removeChip('search')} />
                )}
                {filters.years.map(y => (
                    <FilterChip key={y} label={`${y}년`} onRemove={() => removeChip('years', y)} />
                ))}
                {filters.items.map(i => (
                    <FilterChip key={i} label={i} onRemove={() => removeChip('items', i)} />
                ))}
                {filters.countries.map(c => (
                    <FilterChip key={c} label={c} onRemove={() => removeChip('countries', c)} />
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
