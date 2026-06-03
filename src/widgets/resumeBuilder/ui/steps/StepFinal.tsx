import React from 'react';
import Link from 'next/link';
import { Button, ButtonView } from '~/shared/ui/Button/Button';
import { Divider } from '~/entities/divider';
import type { ResumeFormState, ResumeWithRelations } from '../../model/types';
import { ResumePreview } from '../ResumePreview';

const ScoreRing = ({ score }: { score: number }) => {
    const radius = 18;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;
    let color: string;
    if (score >= 70) color = '#2dd4bf';
    else if (score >= 40) color = '#f59e0b';
    else color = '#f87171';

    return (
        <svg width={48} height={48} viewBox="0 0 48 48" className="shrink-0 -rotate-90">
            <circle
                cx={24}
                cy={24}
                r={radius}
                fill="none"
                stroke="currentColor"
                strokeWidth={5}
                className="text-surface"
            />
            <circle
                cx={24}
                cy={24}
                r={radius}
                fill="none"
                stroke={color}
                strokeWidth={5}
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
            />
        </svg>
    );
};

interface StepFinalProps {
    state: ResumeFormState;
    resume: ResumeWithRelations | null;
    resumeId: string;
    isPublishing: boolean;
    isExporting: boolean;
    onPublish: () => void;
    onExportPdf: () => void;
}

export const StepFinal: React.FC<StepFinalProps> = ({
    state,
    resume,
    resumeId,
    isPublishing,
    isExporting,
    onPublish,
    onExportPdf,
}) => {
    const analysis = resume?.analysis ?? null;
    const status = resume?.status ?? 'DRAFT';

    return (
        <div className="flex gap-x-8">
            {/* Left: full resume preview */}
            <div className="min-w-0 flex-1">
                <ResumePreview
                    state={state}
                    isExporting={isExporting}
                    resumeId={resumeId}
                    onExportPdf={onExportPdf}
                />
            </div>

            {/* Right: action panel */}
            <div className="flex w-[260px] shrink-0 flex-col gap-y-5">
                {/* Status badge */}
                <div className="flex items-center gap-x-2">
                    <span
                        className={
                            status === 'PUBLISHED'
                                ? 'rounded-4 bg-teal/15 px-2.5 py-1 text-12 font-600 text-teal'
                                : 'rounded-4 bg-amber/15 px-2.5 py-1 text-12 font-600 text-amber'
                        }
                    >
                        {status === 'PUBLISHED' ? 'Опубликовано' : 'Черновик'}
                    </span>
                </div>

                <Divider view="horizontal" />

                {/* Analysis block */}
                {analysis ? (
                    <div className="flex flex-col gap-y-4">
                        {/* Score ring + number */}
                        <div className="flex items-center gap-x-3">
                            <ScoreRing score={analysis.score_total} />
                            <div>
                                <p className="text-20 font-700 text-text">{analysis.score_total}</p>
                                <p className="text-11 text-sub/60">из 100</p>
                            </div>
                        </div>

                        <Link
                            href={`/resume/analysis/${resumeId}`}
                            className="text-13 text-mauve underline-offset-2 hover:underline"
                        >
                            Подробный анализ →
                        </Link>

                        <Button
                            buttonView={ButtonView.LARGE}
                            className="w-full bg-surface/50 text-sub hover:bg-surface disabled:opacity-50"
                            disabled={!resumeId || isPublishing}
                            onClick={onPublish}
                        >
                            {isPublishing ? 'Анализируем резюме...' : 'Обновить анализ'}
                        </Button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-y-3">
                        <Button
                            buttonView={ButtonView.LARGE}
                            className="w-full bg-mauve text-base hover:bg-mauve/85 disabled:opacity-50"
                            disabled={!resumeId || isPublishing}
                            onClick={onPublish}
                        >
                            {isPublishing ? 'Публикуем...' : 'Опубликовать'}
                        </Button>
                        {isPublishing && (
                            <p className="text-center text-12 text-sub/60">
                                Обычно занимает 5–15 секунд
                            </p>
                        )}
                    </div>
                )}

                <Divider view="horizontal" />

                {/* PDF download — always visible */}
                <Button
                    buttonView={ButtonView.LARGE}
                    className="w-full bg-surface/50 text-sub hover:bg-surface disabled:opacity-50"
                    disabled={!resumeId || isExporting}
                    onClick={onExportPdf}
                >
                    {isExporting ? 'Генерация...' : 'Скачать PDF'}
                </Button>
            </div>
        </div>
    );
};
