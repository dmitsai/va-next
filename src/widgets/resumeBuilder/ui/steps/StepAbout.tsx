import React from 'react';
import type { AboutSection } from '../../model/types';

interface StepAboutProps {
    state: AboutSection;
    onChange: (next: AboutSection) => void;
}

export const StepAbout: React.FC<StepAboutProps> = ({ state, onChange }) => (
    <div className="flex flex-col gap-y-6">
        <div>
            <p className="text-12 font-600 uppercase tracking-widest text-sub">О себе</p>
            <p className="mt-1 text-13 text-sub/60">
                Краткое описание вас как специалиста
            </p>
        </div>

        <div className="flex flex-col gap-y-1.5">
            <label className="text-12 font-500 text-sub">Текст</label>
            <textarea
                className="w-full rounded-6 border border-base bg-mantle px-3 py-2.5 text-14 text-text outline-none transition-colors focus:border-mauve/70 resize-y"
                rows={9}
                value={state.text}
                onChange={(e) => onChange({ text: e.target.value })}
            />
            <p className="text-right text-11 text-sub/40">
                {state.text.length} символов
            </p>
        </div>
    </div>
);
