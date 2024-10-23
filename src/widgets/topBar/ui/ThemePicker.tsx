'use client';

import cn from 'classnames';
import React from "react";
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { ReactComponent as IconMoon } from '~/shared/assets/icons/icon-moon.svg';
import { ReactComponent as IconSun } from '~/shared/assets/icons/icon-sun.svg';
import { ReactComponent as IconSystem } from '~/shared/assets/icons/icon-system.svg';
import { Theme, type ThemeType, useTheme } from '~/shared/lib/theme';
import { type Icon } from '~/shared/lib/types';
import { CONSTANTS } from '~/shared/lib/strings';

export interface ThemePickerItem {
    icon: Icon,
    value: ThemeType
    label: string,
};

export const ThemePicker: React.FC = () => {
    const { theme, setTheme } = useTheme();
    const state: Array<ThemePickerItem> = [
        {
            icon: IconSun,
            value: Theme.light,
            label: CONSTANTS.topBar.theme.light,
        },
        {
            icon: IconMoon,
            value: Theme.dark,
            label: CONSTANTS.topBar.theme.dark,
        },
        {
            icon: IconSystem,
            value: Theme.system,
            label: CONSTANTS.topBar.theme.system,
        },
    ];
    return (
        <Listbox value={theme} onChange={setTheme}>
            <ListboxButton
                className={cn(
                    'flex flex-row justify-center items-center max-h-6 group',
                    'rounded-6 bg-mantle p-1.5 ',
                    'hover:text-base hover:bg-text disabled:text-sub-secondary/70 disabled:bg-surface-tertiary transition-colors data-[open]:bg-mauve'
                )}
            >
                {

                    theme === Theme.dark ?
                        <IconMoon
                            className={cn(
                                'fill-text group-disabled:fill-sub-secondary/70 group-hover:fill-base group-data-[open]:fill-base pointer-events-none'
                            )}
                        />
                        :
                        <IconSun
                            className={cn(
                                'fill-text group-disabled:fill-sub-secondary/70 group-hover:fill-base group-data-[open]:fill-base pointer-events-none'
                            )}
                        />
                }

            </ListboxButton>
            <ListboxOptions
                anchor='bottom end'
                transition
                className={cn(
                    'flex flex-col gap-y-2 mt-3 !max-w-select w-full rounded-6 border-2 border-mauve bg-base py-3',
                    '[--anchor-gap:var(--spacing-1)] focus:outline-none transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0'
                )}
            >
                {state.map((item) => (
                    <ListboxOption
                        key={item.value}
                        value={item.value}
                        className={cn(
                            'group flex cursor-default items-center gap-2 rounded-6 select-none data-[focus]:bg-mantle px-3'
                        )}
                    >
                        <item.icon className={cn('size-4 group-data-[selected]:fill-mauve fill-text')} />
                        <span className={cn('font-400 text-14 leading-5 group-data-[selected]:text-mauve text-text')}>{item.label}</span>
                    </ListboxOption>
                ))}
            </ListboxOptions>
        </Listbox>
    )
}