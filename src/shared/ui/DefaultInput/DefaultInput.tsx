'use client';

import { Controller, type ControllerFieldState } from 'react-hook-form';
import React from 'react';
import cn from 'classnames';

interface RenderInputProps
    extends React.DetailedHTMLProps<
        React.InputHTMLAttributes<HTMLInputElement>,
        HTMLInputElement
    > {
    icon?: React.FC<React.SVGProps<SVGSVGElement>>;
    iconProps?: React.DetailedHTMLProps<
        React.SVGProps<SVGSVGElement>,
        SVGSVGElement
    >;
    labelClassName?: string;
    wrapperClassName?: string;
}

// TODO: add custom styles for autocomplete
const RenderDefaultInput: React.FC<RenderInputProps & ControllerFieldState> = ({
    placeholder,
    ...props
}) => {
    const {
        invalid,
        isDirty,
        icon: Icon,
        className,
        iconProps,
        labelClassName,
        error,
        wrapperClassName,
        value,
    } = props;
    const { className: iconClassName, ...otherIconProps } = iconProps ?? {};
    const hasValue = value !== undefined && value !== null && value !== '';
    return (
        <div
            className={cn(
                'group relative w-full max-w-input text-14 font-400 leading-5',
                wrapperClassName
            )}
        >
            <input
                {...props}
                className={cn(
                    'peer w-full max-w-input rounded-6 border-2 border-transparent bg-mantle py-2 pr-4 text-text caret-text outline-none focus:border-mauve',
                    Icon ? 'pl-11' : 'pl-4',
                    invalid ? 'border-red' : 'border-transparent',
                    className
                )}
            />
            {Icon && (
                <Icon
                    className={cn(
                        'absolute left-4 top-1/2 -translate-y-1/2',
                        iconClassName
                    )}
                    {...otherIconProps}
                />
            )}
            <label
                className={cn(
                    'pointer-events-none absolute top-1/2 ml-0.5 -translate-y-1/2 transform text-sub transition-all',
                    hasValue || isDirty ? 'opacity-0' : 'opacity-70',
                    Icon ? 'left-11' : 'left-4',
                    labelClassName
                )}
            >
                {placeholder}
            </label>
            {invalid && (
                <p className="absolute left-0 mt-1 whitespace-nowrap text-10 font-400 leading-5 text-red">
                    {error?.message}
                </p>
            )}
        </div>
    );
};

export type InputProps = RenderInputProps &
    Omit<React.ComponentProps<typeof Controller>, 'render'>;

export const DefaultInput: React.FC<InputProps> = (props) => (
    <Controller
        {...props}
        render={({ field, fieldState }) => (
            <RenderDefaultInput {...props} {...field} {...fieldState} />
        )}
    />
);
