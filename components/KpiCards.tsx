'use client';

import React from 'react';
import { TrendingUp, TrendingDown, Globe, Package, Calendar, BarChart3 } from 'lucide-react';
import { AggregatedStats } from '@/lib/types';

interface Props {
    stats: AggregatedStats;
}

export default function KpiCards({ stats }: Props) {
    const formatNumber = (num: number) => {
        return new Intl.NumberFormat('ko-KR').format(Math.round(num));
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card
                title="총 검역량"
                value={`${formatNumber(stats.totalVolume)} kg`}
                subtitle="선택된 필터 범위 내 합계"
                icon={<BarChart3 className="w-5 h-5 text-blue-600" />}
                color="blue"
            />
            <Card
                title="연도 범위"
                value={stats.yearRange[0] === stats.yearRange[1] ? `${stats.yearRange[0]}년` : `${stats.yearRange[0]} - ${stats.yearRange[1]}`}
                subtitle="데이터 포함 기간"
                icon={<Calendar className="w-5 h-5 text-indigo-600" />}
                color="indigo"
            />
            <Card
                title="전년 대비(YoY)"
                value={stats.yoyGrowth !== undefined ? `${stats.yoyGrowth > 0 ? '+' : ''}${stats.yoyGrowth.toFixed(1)}%` : '-'}
                subtitle="최근 2개년 데이터 기준"
                icon={stats.yoyGrowth && stats.yoyGrowth > 0 ? <TrendingUp className="w-5 h-5 text-emerald-600" /> : <TrendingDown className="w-5 h-5 text-rose-600" />}
                color={stats.yoyGrowth && stats.yoyGrowth > 0 ? 'emerald' : 'rose'}
            />
            <Card
                title="Top 5 국가/품목"
                value={stats.topCountries[0]?.name || '-'}
                subtitle={`최대 수입국: ${stats.topCountries[0]?.name || '-'}`}
                icon={<Globe className="w-5 h-5 text-amber-600" />}
                color="amber"
            />
        </div>
    );
}

function Card({
    title,
    value,
    subtitle,
    icon,
    color
}: {
    title: string;
    value: string;
    subtitle: string;
    icon: React.ReactNode;
    color: 'blue' | 'indigo' | 'emerald' | 'amber' | 'rose';
}) {
    const bgColors = {
        blue: 'bg-blue-50',
        indigo: 'bg-indigo-50',
        emerald: 'bg-emerald-50',
        amber: 'bg-amber-50',
        rose: 'bg-rose-50'
    };

    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4 mb-4">
                <div className={`p-2.5 rounded-xl ${bgColors[color]}`}>
                    {icon}
                </div>
                <span className="text-sm font-medium text-slate-500">{title}</span>
            </div>
            <div className="space-y-1">
                <h4 className="text-2xl font-bold text-slate-900">{value}</h4>
                <p className="text-xs text-slate-400 font-medium">{subtitle}</p>
            </div>
        </div>
    );
}
