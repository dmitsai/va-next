'use client';

import cn from 'classnames';
import {
    Listbox,
    ListboxButton,
    ListboxOption,
    ListboxOptions,
} from '@headlessui/react';
import type React from 'react';
import { ReactComponent as CheckIcon } from '~/shared/assets/icons/check-icon.svg';
import { ReactComponent as ChevronIcon } from '~/shared/assets/icons/chevron-icon.svg';

export interface MultiSelectProps {
    selected: string[];
    setSelected: (value: string[]) => void;
    options: string[];
    className?: string;
    placeholder?: string;
}

export const MultiSelect: React.FC<MultiSelectProps> = (props) => {
    const { options, selected, setSelected, className, placeholder } = props;

    const toggleOption = (option: string) => {
        if (selected.includes(option)) {
            setSelected(selected.filter((item) => item !== option));
        } else {
            setSelected([...selected, option]);
        }
    };
    const countSelectedValues = selected.length ? selected.length : undefined;
    return (
        <Listbox multiple value={selected} onChange={setSelected}>
            <ListboxButton
                className={cn(
                    'group relative flex w-full max-w-select flex-row items-center justify-between',
                    'rounded-6 bg-mantle py-1.5 pl-4 pr-8 text-left text-14 font-400 leading-6 text-text',
                    'transition-colors hover:bg-text hover:text-base',
                    className
                )}
            >
                {placeholder}
                <ChevronIcon
                    className={cn(
                        'rotate-0 fill-sub group-hover:fill-base group-data-[open]:rotate-180',
                        'pointer-events-none absolute right-6 transition-transform'
                    )}
                    aria-hidden="true"
                />
                {countSelectedValues && (
                    <div
                        className={
                            'absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-mauve text-base'
                        }
                    >
                        {countSelectedValues}
                    </div>
                )}
            </ListboxButton>
            <ListboxOptions
                anchor="bottom"
                transition
                className={cn(
                    'mt-2 w-[var(--button-width)] rounded-6 border-2 border-mauve bg-base p-2',
                    'transition duration-100 ease-in [--anchor-gap:var(--spacing-1)] focus:outline-none data-[leave]:data-[closed]:opacity-0'
                )}
            >
                {options.map((option) => (
                    <ListboxOption
                        key={option}
                        value={option}
                        className={cn(
                            'group flex cursor-default select-none items-center gap-2 rounded-6 px-3 py-1.5 data-[focus]:bg-mantle'
                        )}
                        onClick={() => toggleOption(option)}
                    >
                        <CheckIcon
                            className={cn(
                                'invisible size-4 fill-mauve group-data-[selected]:visible'
                            )}
                        />
                        <div
                            className={cn(
                                'text-14 font-400 leading-5 text-text'
                            )}
                        >
                            {option}
                        </div>
                    </ListboxOption>
                ))}
            </ListboxOptions>
        </Listbox>
    );
};
