'use client';

import { Controller, type ControllerFieldState } from 'react-hook-form';
import React from 'react';
import cn from 'classnames';
import { ReactComponent as IconCheck } from '~/shared/assets/icons/check-icon.svg';


interface RenderCheckboxProps extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
    label?: string;
    labelClassName?: string;
    key: string;
}

const RenderDefaultCheckbox: React.FC<RenderCheckboxProps & ControllerFieldState> = ({ label, ...props }) => {

    const { invalid, className, labelClassName, key } = props;

    return (
        <div className={cn('group relative w-full font-400 text-14 leading-5 flex items-center')}>
            <label htmlFor={key} className={cn(
                'relative flex flex-row gap-x-2',
                labelClassName,
                invalid && 'text-red'
            )}
            >
                <input
                    {...props}
                    type="checkbox"
                    id={key}
                    className={cn(
                        'peer appearance-none h-5 w-5 border-2 rounded-sm border-sub bg-transparent checked:bg-mauve checked:border-mauve transition-all cursor-pointer',
                        invalid && 'border-red',
                        className
                    )}
                />
                <IconCheck className={'absolute top-1/2 left-1 -translate-y-1/2 w-3 h-3 fill-base pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity'} />
                {label}
            </label>
        </div>
    );
}

export type CheckboxProps = RenderCheckboxProps & Omit<React.ComponentProps<typeof Controller>, 'render'>

export const Checkbox: React.FC<CheckboxProps> = props => (
    <Controller
        {...props}
        render={({ field, fieldState }) => <RenderDefaultCheckbox {...props} {...field} {...fieldState} />}
    />
);