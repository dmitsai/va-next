'use client';

import cn from 'classnames';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import type React from "react";
import { ReactComponent as CheckPurpleIcon } from '~/shared/assets/icons/check-purple-icon.svg';
import { ReactComponent as ChevroIcon } from '~/shared/assets/icons/chevron-icon.svg';

export interface SelectProps {
    selected?: string,
    setSelected: (value: string) => void,
    state: string[]
}
export const Select: React.FC<SelectProps> = (props) => {
    const { state, selected, setSelected } = props;
    return (
        <Listbox value={selected} onChange={setSelected}>
            <ListboxButton
                className={cn(
                    'relative flex flex-row justify-between items-center max-w-52 w-full group',
                    'rounded-6 bg-mantle  py-1.5 pr-8 pl-4 text-left text-text  font-400 text-14 leading-6',
                    ' hover:text-base hover:bg-text transition-colors'
                )}
            >
                {selected}
                <ChevroIcon
                    className={cn(
                        'group-hover:fill-base fill-sub group-data-[open]:rotate-0 rotate-180',
                        'pointer-events-none absolute right-4 transition-transform'
                    )}
                    aria-hidden="true"
                />
            </ListboxButton>
            <ListboxOptions
                anchor="bottom"
                transition
                className={cn(
                    'mt-2 w-[var(--button-width)] rounded-6 border-2 border-mauve bg-base p-2',
                    '[--anchor-gap:var(--spacing-1)] focus:outline-none transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0'
                )}
            >
                {state.map((item) => (
                    <ListboxOption
                        key={item}
                        value={item}
                        className={cn(
                            'group flex cursor-default items-center gap-2 rounded-6 py-1.5 px-3 select-none data-[focus]:bg-mantle'
                        )}
                    >
                        <CheckPurpleIcon className={cn('invisible size-4 fill-white group-data-[selected]:visible')} />
                        <div className={cn('font-400 text-14 leading-5 text-text')}>{item}</div>
                    </ListboxOption>
                ))}
            </ListboxOptions>
        </Listbox>
    );
}