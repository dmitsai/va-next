'use client';

import React from 'react';
import { clientApi } from 'trpc/client';

type InsertMode = 'replace' | 'append';

// ── Suggestion card with replace/append choice for EXPERIENCE ───────────────

const SuggestionCard = ({
    text,
    isExperience,
    onSelect,
}: {
    text: string;
    isExperience: boolean;
    onSelect: (_t: string, _mode?: InsertMode) => void;
}) => {
    const [choosing, setChoosing] = React.useState(false);

    if (isExperience && choosing) {
        return (
            <div className="flex flex-col gap-y-2 rounded-6 border border-mauve/20 bg-mantle p-3">
                <p className="whitespace-pre-wrap text-13 leading-relaxed text-text/80">
                    {text}
                </p>
                <p className="text-11 font-500 text-sub/60">Как вставить?</p>
                <div className="flex gap-x-2">
                    <button
                        type="button"
                        onClick={() => {
                            onSelect(text, 'replace');
                            setChoosing(false);
                        }}
                        className="flex-1 rounded-6 bg-mauve/15 px-2 py-1.5 text-12 font-500 text-mauve transition-colors hover:bg-mauve/25"
                    >
                        Перезаписать
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            onSelect(text, 'append');
                            setChoosing(false);
                        }}
                        className="flex-1 rounded-6 bg-surface/60 px-2 py-1.5 text-12 font-500 text-sub transition-colors hover:bg-surface"
                    >
                        Дополнить
                    </button>
                </div>
                <button
                    type="button"
                    onClick={() => setChoosing(false)}
                    className="w-fit text-11 text-sub/40 hover:text-sub"
                >
                    Отмена
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-y-2 rounded-6 border border-mauve/20 bg-mantle p-3">
            <p className="whitespace-pre-wrap text-13 leading-relaxed text-text/80">
                {text}
            </p>
            <button
                type="button"
                onClick={() => {
                    if (isExperience) {
                        setChoosing(true);
                    } else {
                        onSelect(text);
                    }
                }}
                className="w-fit text-12 font-500 text-mauve hover:underline"
            >
                ↑ Использовать
            </button>
        </div>
    );
};

interface AiSuggestionPanelProps {
    resumeId: string;
    sectionType: 'ABOUT' | 'EXPERIENCE';
    context: {
        desired_position?: string;
        experience_items?: unknown[];
        hard_skills?: string[];
        position?: string;
        company?: string;
        period?: string;
        current_text?: string;
    };
    /** For ABOUT — receives the text directly.
     *  For EXPERIENCE — receives text + insert mode so caller decides what to do. */
    onSelect: (_text: string, _mode?: InsertMode) => void;
}

export const AiSuggestionPanel: React.FC<AiSuggestionPanelProps> = ({
    resumeId,
    sectionType,
    context,
    onSelect,
}) => {
    const { data: requestsData, refetch: refetchLeft } =
        clientApi.ai.getRequestsLeft.useQuery(
            { resumeId, sectionType },
            { enabled: !!resumeId }
        );

    const generate = clientApi.ai.generateSectionText.useMutation({
        onSuccess: () => void refetchLeft(),
    });

    const left = requestsData?.left ?? 3;
    const exhausted = left === 0;

    const currentText = (context.current_text ?? '').trim();
    const hasText = currentText.length > 20;

    const isExperience = sectionType === 'EXPERIENCE';

    if (!hasText) {
        return (
            <div
                className="flex flex-col gap-y-2 rounded-8 border border-mauve/20 p-4"
                style={{ background: 'rgba(147,112,219,0.05)' }}
            >
                <span className="flex items-center gap-x-1.5 text-13 font-600 text-mauve">
                    <span>✦</span>
                    <span>ИИ-помощник</span>
                </span>
                <p className="text-12 leading-relaxed text-sub/60">
                    Напиши текст — ИИ проанализирует его и предложит улучшенные
                    варианты.
                </p>
            </div>
        );
    }

    const handleGenerate = () => {
        generate.mutate({ resumeId, sectionType, context });
    };

    return (
        <div
            className="flex flex-col gap-y-3 rounded-8 border border-mauve/30 p-4"
            style={{ background: 'rgba(147,112,219,0.07)' }}
        >
            {/* Header */}
            <span className="flex items-center gap-x-1.5 text-13 font-600 text-mauve">
                <span>Попробуйте улучшить текст</span>
            </span>
            <div className="flex w-full items-center justify-between gap-x-2">
                <button
                    type="button"
                    disabled={exhausted || generate.isPending}
                    onClick={handleGenerate}
                    title={exhausted ? 'Лимит запросов исчерпан' : undefined}
                    className="w-fit rounded-6 bg-mauve/15 px-3 py-1.5 text-13 font-500 text-mauve transition-colors hover:bg-mauve/25 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    {generate.isPending ? 'Анализирую...' : 'Сгенерировать'}
                </button>
                <span className="shrink-0 text-11 text-sub/50">
                    {left} / {requestsData?.limit ?? 3}
                </span>
            </div>

            {/* Loading skeleton */}
            {generate.isPending && (
                <div className="flex flex-col gap-y-2">
                    {(['sk-a', 'sk-b'] as const).map((id) => (
                        <div
                            key={id}
                            className="h-16 animate-pulse rounded-6 bg-mauve/10"
                        />
                    ))}
                </div>
            )}

            {/* Suggestion cards */}
            {!generate.isPending && generate.data?.variants && (
                <div className="flex flex-col gap-y-2">
                    {generate.data.variants.map((variantText) => (
                        <SuggestionCard
                            key={variantText}
                            text={variantText}
                            isExperience={isExperience}
                            onSelect={onSelect}
                        />
                    ))}
                </div>
            )}

            {generate.error && (
                <p className="text-12 text-red">{generate.error.message}</p>
            )}
        </div>
    );
};
