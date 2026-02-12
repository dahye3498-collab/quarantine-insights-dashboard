"use client";

import React, { useMemo } from "react";

type FiltersState = {
  years: number[];
  items: string[];
  names: string[];
  countries: string[];
  query: string;
};

function uniqSorted<T>(arr: T[]): T[] {
  return Array.from(new Set(arr)).sort((a, b) => {
    if (a > (b as T)) return 1;
    if (a < (b as T)) return -1;
    return 0;
  });
}

function MultiSelect({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string[];
  onChange: (v: string[]) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="text-sm font-medium text-slate-800">{label}</div>
      <select
        multiple
        className="h-40 w-full rounded-xl border border-slate-200 bg-white p-2 text-sm"
        value={value}
        onChange={(e) => {
          const selected = Array.from(e.target.selectedOptions).map((o) => o.value);
          onChange(selected);
        }}
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <div className="text-xs text-slate-500">Ctrl/Shift로 멀티 선택</div>
    </div>
  );
}

function YearSelect({
  years,
  value,
  onChange,
}: {
  years: number[];
  value: number[];
  onChange: (v: number[]) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="text-sm font-medium text-slate-800">연도</div>
      <select
        multiple
        className="h-40 w-full rounded-xl border border-slate-200 bg-white p-2 text-sm"
        value={value.map(String)}
        onChange={(e) => {
          const selected = Array.from(e.target.selectedOptions).map((o) => Number(o.value));
          onChange(selected);
        }}
      >
        {years.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>
      <div className="text-xs text-slate-500">Ctrl/Shift로 멀티 선택</div>
    </div>
  );
}

export default function Filters({
  allYears,
  allItems,
  allNames,
  allCountries,
  filters,
  setFilters,
  onReset,
}: {
  allYears: number[];
  allItems: string[];
  allNames: string[];
  allCountries: string[];
  filters: FiltersState;
  setFilters: (f: FiltersState) => void;
  onReset: () => void;
}) {
  const years = useMemo(() => uniqSorted(allYears), [allYears]);
  const items = useMemo(() => uniqSorted(allItems.filter(Boolean)), [allItems]);
  const names = useMemo(() => uniqSorted(allNames.filter(Boolean)), [allNames]);
  const countries = useMemo(() => uniqSorted(allCountries.filter(Boolean)), [allCountries]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="text-base font-semibold">필터</div>
        <button
          onClick={onReset}
          className="rounded-xl border border-slate-200 px-3 py-1.5 text-sm hover:bg-slate-50"
        >
          Reset
        </button>
      </div>

      <div className="mt-4 space-y-4">
        <div>
          <div className="text-sm font-medium text-slate-800">검색</div>
          <input
            value={filters.query}
            onChange={(e) => setFilters({ ...filters, query: e.target.value })}
            placeholder="품목/품명/국가명 키워드"
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
          />
        </div>

        <YearSelect years={years} value={filters.years} onChange={(v) => setFilters({ ...filters, years: v })} />

        <MultiSelect label="품목" options={items} value={filters.items} onChange={(v) => setFilters({ ...filters, items: v })} />
        <MultiSelect label="품명/부위" options={names} value={filters.names} onChange={(v) => setFilters({ ...filters, names: v })} />
        <MultiSelect label="국가명" options={countries} value={filters.countries} onChange={(v) => setFilters({ ...filters, countries: v })} />
      </div>
    </div>
  );
}
