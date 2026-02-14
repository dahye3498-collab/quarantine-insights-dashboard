"use client";

import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
} from "recharts";
import { AggregatedStats } from "@/lib/types";

const fmt = (n: number) =>
  new Intl.NumberFormat("ko-KR", { maximumFractionDigits: 0 }).format(n);

// ... (imports remain)
export default function Charts({ stats }: { stats: AggregatedStats }) {
  const { byYear, topCountries, topProducts } = stats;

  return (
    <div className="grid gap-4 xl:grid-cols-3">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="text-sm font-semibold">연도별 총 검역량</div>
        <div className="mt-3 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={byYear}>
              <XAxis dataKey="year" />
              <YAxis tickFormatter={(v) => fmt(Number(v))} />
              <Tooltip formatter={(v: number | undefined) => fmt(Number(v ?? 0))} />
              <Line type="monotone" dataKey="volume" stroke="#2563eb" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="text-sm font-semibold">국가별 Top 5</div>
        <div className="mt-3 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topCountries.slice(0, 5)}>
              <XAxis dataKey="name" hide />
              <YAxis tickFormatter={(v) => fmt(Number(v))} />
              <Tooltip
                labelFormatter={(l) => `국가: ${String(l)}`}
                formatter={(v: number | undefined) => fmt(Number(v ?? 0))}
              />
              <Bar dataKey="volume" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 text-xs text-slate-500">툴팁으로 국가명 확인</div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="text-sm font-semibold">품명/부위 Top 5</div>
        <div className="mt-3 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topProducts.slice(0, 5)}>
              <XAxis dataKey="name" hide />
              <YAxis tickFormatter={(v) => fmt(Number(v))} />
              <Tooltip
                labelFormatter={(l) => `품명/부위: ${String(l)}`}
                formatter={(v: number | undefined) => fmt(Number(v ?? 0))}
              />
              <Bar dataKey="volume" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 text-xs text-slate-500">툴팁으로 품명/부위 확인</div>
      </div>
    </div>
  );
}
