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
import type { KeyAgg, YearAgg } from "@/lib/types";

const fmt = (n: number) =>
  new Intl.NumberFormat("ko-KR", { maximumFractionDigits: 0 }).format(n);

type TooltipValue = number | string;

export default function Charts({
  years,
  topCountries,
  topNames,
}: {
  years: YearAgg[];
  topCountries: KeyAgg[];
  topNames: KeyAgg[];
}) {
  return (
    <div className="grid gap-4 xl:grid-cols-3">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm xl:col-span-1">
        <div className="text-sm font-semibold">연도별 총 검역량</div>
        <div className="mt-3 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={years}>
              <XAxis dataKey="year" />
              <YAxis tickFormatter={(v) => fmt(Number(v))} />
              <Tooltip formatter={(v: TooltipValue) => fmt(Number(v))} />
              <Line type="monotone" dataKey="total" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm xl:col-span-1">
        <div className="text-sm font-semibold">국가별 Top N</div>
        <div className="mt-3 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topCountries}>
              <XAxis dataKey="key" hide />
              <YAxis tickFormatter={(v) => fmt(Number(v))} />
              <Tooltip
                labelFormatter={(l) => `국가: ${String(l)}`}
                formatter={(v: TooltipValue) => fmt(Number(v))}
              />
              <Bar dataKey="total" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 text-xs text-slate-500">툴팁으로 국가명 확인</div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm xl:col-span-1">
        <div className="text-sm font-semibold">품명/부위 Top N</div>
        <div className="mt-3 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topNames}>
              <XAxis dataKey="key" hide />
              <YAxis tickFormatter={(v) => fmt(Number(v))} />
              <Tooltip
                labelFormatter={(l) => `품명/부위: ${String(l)}`}
                formatter={(v: TooltipValue) => fmt(Number(v))}
              />
              <Bar dataKey="total" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 text-xs text-slate-500">툴팁으로 품명/부위 확인</div>
      </div>
    </div>
  );
}

