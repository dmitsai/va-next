'use client';

import { Controller, type ControllerFieldState } from 'react-hook-form';
import React, { useEffect } from 'react';
import cn from 'classnames';
import { ReactComponent as IconCheck } from '~/shared/assets/icons/check-icon.svg';

interface RenderCheckboxProps
    extends React.DetailedHTMLProps<
        React.InputHTMLAttributes<HTMLInputElement>,
        HTMLInputElement
    > {
    label?: string;
    labelClassName?: string;
    key: string;
    wrapperClassName?: string;
}

const RenderDefaultCheckbox: React.FC<
    RenderCheckboxProps & ControllerFieldState
> = ({ label, ...props }) => {
    const {
        invalid,
        className,
        labelClassName,
        key,
        wrapperClassName,
        checked,
    } = props;
    return (
        <div
            className={cn(
                'group relative flex w-full items-center text-14 font-400 leading-5',
                wrapperClassName
            )}
        >
            <label
                htmlFor={key}
                className={cn(
                    'relative flex flex-row gap-x-2',
                    labelClassName,
                    invalid && 'text-red'
                )}
            >
                <input
                    {...props}
                    type="checkbox"
                    checked={!!checked}
                    id={key}
                    className={cn(
                        'peer h-5 w-5 cursor-pointer appearance-none rounded-sm border-2 border-sub bg-transparent transition-all checked:border-mauve checked:bg-mauve',
                        invalid && 'border-red',
                        className
                    )}
                />
                <IconCheck
                    className={
                        'pointer-events-none absolute left-1 top-1/2 h-3 w-3 -translate-y-1/2 fill-base opacity-0 transition-opacity peer-checked:opacity-100'
                    }
                />
                {label}
            </label>
        </div>
    );
};

export type CheckboxProps = RenderCheckboxProps &
    Omit<React.ComponentProps<typeof Controller>, 'render'>;

export const Checkbox: React.FC<CheckboxProps> = (props) => (
    <Controller
        {...props}
        render={({ field, fieldState }) => (
            <RenderDefaultCheckbox {...props} {...field} {...fieldState} />
        )}
    />
);
