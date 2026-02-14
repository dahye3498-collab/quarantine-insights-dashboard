"use client";

import React, { useMemo, useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { QuarantineData } from "@/lib/types";

const fmt = (n: number) =>
  new Intl.NumberFormat("ko-KR", { maximumFractionDigits: 0 }).format(n);

interface Props {
  data: QuarantineData[];
  globalFilter: string;
}

export default function DataTable({ data, globalFilter }: Props) {
  const [sorting, setSorting] = useState<SortingState>([{ id: "volume", desc: true }]);

  const columns = useMemo<ColumnDef<QuarantineData>[]>(
    () => [
      { accessorKey: "year", header: "연도" },
      { accessorKey: "month", header: "월" },
      { accessorKey: "item", header: "품목" },
      { accessorKey: "product", header: "품명/부위" },
      { accessorKey: "country", header: "국가명" },
      {
        accessorKey: "volume",
        header: "검역량",
        cell: (info) => fmt(Number(info.getValue() ?? 0)),
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold">데이터 테이블</div>
        <div className="text-xs text-slate-500">기본: 검역량 내림차순</div>
      </div>

      <div className="mt-3 overflow-auto rounded-xl border border-slate-200">
        <table className="min-w-[900px] w-full text-sm">
          <thead className="bg-slate-50">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((h) => (
                  <th
                    key={h.id}
                    className="cursor-pointer select-none border-b border-slate-200 px-3 py-2 text-left font-semibold"
                    onClick={h.column.getToggleSortingHandler()}
                    title="클릭하면 정렬"
                  >
                    {flexRender(h.column.columnDef.header, h.getContext())}
                    {h.column.getIsSorted() === "asc"
                      ? " ▲"
                      : h.column.getIsSorted() === "desc"
                        ? " ▼"
                        : ""}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((r) => (
              <tr key={r.id} className="odd:bg-white even:bg-slate-50">
                {r.getVisibleCells().map((c) => (
                  <td key={c.id} className="border-b border-slate-100 px-3 py-2">
                    {flexRender(c.column.columnDef.cell, c.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="text-xs text-slate-600">
          {table.getState().pagination.pageIndex + 1} / {table.getPageCount()} 페이지
        </div>
        <div className="flex gap-2">
          <button
            className="rounded-xl border border-slate-200 px-3 py-1.5 text-sm hover:bg-slate-50 disabled:opacity-50"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            이전
          </button>
          <button
            className="rounded-xl border border-slate-200 px-3 py-1.5 text-sm hover:bg-slate-50 disabled:opacity-50"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            다음
          </button>
        </div>
      </div>
    </div>
  );
}
