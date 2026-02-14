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
  ReferenceLine,
  Label,
  Cell,
} from "recharts";
import { AggregatedStats } from "@/lib/types";

const fmt = (n: number) =>
  new Intl.NumberFormat("ko-KR", { maximumFractionDigits: 0 }).format(n);

const COLORS = ["#3b82f6", "#60a5fa", "#93c5fd", "#bfdbfe", "#dbeafe"];

export default function Charts({ stats }: { stats: AggregatedStats }) {
  const { byMonth, countriesStacked, topProducts, monthlyAverages } = stats;

  // 누적 막대를 위한 연도 목록 추출
  const years = Array.from(
    new Set(
      countriesStacked.flatMap((c) =>
        Object.keys(c).filter((k) => k !== "name" && k !== "total")
      )
    )
  ).sort();

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
        <div className="flex items-center justify-between mb-4">
          <div className="text-lg font-bold text-slate-900">최근 검역량 추이 (월별)</div>
          <div className="flex gap-4 text-xs font-medium">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-0.5 bg-blue-600"></div>
              <span>월 검역량</span>
            </div>
            {monthlyAverages.currentYear.average > 0 && (
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-0.5 border-t border-dashed border-red-500"></div>
                <span>{monthlyAverages.currentYear.year}년 평균</span>
              </div>
            )}
            {monthlyAverages.previousYear && (
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-0.5 border-t border-dashed border-slate-400"></div>
                <span>{monthlyAverages.previousYear.year}년 평균</span>
              </div>
            )}
          </div>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={byMonth}>
              <XAxis dataKey="key" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={(v) => fmt(Number(v))} tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
                formatter={(v: number | undefined) => [fmt(Number(v ?? 0)), "검역량"]}
              />
              <Line
                type="monotone"
                dataKey="volume"
                stroke="#2563eb"
                strokeWidth={3}
                dot={{ r: 4, fill: "#2563eb" }}
                activeDot={{ r: 6 }}
              />
              {monthlyAverages.currentYear.average > 0 && (
                <ReferenceLine
                  y={monthlyAverages.currentYear.average}
                  stroke="#ef4444"
                  strokeDasharray="3 3"
                >
                  <Label
                    value={`${monthlyAverages.currentYear.year} 평균`}
                    position="right"
                    fill="#ef4444"
                    fontSize={11}
                  />
                </ReferenceLine>
              )}
              {monthlyAverages.previousYear && (
                <ReferenceLine
                  y={monthlyAverages.previousYear.average}
                  stroke="#94a3b8"
                  strokeDasharray="3 3"
                >
                  <Label
                    value={`${monthlyAverages.previousYear.year} 평균`}
                    position="right"
                    fill="#64748b"
                    fontSize={11}
                  />
                </ReferenceLine>
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="text-lg font-bold text-slate-900 mb-4">국가별 누적 검역량 (연도별)</div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={countriesStacked} layout="vertical" margin={{ left: 40 }}>
              <XAxis type="number" tickFormatter={(v) => fmt(Number(v))} hide />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 13, fontWeight: 500 }} />
              <Tooltip
                contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
                formatter={(v: number | undefined, name: string | undefined) => [fmt(v ?? 0), name ?? ""]}
              />
              {years.map((year, index) => (
                <Bar
                  key={year}
                  dataKey={year}
                  stackId="a"
                  fill={COLORS[index % COLORS.length]}
                  radius={index === years.length - 1 ? [0, 4, 4, 0] : [0, 0, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="text-lg font-bold text-slate-900 mb-4">품명/부위별 Top 5</div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topProducts} margin={{ bottom: 20 }}>
              <XAxis dataKey="name" interval={0} tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={(v) => fmt(Number(v))} tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
                formatter={(v: number | undefined) => [fmt(Number(v ?? 0)), "검역량"]}
              />
              <Bar dataKey="volume" radius={[4, 4, 0, 0]}>
                {topProducts.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
