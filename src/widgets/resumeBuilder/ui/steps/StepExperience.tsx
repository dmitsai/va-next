import React, { useRef, useState } from 'react';
import { Button, ButtonView } from '~/shared/ui/Button/Button';
import { DatePicker } from '~/shared/ui/DatePicker';
import { Divider } from '~/entities/divider';
import type { ExperienceItem, ExperienceSection } from '../../model/types';

const inputCls =
    'w-full rounded-6 border border-base bg-mantle px-3 py-2.5 text-14 text-text outline-none transition-colors focus:border-mauve/70';

const emptyItem: ExperienceItem = {
    company: '',
    position: '',
    period_from: '',
    period_to: '',
    is_current: false,
    description: '',
};

interface StepExperienceProps {
    state: ExperienceSection;
    onChange: (next: ExperienceSection) => void;
    /** Called when the user focuses an experience item (so sidebar can show its AI panel) */
    onActiveItemChange?: (_index: number) => void;
}

const newItemKey = () =>
    typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `exp-${Date.now()}-${Math.random().toString(36).slice(2)}`;

/** Parse mm/yyyy string to a sortable number (yyyymm), or 0 if invalid */
function parsePeriod(period: string): number {
    const match = /^(\d{2})\/(\d{4})$/.exec(period.trim());
    if (!match) return 0;
    return parseInt(match[2]!) * 100 + parseInt(match[1]!);
}

export const StepExperience: React.FC<StepExperienceProps> = ({
    state,
    onChange,
    onActiveItemChange,
}) => {
    const itemKeysRef = useRef<string[]>([]);
    const [dateErrors, setDateErrors] = useState<Record<number, string>>({});

    while (itemKeysRef.current.length < state.items.length) {
        itemKeysRef.current.push(newItemKey());
    }
    if (itemKeysRef.current.length > state.items.length) {
        itemKeysRef.current = itemKeysRef.current.slice(0, state.items.length);
    }

    const update = (index: number, patch: Partial<ExperienceItem>) => {
        const items = [...state.items];
        const updated = { ...items[index]!, ...patch };
        items[index] = updated;
        onChange({ items });

        // Validate date order
        if (!updated.is_current && updated.period_from && updated.period_to) {
            const from = parsePeriod(updated.period_from);
            const to = parsePeriod(updated.period_to);
            if (from > 0 && to > 0 && from > to) {
                setDateErrors((prev) => ({
                    ...prev,
                    [index]: 'Дата окончания не может быть раньше даты начала',
                }));
            } else {
                setDateErrors((prev) => { const next = { ...prev }; delete next[index]; return next; });
            }
        } else {
            setDateErrors((prev) => { const next = { ...prev }; delete next[index]; return next; });
        }
    };

    const add = () => {
        itemKeysRef.current.push(newItemKey());
        onChange({ items: [...state.items, { ...emptyItem }] });
    };

    const remove = (i: number) => {
        itemKeysRef.current.splice(i, 1);
        onChange({ items: state.items.filter((_, idx) => idx !== i) });
    };

    return (
        <div className="flex flex-col gap-y-6">
            <div>
                <p className="text-12 font-600 uppercase tracking-widest text-sub">Опыт работы</p>
                <p className="mt-1 text-13 text-sub/60">Места работы в обратном хронологическом порядке</p>
            </div>

            {state.items.map((item, index) => {
                return (
                <React.Fragment key={itemKeysRef.current[index] ?? index}>
                    {index > 0 && <Divider view="horizontal" />}
                    {/* Clicking/focusing any field in this block marks it as active */}
                    {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions -- group focus/mousedown to track active row */}
                    <div
                        className="flex flex-col gap-y-4"
                        onFocus={() => onActiveItemChange?.(index)}
                        onMouseDown={() => onActiveItemChange?.(index)}
                    >
                        <div className="flex items-center justify-between">
                            <p className="text-13 font-600 text-text">
                                {item.company || item.position
                                    ? `${item.position}${item.company ? ` · ${item.company}` : ''}`
                                    : `Место работы ${index + 1}`}
                            </p>
                            {state.items.length > 1 && (
                                <button
                                    type="button"
                                    className="text-12 text-sub/50 hover:text-red"
                                    onClick={() => remove(index)}
                                >
                                    Удалить
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-y-1.5">
                                <label className="text-12 font-500 text-sub">Компания</label>
                                <input className={inputCls} value={item.company}
                                    onChange={(e) => update(index, { company: e.target.value })} />
                            </div>
                            <div className="flex flex-col gap-y-1.5">
                                <label className="text-12 font-500 text-sub">Должность</label>
                                <input className={inputCls} value={item.position}
                                    onChange={(e) => update(index, { position: e.target.value })} />
                            </div>
                            <div className="flex flex-col gap-y-1.5">
                                <label className="text-12 font-500 text-sub">С (мм/гггг)</label>
                                <DatePicker
                                    value={item.period_from}
                                    onChange={(next) => update(index, { period_from: next })}
                                    placeholder="ММ/ГГГГ"
                                />
                            </div>
                            <div className="flex flex-col gap-y-1.5">
                                <label className="text-12 font-500 text-sub">
                                    По{' '}
                                    {item.is_current && <span className="text-teal">(сейчас)</span>}
                                </label>
                                <DatePicker
                                    disabled={item.is_current}
                                    value={item.is_current ? '' : (item.period_to ?? '')}
                                    onChange={(next) => update(index, { period_to: next })}
                                    placeholder="ММ/ГГГГ"
                                />
                            </div>
                        </div>

                        {dateErrors[index] && (
                            <p className="text-12 text-red">{dateErrors[index]}</p>
                        )}

                        <label className="flex cursor-pointer items-center gap-x-2 text-13 text-sub">
                            <input
                                type="checkbox"
                                className="accent-mauve"
                                checked={item.is_current}
                                onChange={(e) =>
                                    update(index, {
                                        is_current: e.target.checked,
                                        period_to: e.target.checked ? '' : item.period_to,
                                    })
                                }
                            />
                            По настоящее время
                        </label>

                        <div className="flex flex-col gap-y-1.5">
                            <label className="text-12 font-500 text-sub">Обязанности и достижения</label>
                            <textarea
                                className="w-full rounded-6 border border-base bg-mantle px-3 py-2.5 text-14 text-text outline-none transition-colors focus:border-mauve/70 resize-y"
                                rows={4}
                                style={{ minHeight: '6rem' }}
                                value={item.description}
                                onChange={(e) => update(index, { description: e.target.value })}
                            />
                        </div>
                    </div>
                </React.Fragment>
                );
            })}

            <Button
                buttonView={ButtonView.SMALL}
                className="w-fit bg-surface/40 text-12 text-sub hover:bg-surface"
                onClick={add}
            >
                + Добавить место работы
            </Button>
        </div>
    );
};
