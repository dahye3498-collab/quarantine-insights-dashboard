'use client';

import React, { useState, useCallback } from 'react';
import { Upload, FileType, AlertCircle } from 'lucide-react';
import { parseQuarantineXlsx } from '@/lib/parseXlsx';
import { QuarantineData } from '@/lib/types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface Props {
    onDataLoaded: (data: QuarantineData[]) => void;
}

export default function UploadBox({ onDataLoaded }: Props) {
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleFile = useCallback(async (file: File) => {
        if (!file.name.match(/\.(xlsx|xls)$/i)) {
            setError('엑셀 파일(.xlsx, .xls)만 업로드 가능합니다.');
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const data = await parseQuarantineXlsx(file);
            onDataLoaded(data);
        } catch (err: any) {
            setError(err.message || '파일 파싱 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    }, [onDataLoaded]);

    const onDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const onDragLeave = () => {
        setIsDragging(false);
    };

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
    };

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFile(file);
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            <div
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                className={cn(
                    "relative border-2 border-dashed rounded-2xl p-12 transition-all duration-200 flex flex-col items-center justify-center cursor-pointer",
                    isDragging
                        ? "border-blue-500 bg-blue-50/50"
                        : "border-slate-200 hover:border-blue-400 hover:bg-slate-50/50",
                    loading && "opacity-50 pointer-events-none"
                )}
            >
                <input
                    type="file"
                    accept=".xlsx, .xls"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={onFileChange}
                />

                <div className="bg-blue-100 p-4 rounded-full mb-4">
                    <Upload className="w-8 h-8 text-blue-600" />
                </div>

                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                    {loading ? '파일을 분석하는 중...' : '엑셀 파일을 여기에 끌어다 놓으세요'}
                </h3>
                <p className="text-slate-500 mb-6 text-center">
                    품목, 품명, 국가명, 검역량, 연도 컬럼이 포함된<br />
                    .xlsx 또는 .xls 파일을 업로드해 주세요.
                </p>

                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors">
                    파일 선택하기
                </button>
            </div>

            {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    <p className="text-sm text-red-800">{error}</p>
                </div>
            )}
        </div>
    );
}
