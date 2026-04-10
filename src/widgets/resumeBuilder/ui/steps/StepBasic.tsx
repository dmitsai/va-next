import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { clientApi } from 'trpc/client';
import type { BasicSection, StepErrors } from '../../model/types';

interface StepBasicProps {
    state: BasicSection;
    onChange: (next: BasicSection) => void;
    errors?: StepErrors;
}

const input = (hasError?: boolean) =>
    cn(
        'w-full rounded-6 border bg-mantle px-3 py-2.5 text-14 text-text outline-none transition-colors focus:border-mauve/70',
        hasError ? 'border-red' : 'border-base'
    );

const PositionInput = ({
    value,
    hasError,
    onChange,
}: {
    value: string;
    hasError?: boolean;
    onChange: (v: string) => void;
}) => {
    const [open, setOpen] = useState(false);
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [activeIndex, setActiveIndex] = useState(-1);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => setDebouncedQuery(value), 200);
        return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
    }, [value]);

    const { data: items = [] } = clientApi.positions.search.useQuery(
        { query: debouncedQuery, limit: 8 },
        { enabled: debouncedQuery.length >= 2, staleTime: 60_000 }
    );

    useEffect(() => {
        if (activeIndex >= 0 && dropdownRef.current) {
            const el = dropdownRef.current.children[activeIndex] as HTMLElement | undefined;
            el?.scrollIntoView({ block: 'nearest' });
        }
    }, [activeIndex]);

    const select = (title: string) => {
        onChange(title);
        setOpen(false);
        setActiveIndex(-1);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveIndex((i) => Math.min(i + 1, items.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveIndex((i) => Math.max(i - 1, -1));
        } else if (e.key === 'Enter' && activeIndex >= 0 && items[activeIndex]) {
            e.preventDefault();
            select(items[activeIndex]);
        } else if (e.key === 'Escape') {
            setOpen(false);
            setActiveIndex(-1);
        }
    };

    return (
        <div className="relative">
            <input
                className={input(hasError)}
                value={value}
                onChange={(e) => {
                    onChange(e.target.value);
                    setOpen(true);
                    setActiveIndex(-1);
                }}
                onFocus={() => value.length >= 2 && setOpen(true)}
                onBlur={() => setTimeout(() => setOpen(false), 150)}
                onKeyDown={handleKeyDown}
                autoComplete="off"
            />
            {open && items.length > 0 && (
                <div
                    ref={dropdownRef}
                    className="absolute left-0 right-0 top-full z-50 mt-1 max-h-52 overflow-y-auto rounded-8 border border-base bg-mantle py-1 shadow-lg"
                >
                    {items.map((item, idx) => (
                        <button
                            key={item}
                            type="button"
                            className={cn(
                                'w-full px-3 py-2 text-left text-13 transition-colors',
                                idx === activeIndex
                                    ? 'bg-surface text-text'
                                    : 'text-text hover:bg-surface/60'
                            )}
                            onMouseDown={(e) => {
                                e.preventDefault();
                                select(item);
                            }}
                            onMouseEnter={() => setActiveIndex(idx)}
                        >
                            {item}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export const StepBasic: React.FC<StepBasicProps> = ({
    state,
    onChange,
    errors = {},
}) => {
    const set = (patch: Partial<BasicSection>) =>
        onChange({ ...state, ...patch });

    return (
        <div className="flex flex-col gap-y-6">
            <div>
                <p className="text-12 font-600 uppercase tracking-widest text-sub">
                    Основное
                </p>
                <p className="mt-1 text-[13px] text-sub/60">
                    ФИО и желаемая должность
                </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-y-1.5">
                    <label className="text-12 font-500 text-sub">
                        Имя <span className="text-red">*</span>
                    </label>
                    <input
                        className={input(!!errors.name)}
                        value={state.name}
                        onChange={(e) => set({ name: e.target.value })}
                    />
                    {errors.name && (
                        <p className="text-11 text-red">{errors.name}</p>
                    )}
                </div>
                <div className="flex flex-col gap-y-1.5">
                    <label className="text-12 font-500 text-sub">Фамилия</label>
                    <input
                        className={input()}
                        value={state.surname}
                        onChange={(e) => set({ surname: e.target.value })}
                    />
                </div>
            </div>

            <div className="flex flex-col gap-y-1.5">
                <label className="text-12 font-500 text-sub">
                    Желаемая должность <span className="text-red">*</span>
                </label>
                <PositionInput
                    value={state.desired_position}
                    hasError={!!errors.desired_position}
                    onChange={(v) => set({ desired_position: v })}
                />
                {errors.desired_position && (
                    <p className="text-11 text-red">
                        {errors.desired_position}
                    </p>
                )}
            </div>

            <div className="flex flex-col gap-y-1.5">
                <label className="text-12 font-500 text-sub">
                    Ссылка на фото{' '}
                    <span className="text-sub/40">(опционально)</span>
                </label>
                <input
                    className={input()}
                    value={state.photo_url ?? ''}
                    onChange={(e) => set({ photo_url: e.target.value })}
                    placeholder="https://..."
                />
            </div>
        </div>
    );
};
