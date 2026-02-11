'use client';

import React, { useMemo, useState } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    getFilteredRowModel,
    flexRender,
    createColumnHelper,
    SortingState,
} from '@tanstack/react-table';
import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    ArrowUpDown,
    Download,
    Eye,
    EyeOff
} from 'lucide-react';
import { QuarantineData } from '@/lib/types';

interface Props {
    data: QuarantineData[];
    globalFilter: string;
}

const columnHelper = createColumnHelper<QuarantineData>();

export default function DataTable({ data, globalFilter }: Props) {
    const [sorting, setSorting] = useState<SortingState>([{ id: 'volume', desc: true }]);
    const [columnVisibility, setColumnVisibility] = useState({});

    const columns = useMemo(() => [
        columnHelper.accessor('year', {
            header: ({ column }) => <SortButton column={column} label="연도" />,
            cell: info => info.getValue(),
        }),
        columnHelper.accessor('item', {
            header: ({ column }) => <SortButton column={column} label="품목" />,
            cell: info => info.getValue(),
        }),
        columnHelper.accessor('product', {
            header: ({ column }) => <SortButton column={column} label="품명/부위" />,
            cell: info => info.getValue(),
        }),
        columnHelper.accessor('country', {
            header: ({ column }) => <SortButton column={column} label="국가명" />,
            cell: info => info.getValue(),
        }),
        columnHelper.accessor('volume', {
            header: ({ column }) => <SortButton column={column} label="검역량(kg)" />,
            cell: info => new Intl.NumberFormat('ko-KR').format(info.getValue()),
        }),
    ], []);

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            globalFilter,
            columnVisibility,
        },
        onSortingChange: setSorting,
        onColumnVisibilityChange: setColumnVisibility,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    const downloadCsv = () => {
        const rows = table.getFilteredRowModel().rows.map(row => row.original);
        if (rows.length === 0) return;

        const headers = ['연도', '품목', '품명/부위', '국가명', '검역량'];
        const csvContent = [
            headers.join(','),
            ...rows.map(r => `${r.year},${r.item},${r.product},${r.country},${r.volume}`)
        ].join('\n');

        const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `검역량_데이터_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-50 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-slate-800">데이터 테이블</h3>
                    <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded-full">
                        {table.getFilteredRowModel().rows.length.toLocaleString()} 행
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    {/* Column Toggle Dropdown - Simple version */}
                    <div className="relative group">
                        <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50 rounded-lg border border-slate-200">
                            <Eye className="w-4 h-4" />
                            컬럼 숨김
                        </button>
                        <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-100 shadow-xl rounded-xl p-2 hidden group-hover:block z-10">
                            {table.getAllLeafColumns().map(column => (
                                <label key={column.id} className="flex items-center gap-2 p-2 hover:bg-slate-50 rounded-lg cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={column.getIsVisible()}
                                        onChange={column.getToggleVisibilityHandler()}
                                        className="rounded text-blue-600"
                                    />
                                    <span className="text-sm text-slate-700">{column.id}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={downloadCsv}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg border border-emerald-100 transition-colors"
                    >
                        <Download className="w-4 h-4" />
                        CSV 다운로드
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50/50 text-slate-500 font-medium">
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <th key={header.id} className="px-6 py-4 border-b border-slate-100">
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(header.column.columnDef.header, header.getContext())}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {table.getRowModel().rows.map(row => (
                            <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                                {row.getVisibleCells().map(cell => (
                                    <td key={cell.id} className="px-6 py-4 text-slate-600">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="p-4 border-t border-slate-50 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                    <span>페이지 {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}</span>
                    <select
                        value={table.getState().pagination.pageSize}
                        onChange={e => table.setPageSize(Number(e.target.value))}
                        className="bg-transparent border border-slate-200 rounded px-1"
                    >
                        {[10, 20, 30, 40, 50].map(pageSize => (
                            <option key={pageSize} value={pageSize}>
                                {pageSize}건씩 보기
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex items-center gap-1">
                    <PageButton onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()} icon={<ChevronsLeft className="w-4 h-4" />} />
                    <PageButton onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} icon={<ChevronLeft className="w-4 h-4" />} />
                    <PageButton onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} icon={<ChevronRight className="w-4 h-4" />} />
                    <PageButton onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()} icon={<ChevronsRight className="w-4 h-4" />} />
                </div>
            </div>
        </div>
    );
}

function SortButton({ column, label }: { column: any; label: string }) {
    return (
        <button
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="flex items-center gap-1 hover:text-slate-900 transition-colors"
        >
            {label}
            <ArrowUpDown className="w-3.5 h-3.5" />
        </button>
    );
}

function PageButton({ onClick, disabled, icon }: { onClick: () => void; disabled: boolean; icon: React.ReactNode }) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
        >
            {icon}
        </button>
    );
}
