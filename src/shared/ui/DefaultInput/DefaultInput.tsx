'use client';


import { Controller, type ControllerFieldState } from 'react-hook-form';
import React from 'react';
import cn from 'classnames';

interface RenderInputProps extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
    icon?: React.FC<React.SVGProps<SVGSVGElement>>,
    iconProps?: React.DetailedHTMLProps<React.SVGProps<SVGSVGElement>, SVGSVGElement>,
    labelClassName?: string,
}

//TODO: add custom styles for autocomplete
const RenderDefaultInput: React.FC<RenderInputProps & ControllerFieldState> = ({ placeholder, ...props }) => {

    const { invalid, isDirty, icon: Icon, className, iconProps, labelClassName } = props;
    const { className: iconClassName, ...otherIconProps } = iconProps || {};

    return (
        <div className={cn('group relative w-full max-w-input font-400 text-14 leading-5')}>
            <input
                {...props}
                className={cn(
                    'peer w-full outline-none rounded-6 bg-mantle py-2 border-2 border-transparent focus:border-mauve caret-text text-text pr-4 max-w-input',
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