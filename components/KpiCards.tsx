"use client";

import React from "react";

const fmt = (n: number) =>
  new Intl.NumberFormat("ko-KR", { maximumFractionDigits: 0 }).format(n);

export default function KpiCards({
  total,
  maxYear,
  minYear,
  yoyPct,
  topCountry,
  topName,
}: {
  total: number;
  maxYear: { year: number; total: number } | null;
  minYear: { year: number; total: number } | null;
  yoyPct: number | null;
  topCountry: { key: string; total: number } | null;
  topName: { key: string; total: number } | null;
}) {
  const cards = [
    { title: "총 검역량", value: fmt(total) },
    { title: "최대 연도", value: maxYear ? `${maxYear.year} (${fmt(maxYear.total)})` : "-" },
    { title: "최소 연도", value: minYear ? `${minYear.year} (${fmt(minYear.total)})` : "-" },
    { title: "전년 대비", value: yoyPct === null ? "-" : `${yoyPct.toFixed(1)}%` },
    { title: "Top 국가", value: topCountry ? `${topCountry.key} (${fmt(topCountry.total)})` : "-" },
    { title: "Top 품명/부위", value: topName ? `${topName.key} (${fmt(topName.total)})` : "-" },
  ];

  return (
    <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-6">
      {cards.map((c) => (
        <div key={c.title} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="text-xs font-medium text-slate-500">{c.title}</div>
          <div className="mt-2 text-lg font-semibold text-slate-900">{c.value}</div>
        </div>
      ))}
    </div>
  );
}
