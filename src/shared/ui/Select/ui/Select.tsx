'use client';

import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import React, { useState } from "react";
import cn from 'classnames';
import ChevronLightIcon from '~/shared/assets/icons/chevron-light-icon.svg';
import ChevronDarkIcon from '~/shared/assets/icons/chevron-dark-icon.svg';
import CheckPurpleIcon from '~/shared/assets/icons/check-purple-icon.svg';

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
                className={'relative flex flex-row max-w-52 w-full justify-between items-center group rounded-6 bg-mantle-dark hover:bg-text-dark py-1.5 pr-8 pl-4 text-left text-text-dark hover:text-base-dark font-400 text-14 leading-6 transition-colors'}
            >
                {selected}
                <ChevronLightIcon
                    className={'group-hover:invisible visible group-data-[open]:rotate-0 rotate-180 pointer-events-none absolute right-4 size-4 transition-transform'}
                    aria-hidden="true"
                />
                <ChevronDarkIcon
                    className={'group-hover:visible invisible group-data-[open]:rotate-0 rotate-180 pointer-events-none absolute right-4 size-4 transition-transform'}
                    aria-hidden="true"
                />
            </ListboxButton>
            <ListboxOptions
                anchor="bottom"
                transition
                className={cn(
                    'mt-2 w-[var(--button-width)] rounded-6 border-2 border-mauve-dark bg-base-dark p-2 [--anchor-gap:var(--spacing-1)] focus:outline-none',
                    'transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0'
                )}
            >
                {state.map((item) => (
                    <ListboxOption
                        key={item}
                        value={item}
                        className="group flex cursor-default items-center gap-2 rounded-6 py-1.5 px-3 select-none data-[focus]:bg-mantle-dark"
                    >
                        <CheckPurpleIcon className="invisible size-4 fill-white group-data-[selected]:visible" />
                        <div className="font-400 text-14 leading-5 text-text-dark">{item}</div>
                    </ListboxOption>
                ))}
            </ListboxOptions>
        </Listbox>
    );
}