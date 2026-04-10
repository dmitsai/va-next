'use client';

import { useCallback, useRef, useState, type ChangeEvent, type DragEvent } from 'react';
import { useRouter } from 'next/navigation';
import cn from 'classnames';
import { clientApi } from 'trpc/client';

const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

type UploadState =
    | { status: 'idle' }
    | { status: 'selected'; file: File }
    | { status: 'uploading'; file: File; progress: number }
    | { status: 'error'; message: string };

export const PdfImportForm = () => {
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);
    const [state, setState] = useState<UploadState>({ status: 'idle' });
    const [isDragOver, setIsDragOver] = useState(false);

    const { mutateAsync: importFromPdf } =
        clientApi.resume.importFromPdf.useMutation();

    const validateFile = (file: File): string | null => {
        if (file.type !== 'application/pdf') {
            return 'Допустимы только PDF файлы';
        }
        if (file.size > MAX_SIZE_BYTES) {
            return 'Файл превышает 5 МБ';
        }
        return null;
    };

    const handleFile = useCallback(
        (file: File) => {
            const error = validateFile(file);
            if (error) {
                setState({ status: 'error', message: error });
                return;
            }
            setState({ status: 'selected', file });
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    const handleSubmit = async () => {
        if (state.status !== 'selected') return;
        const { file } = state;

        setState({ status: 'uploading', file, progress: 0 });

        try {
            const buffer = await file.arrayBuffer();
            const bytes = new Uint8Array(buffer);
            const binary = Array.from(bytes, (b) =>
                String.fromCharCode(b)
            ).join('');
            const fileBase64 = btoa(binary);

            setState({ status: 'uploading', file, progress: 50 });

            const result = await importFromPdf({ fileBase64 });

            router.push(`/resume/builder/${result.resume_id}`);
        } catch (err: unknown) {
            const message =
                err instanceof Error
                    ? err.message
                    : 'Произошла ошибка. Попробуйте ещё раз.';
            setState({ status: 'error', message });
        }
    };

    const handleDrop = useCallback(
        (e: DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            setIsDragOver(false);
            const file = e.dataTransfer.files[0];
            if (file) handleFile(file);
        },
        [handleFile]
    );

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = () => setIsDragOver(false);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFile(file);
        e.target.value = '';
    };

    const isUploading = state.status === 'uploading';

    return (
        <div className="flex flex-col gap-y-4">
            <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={cn(
                    'flex min-h-56 flex-col items-center justify-center gap-y-3 rounded-12 border-2 border-dashed p-8 transition-colors',
                    isDragOver
                        ? 'border-accent bg-accent/10'
                        : 'border-mauve bg-surface',
                    isUploading && 'pointer-events-none opacity-60'
                )}
            >
                {state.status === 'idle' || state.status === 'error' ? (
                    <>
                        <svg
                            className="h-10 w-10 text-sub"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                        </svg>
                        <p className="text-16 font-500 text-text">
                            Перетащите PDF резюме сюда
                        </p>
                        <p className="text-12 text-sub">
                            только PDF · макс. 5 МБ
                        </p>
                        <button
                            type="button"
                            onClick={() => inputRef.current?.click()}
                            className="mt-2 rounded-8 bg-accent px-4 py-2 text-14 font-500 text-white transition-opacity hover:opacity-80"
                        >
                            Выбрать файл
                        </button>
                        <input
                            ref={inputRef}
                            type="file"
                            accept="application/pdf"
                            className="hidden"
                            onChange={handleInputChange}
                        />
                    </>
                ) : null}

                {(state.status === 'selected' ||
                    state.status === 'uploading') && (
                    <>
                        <svg
                            className="h-10 w-10 text-accent"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                            />
                        </svg>
                        <p className="max-w-xs truncate text-14 font-500 text-text">
                            {state.file.name}
                        </p>
                        <p className="text-12 text-sub">
                            {(state.file.size / 1024).toFixed(1)} КБ
                        </p>
                        {isUploading ? (
                            <div className="w-full max-w-xs">
                                <div className="mb-1 flex justify-between text-12 text-sub">
                                    <span>Анализируем резюме...</span>
                                    <span>{state.progress}%</span>
                                </div>
                                <div className="h-1.5 w-full overflow-hidden rounded-full bg-mantle">
                                    <div
                                        className="h-full rounded-full bg-accent transition-all duration-500"
                                        style={{ width: `${state.progress}%` }}
                                    />
                                </div>
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={() => setState({ status: 'idle' })}
                                className="text-12 text-sub underline hover:text-text"
                            >
                                Выбрать другой файл
                            </button>
                        )}
                    </>
                )}
            </div>

            {state.status === 'error' && (
                <p className="rounded-8 bg-red/10 px-4 py-3 text-14 text-red">
                    {state.message}
                </p>
            )}

            {state.status === 'selected' && (
                <button
                    type="button"
                    onClick={handleSubmit}
                    className="w-full rounded-8 bg-accent py-3 text-14 font-600 text-white transition-opacity hover:opacity-80"
                >
                    Загрузить и создать черновик
                </button>
            )}
        </div>
    );
};
