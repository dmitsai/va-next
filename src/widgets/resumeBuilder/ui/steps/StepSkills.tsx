import React, { useState, useEffect, useRef, useCallback } from 'react';
import cnLib from 'classnames';
import { clientApi } from 'trpc/client';
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
} from '@dnd-kit/core';
import {
    SortableContext,
    horizontalListSortingStrategy,
    useSortable,
    arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ReactComponent as CloseIcon } from '~/shared/assets/icons/icon-x-mark.svg';
import type { SkillsSection } from '../../model/types';

export const MAX_SKILLS = 25;

function formatMentions(n: number): string {
    if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
    return String(n);
}

// ─── Sortable skill chip ──────────────────────────────────────────────────────

const SortableSkillChip = ({
    skill,
    onRemove,
}: {
    skill: string;
    onRemove: () => void;
}) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: skill });

    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        cursor: isDragging ? 'grabbing' : 'grab',
        touchAction: 'none',
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="group flex select-none items-center gap-x-1 rounded-4 bg-mauve/15 px-2.5 py-1 text-12 font-500 text-mauve"
            title="Тяни для сортировки"
        >
            <span className="mr-1 text-10 opacity-30">⠿</span>
            {skill}
            <button
                type="button"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                    e.stopPropagation();
                    onRemove();
                }}
                className="group opacity-40 transition-opacity hover:text-red group-hover:opacity-100"
            >
                <CloseIcon className={'size-3 fill-sub group-hover:fill-red'} />
            </button>
        </div>
    );
};

// ─── Main input component ─────────────────────────────────────────────────────

interface SkillTagInputProps {
    skills: string[];
    onSkillsChange: (next: string[]) => void;
}

const SkillTagInput = ({ skills, onSkillsChange }: SkillTagInputProps) => {
    const [input, setInput] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [open, setOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const inputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
    );

    const { data: popularSkills } = clientApi.skill.getPopular.useQuery(
        { limit: 8 },
        { staleTime: 60_000 }
    );

    const { data: searchResults } = clientApi.skill.search.useQuery(
        { query: debouncedQuery, limit: 8 },
        { enabled: debouncedQuery.length > 0, staleTime: 10_000 }
    );

    const suggestions =
        debouncedQuery.length > 0
            ? (searchResults ?? [])
            : (popularSkills ?? []);

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            setDebouncedQuery(input);
        }, 300);
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [input]);

    const add = useCallback(
        (name: string) => {
            const trimmed = name.trim();
            if (
                !trimmed ||
                skills.includes(trimmed) ||
                skills.length >= MAX_SKILLS
            )
                return;
            onSkillsChange([...skills, trimmed]);
            setInput('');
            setDebouncedQuery('');
            setOpen(false);
            setActiveIndex(-1);
        },
        [skills, onSkillsChange]
    );

    const remove = (skill: string) =>
        onSkillsChange(skills.filter((s) => s !== skill));

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const oldIndex = skills.indexOf(String(active.id));
            const newIndex = skills.indexOf(String(over.id));
            onSkillsChange(arrayMove(skills, oldIndex, newIndex));
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveIndex((i) => Math.max(i - 1, -1));
        } else if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            if (activeIndex >= 0 && suggestions[activeIndex]) {
                add(suggestions[activeIndex].name);
            } else {
                add(input);
            }
        } else if (e.key === 'Escape') {
            setOpen(false);
            setActiveIndex(-1);
        } else if (e.key === 'Backspace' && input === '' && skills.length > 0) {
            onSkillsChange(skills.slice(0, -1));
        }
    };

    useEffect(() => {
        if (activeIndex >= 0 && dropdownRef.current) {
            const item = dropdownRef.current.children[activeIndex] as
                | HTMLElement
                | undefined;
            item?.scrollIntoView({ block: 'nearest' });
        }
    }, [activeIndex]);

    const atMax = skills.length >= MAX_SKILLS;

    return (
        <div className="flex flex-col gap-y-3">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-12 font-600 uppercase tracking-widest text-sub">
                        Навыки
                    </p>
                    <p className="mt-1 text-13 text-sub/60">
                        Технологии, инструменты, личные качества
                    </p>
                </div>
                <span
                    className={cnLib(
                        'text-12 font-500 tabular-nums',
                        skills.length >= MAX_SKILLS ? 'text-red' : 'text-mauve'
                    )}
                >
                    {skills.length} / {MAX_SKILLS}
                </span>
            </div>

            {skills.length > 0 && (
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={skills}
                        strategy={horizontalListSortingStrategy}
                    >
                        <div className="flex flex-wrap gap-1.5">
                            {skills.map((skill) => (
                                <SortableSkillChip
                                    key={skill}
                                    skill={skill}
                                    onRemove={() => remove(skill)}
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            )}

            <div className="relative flex gap-x-2">
                <div className="relative flex-1">
                    <input
                        ref={inputRef}
                        className={cnLib(
                            'w-full rounded-6 border border-base bg-mantle px-3 py-2.5 text-14 text-text outline-none transition-colors focus:border-mauve/70',
                            atMax && 'cursor-not-allowed opacity-50'
                        )}
                        value={input}
                        disabled={atMax}
                        placeholder={
                            atMax
                                ? `Максимум ${MAX_SKILLS} навыков`
                                : 'Введи навык...'
                        }
                        onChange={(e) => {
                            setInput(e.target.value);
                            setOpen(true);
                            setActiveIndex(-1);
                        }}
                        onFocus={() => setOpen(true)}
                        onBlur={() => {
                            setTimeout(() => setOpen(false), 150);
                        }}
                        onKeyDown={handleKeyDown}
                    />

                    {open && suggestions.length > 0 && !atMax && (
                        <div
                            ref={dropdownRef}
                            className="absolute left-0 right-0 top-full z-50 mt-1 max-h-52 overflow-y-auto rounded-8 border border-base bg-mantle py-1 shadow-lg"
                        >
                            {suggestions.map((skill, idx) => (
                                <button
                                    key={skill.skill_id}
                                    type="button"
                                    className={cnLib(
                                        'flex w-full items-center justify-between px-3 py-2 text-13 transition-colors',
                                        idx === activeIndex
                                            ? 'bg-surface text-text'
                                            : 'text-text hover:bg-surface/60'
                                    )}
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        add(skill.name);
                                    }}
                                    onMouseEnter={() => setActiveIndex(idx)}
                                >
                                    <span>{skill.name}</span>
                                    {skill.mentions > 0 && (
                                        <span className="text-11 text-sub/50">
                                            {formatMentions(skill.mentions)}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <button
                    type="button"
                    disabled={atMax}
                    className="rounded-6 border border-base bg-surface/40 px-3 py-2 text-13 text-sub hover:bg-surface disabled:cursor-not-allowed disabled:opacity-40"
                    onClick={() => add(input)}
                >
                    Добавить
                </button>
            </div>
            <p className="text-11 text-sub/40">
                Enter или запятая для добавления · ↑↓ для навигации · тяни чип
                для сортировки
            </p>
        </div>
    );
};

interface StepSkillsProps {
    state: SkillsSection;
    onChange: (next: SkillsSection) => void;
}

export const StepSkills: React.FC<StepSkillsProps> = ({ state, onChange }) => {
    const allSkills = [...state.hard, ...state.soft];

    const handleChange = (next: string[]) => {
        onChange({ hard: next, soft: [] });
    };

    return <SkillTagInput skills={allSkills} onSkillsChange={handleChange} />;
};
