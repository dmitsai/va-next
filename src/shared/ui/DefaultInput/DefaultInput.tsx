'use client';


import { Controller, type ControllerFieldState } from 'react-hook-form';
import React from 'react';
import cn from 'classnames';

interface RenderInputProps extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
    Icon?: React.FC<React.SVGProps<SVGSVGElement>>,
    iconProps?: React.DetailedHTMLProps<React.SVGProps<SVGSVGElement>, SVGSVGElement>,
    labelClassName?: string,
}
const RenderDefaultInput: React.FC<RenderInputProps & ControllerFieldState> = ({ placeholder, ...props }) => {

    const { invalid, isDirty, Icon, className, iconProps, labelClassName } = props;
    const { className: iconClassName, ...otherIconProps } = iconProps || {};

    return (
        <div className={cn('group relative w-fit font-400 text-14 leading-5 max-h-10')}>
            <input
                autoComplete={'off'}
                {...props}
                className={cn(
                    'peer w-full outline-none rounded-6 bg-mantle py-3 border-2 border-transparent focus:border-mauve caret-text text-text pr-4 max-h-10 max-w-96',
                    Icon ? 'pl-11' : 'pl-4',
                    invalid && 'border-red',
                    className
                )}
            />
            {Icon && <Icon className={cn('absolute top-1/2 -translate-y-1/2 left-4', iconClassName)}  {...otherIconProps} />}
            <label className={cn(
                'absolute top-1/2 -translate-y-1/2 pointer-events-none transform transition-all text-sub ml-0.5',
                isDirty ? ' opacity-0' : 'opacity-70',
                Icon ? 'left-11' : 'left-4',
                labelClassName
            )}
            >
                {placeholder}
            </label>
        </div>
    );
}

export type InputProps = RenderInputProps & Omit<React.ComponentProps<typeof Controller>, 'render'>

export const DefaultInput: React.FC<InputProps> = props => (
    <Controller
        {...props}
        render={({ field, fieldState }) => <RenderDefaultInput {...props} {...field} {...fieldState} />}
    />
);