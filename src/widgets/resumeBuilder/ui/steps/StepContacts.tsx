import React from 'react';
import cn from 'classnames';
import { Button, ButtonView } from '~/shared/ui/Button/Button';
import type { ContactsSection, StepErrors } from '../../model/types';

const input = (hasError?: boolean) =>
    cn(
        'w-full rounded-6 border bg-mantle px-3 py-2.5 text-14 text-text outline-none transition-colors focus:border-mauve/70',
        hasError ? 'border-red' : 'border-base'
    );

interface StepContactsProps {
    state: ContactsSection;
    onChange: (next: ContactsSection) => void;
    onFillFromProfile: () => void;
    errors?: StepErrors;
}

const FIELDS: {
    key: keyof ContactsSection;
    label: string;
    required?: boolean;
}[] = [
    { key: 'email', label: 'Email', required: true },
    { key: 'phone', label: 'Телефон' },
    { key: 'city', label: 'Город' },
    { key: 'telegram', label: 'Telegram' },
    { key: 'linkedin', label: 'LinkedIn' },
    { key: 'github', label: 'GitHub' },
];

export const StepContacts: React.FC<StepContactsProps> = ({
    state,
    onChange,
    onFillFromProfile,
    errors = {},
}) => {
    const set = (patch: Partial<ContactsSection>) => onChange({ ...state, ...patch });

    return (
        <div className="flex flex-col gap-y-6">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-12 font-600 uppercase tracking-widest text-sub">Контакты</p>
                    <p className="mt-1 text-13 text-sub/60">Как с вами связаться</p>
                </div>
                <Button
                    buttonView={ButtonView.SMALL}
                    className="shrink-0 bg-mauve/10 text-12 text-mauve hover:bg-mauve/20"
                    onClick={onFillFromProfile}
                >
                    Из профиля
                </Button>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-4">
                {FIELDS.map(({ key, label, required }) => (
                    <div key={key} className="flex flex-col gap-y-1.5">
                        <label className="text-12 font-500 text-sub">
                            {label}
                            {required && <span className="ml-0.5 text-red">*</span>}
                        </label>
                        <input
                            className={input(!!errors[key])}
                            value={state[key] ?? ''}
                            onChange={(e) => set({ [key]: e.target.value })}
                        />
                        {errors[key] && (
                            <p className="text-11 text-red">{errors[key]}</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
