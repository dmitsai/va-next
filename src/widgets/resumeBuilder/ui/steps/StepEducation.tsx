import React from 'react';
import { Button, ButtonView } from '~/shared/ui/Button/Button';
import { DatePicker } from '~/shared/ui/DatePicker';
import { Divider } from '~/entities/divider';
import type { EducationItem, EducationSection } from '../../model/types';

const inputCls =
    'w-full rounded-6 border border-base bg-mantle px-3 py-2.5 text-14 text-text outline-none transition-colors focus:border-mauve/70';

const emptyItem: EducationItem = {
    institution: '',
    degree: '',
    field: '',
    year_from: '',
    year_to: '',
};

interface StepEducationProps {
    state: EducationSection;
    onChange: (next: EducationSection) => void;
}

export const StepEducation: React.FC<StepEducationProps> = ({ state, onChange }) => {
    const update = (index: number, patch: Partial<EducationItem>) => {
        const items = [...state.items];
        items[index] = { ...items[index]!, ...patch };
        onChange({ items });
    };

    const add = () => onChange({ items: [...state.items, { ...emptyItem }] });
    const remove = (i: number) => onChange({ items: state.items.filter((_, idx) => idx !== i) });

    return (
        <div className="flex flex-col gap-y-6">
            <div>
                <p className="text-12 font-600 uppercase tracking-widest text-sub">Образование</p>
                <p className="mt-1 text-13 text-sub/60">Учебные заведения и курсы</p>
            </div>

            {state.items.map((item, index) => {
                const rowKey = `${item.institution}|${item.degree}|${item.field}|${String(item.year_from)}|${index}`;
                return (
                <React.Fragment key={rowKey}>
                    {index > 0 && <Divider view="horizontal" />}
                    <div className="flex flex-col gap-y-4">
                        <div className="flex items-center justify-between">
                            <p className="text-13 font-600 text-text">
                                {item.institution || `Учебное заведение ${index + 1}`}
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

                        <div className="flex flex-col gap-y-1.5">
                            <label className="text-12 font-500 text-sub">Учебное заведение</label>
                            <input className={inputCls} value={item.institution}
                                onChange={(e) => update(index, { institution: e.target.value })} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-y-1.5">
                                <label className="text-12 font-500 text-sub">Степень</label>
                                <input className={inputCls} value={item.degree}
                                    onChange={(e) => update(index, { degree: e.target.value })} />
                            </div>
                            <div className="flex flex-col gap-y-1.5">
                                <label className="text-12 font-500 text-sub">Специальность</label>
                                <input className={inputCls} value={item.field}
                                    onChange={(e) => update(index, { field: e.target.value })} />
                            </div>
                            <div className="flex flex-col gap-y-1.5">
                                <label className="text-12 font-500 text-sub">Год начала</label>
                                <DatePicker
                                    value={item.year_from}
                                    onChange={(next) => update(index, { year_from: next })}
                                    placeholder="ГГГГ"
                                    mode="year"
                                />
                            </div>
                            <div className="flex flex-col gap-y-1.5">
                                <label className="text-12 font-500 text-sub">Год окончания</label>
                                <DatePicker
                                    value={item.year_to ?? ''}
                                    onChange={(next) => update(index, { year_to: next })}
                                    placeholder="ГГГГ"
                                    mode="year"
                                />
                            </div>
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
                + Добавить образование
            </Button>
        </div>
    );
};
