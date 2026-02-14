"use client";

import React from "react";
import { AggregatedStats } from "@/lib/types";

const fmt = (n: number) =>
  new Intl.NumberFormat("ko-KR", { maximumFractionDigits: 0 }).format(n);

export default function KpiCards({ stats }: { stats: AggregatedStats }) {
  const { totalVolume, yearRange, yoyGrowth, topCountries, topProducts } = stats;

  const topCountry = topCountries[0];
  const topProduct = topProducts[0];

  const cards = [
    { title: "총 검역량", value: fmt(totalVolume) },
    { title: "기간", value: `${yearRange[0]} - ${yearRange[1]}` },
    { title: "전년 대비", value: yoyGrowth === undefined ? "-" : `${yoyGrowth.toFixed(1)}%` },
    { title: "Top 국가", value: topCountry ? `${topCountry.name} (${fmt(topCountry.volume)})` : "-" },
    { title: "Top 품명/부위", value: topProduct ? `${topProduct.name} (${fmt(topProduct.volume)})` : "-" },
  ];

  return (
    <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-5">
      {cards.map((c) => (
        <div key={c.title} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="text-xs font-medium text-slate-500">{c.title}</div>
          <div className="mt-2 text-lg font-semibold text-slate-900">{c.value}</div>
        </div>
      ))}
    </div>
  );
}
