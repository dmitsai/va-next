import React from 'react';
import { Button, ButtonView } from '~/shared/ui/Button/Button';
import { Divider } from '~/entities/divider';
import type { PortfolioItem, PortfolioSection } from '../../model/types';

const inputCls =
    'w-full rounded-6 border border-base bg-mantle px-3 py-2.5 text-14 text-text outline-none transition-colors focus:border-mauve/70';

const emptyItem: PortfolioItem = { title: '', url: '', description: '' };

interface StepPortfolioProps {
    state: PortfolioSection;
    onChange: (next: PortfolioSection) => void;
}

export const StepPortfolio: React.FC<StepPortfolioProps> = ({ state, onChange }) => {
    const update = (index: number, patch: Partial<PortfolioItem>) => {
        const items = [...state.items];
        items[index] = { ...items[index]!, ...patch };
        onChange({ items });
    };

    const add = () => onChange({ items: [...state.items, { ...emptyItem }] });
    const remove = (i: number) => onChange({ items: state.items.filter((_, idx) => idx !== i) });

    return (
        <div className="flex flex-col gap-y-6">
            <div>
                <p className="text-12 font-600 uppercase tracking-widest text-sub">Портфолио</p>
                <p className="mt-1 text-13 text-sub/60">Ссылки на проекты и работы</p>
            </div>

            {state.items.map((item, index) => {
                const rowKey = `${item.title}|${item.url}|${index}`;
                return (
                <React.Fragment key={rowKey}>
                    {index > 0 && <Divider view="horizontal" />}
                    <div className="flex flex-col gap-y-4">
                        <div className="flex items-center justify-between">
                            <p className="text-13 font-600 text-text">
                                {item.title || `Проект ${index + 1}`}
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
                            <label className="text-12 font-500 text-sub">Название</label>
                            <input className={inputCls} value={item.title}
                                onChange={(e) => update(index, { title: e.target.value })} />
                        </div>

                        <div className="flex flex-col gap-y-1.5">
                            <label className="text-12 font-500 text-sub">Ссылка</label>
                            <input className={inputCls} value={item.url}
                                onChange={(e) => update(index, { url: e.target.value })} />
                        </div>

                        <div className="flex flex-col gap-y-1.5">
                            <label className="text-12 font-500 text-sub">
                                Описание{' '}
                                <span className="text-sub/40">(опционально)</span>
                            </label>
                            <textarea
                                className="w-full rounded-6 border border-base bg-mantle px-3 py-2.5 text-14 text-text outline-none transition-colors focus:border-mauve/70"
                                rows={3}
                                value={item.description ?? ''}
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
                + Добавить проект
            </Button>
        </div>
    );
};
