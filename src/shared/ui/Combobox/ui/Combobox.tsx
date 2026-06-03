'use client';

import { Combobox as HeadlessUICombobox, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react'
import cn from 'classnames';
import React, { useId, useState } from 'react';
import { ReactComponent as CheckIcon } from '~/shared/assets/icons/check-icon.svg';

export interface ComboboxProps {
    doFilter: (query: string) => Array<string>;
    setSelected: (value: string | null) => void;

    label?: React.FC
    labelClassName?: string;

    inputClassName?: string;
    wrapperClassName?: string;
}

export const Combobox: React.FC<ComboboxProps> = (props) => {
    const { doFilter, setSelected, label: Label, inputClassName, wrapperClassName, labelClassName } = props;
    const id = useId();

    const [query, setQuery] = useState('');
    const [isDirty, setIsDirty] = useState(false);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setQuery(value);
        setIsDirty(value !== '');
    };

    const handleSelection = (value: string | null) => {
        setSelected(value);
        setQuery('');
        setIsDirty(false);
    };

    const filteredState = doFilter(query);

    return (
        <HeadlessUICombobox onChange={handleSelection} onClose={() => { setQuery(''); setIsDirty(true) }}>
            <div className={cn('group relative w-full max-w-input font-400 text-14 leading-5', wrapperClassName)}>
                <ComboboxInput
                    id={id}
                    className={cn(
                        'peer w-full outline-none rounded-6 bg-mantle py-2 border-2 border-transparent focus:border-mauve caret-text text-text px-4 max-w-input',
                        inputClassName
                    )}
                    onChange={handleInputChange}
                    value={query}
                />
                {Label && <label
                    htmlFor={id}
                    className={cn(
                        'absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none peer-',
                        'transform transition-all text-sub ml-0.5',
                        isDirty ? ' opacity-0' : 'opacity-70',
                        labelClassName
                    )}
                >
                    <Label />
                </label>}
            </div>

            <ComboboxOptions
                anchor='bottom start'
                transition
                className={cn(
                    'mt-2 w-[var(--input-width)] rounded-6 border-2 border-mauve bg-base p-2 [--anchor-gap:var(--spacing-1)] empty:invisible',
                    'transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0'
                )}
            >
                {filteredState.map((item) => (
                    <ComboboxOption
                        key={item + id}
                        value={item}
                        className='group flex cursor-default items-center gap-2 rounded-6 py-1.5 px-3 select-none data-[focus]:bg-mantle'
                    >
                        <CheckIcon className={cn('invisible size-4 group-data-[selected]:visible fill-mauve')} />
                        <div className={cn('font-400 text-14 leading-5 text-text')}>{item}</div>
                    </ComboboxOption>
                ))}
            </ComboboxOptions>
        </HeadlessUICombobox>
    )
}