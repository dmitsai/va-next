import React, { DetailedHTMLProps, TextareaHTMLAttributes } from 'react';
import { Controller, ControllerFieldState } from 'react-hook-form';
import { type Icon as IconType } from '~/shared/lib/types';
import cn from 'classnames';

interface RenderTextAreaProps
    extends DetailedHTMLProps<
        TextareaHTMLAttributes<HTMLTextAreaElement>,
        HTMLTextAreaElement
    > {
    label?: string;
    labelClassName?: string;

    icon?: IconType;
    iconProps?: React.DetailedHTMLProps<
        React.SVGProps<SVGSVGElement>,
        SVGSVGElement
    >;

    textAreaClassName?: string;
    wrapperClassName?: string;
}
const RenderTextArea: React.FC<RenderTextAreaProps & ControllerFieldState> = (
    props
) => {
    const {
        placeholder,
        label,
        labelClassName,
        icon: Icon,
        textAreaClassName,
        wrapperClassName,
        iconProps,
        isDirty,
        invalid,
        error,
        value,
        ...other
    } = props;
    const { className: iconClassName, ...otherIconProps } = iconProps ?? {};
    const hasValue = value !== undefined && value !== null && value !== '';
    return (
        <div
            className={cn(
                'group relative w-full text-14 font-400 leading-5 first-line:max-w-input',
                wrapperClassName
            )}
        >
            <textarea
                value={value}
                {...other}
                placeholder={placeholder}
                className={cn(
                    'peer w-full max-w-input rounded-6 border-2 border-transparent bg-mantle py-2 pr-4 text-text caret-text outline-none focus:border-mauve',
                    Icon ? 'pl-11' : 'pl-4',
                    invalid && 'border-red',
                    textAreaClassName
                )}
            />
            {Icon && (
                <Icon
                    {...otherIconProps}
                    className={cn(
                        'absolute left-4 top-1/2 -translate-y-1/2',
                        iconClassName
                    )}
                />
            )}
            {label && (
                <label
                    className={cn(
                        'pointer-events-none absolute top-5 ml-0.5 -translate-y-1/2 transform text-sub transition-all',
                        hasValue || isDirty ? 'opacity-0' : 'opacity-70',
                        Icon ? 'left-11' : 'left-4',
                        labelClassName
                    )}
                >
                    {label}
                </label>
            )}
            {invalid && (
                <p className="absolute left-0 mt-1 whitespace-nowrap text-10 font-400 leading-5 text-red">
                    {error?.message}
                </p>
            )}
        </div>
    );
};

export type TextAreaProps = RenderTextAreaProps &
    Omit<React.ComponentProps<typeof Controller>, 'render'>;

export const TextArea: React.FC<TextAreaProps> = (props) => (
    <Controller
        {...props}
        render={({ field, fieldState }) => (
            <RenderTextArea {...props} {...field} {...fieldState} />
        )}
    />
);
