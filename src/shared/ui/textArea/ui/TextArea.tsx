import React, { DetailedHTMLProps, TextareaHTMLAttributes } from "react";
import { Controller, ControllerFieldState } from "react-hook-form";
import { type Icon as IconType } from "~/shared/lib/types";
import cn from 'classnames';



interface RenderTextAreaProps extends DetailedHTMLProps<TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement> {
    label?: string,
    labelClassName?: string,

    icon?: IconType,
    iconProps?: React.DetailedHTMLProps<React.SVGProps<SVGSVGElement>, SVGSVGElement>

    textAreaClassName?: string,
    wrapperClassName?: string,

}
const RenderTextArea: React.FC<RenderTextAreaProps & ControllerFieldState> = (props) => {
    const { placeholder, label, labelClassName, icon: Icon, textAreaClassName, wrapperClassName, iconProps, isDirty, invalid, error, ...other } = props;
    const { className: iconClassName, ...otherIconProps } = iconProps ?? {};

    return (
        <div className={cn('group relative w-full first-line:max-w-input font-400 text-14 leading-5', wrapperClassName)}>
            <textarea
                {...other}
                placeholder={placeholder}
                className={cn(
                    'peer w-full outline-none rounded-6 bg-mantle py-2 border-2 border-transparent focus:border-mauve caret-text text-text pr-4 max-w-input',
                    Icon ? 'pl-11' : 'pl-4',
                    invalid && 'border-red',
                    textAreaClassName
                )}
            />
            {Icon && <Icon  {...otherIconProps} className={cn('absolute top-1/2 -translate-y-1/2 left-4', iconClassName)} />}
            {label &&
                <label className={cn(
                    'absolute top-5 -translate-y-1/2 pointer-events-none transform transition-all text-sub ml-0.5',
                    isDirty ? ' opacity-0' : 'opacity-70',
                    Icon ? 'left-11' : 'left-4',
                    labelClassName
                )}>
                    {label}
                </label>
            }
            {invalid && <p className='absolute mt-1 left-0 font-400 text-10 leading-5 text-red whitespace-nowrap'>{error?.message}</p>}
        </div>
    );
}


export type TextAreaProps = RenderTextAreaProps & Omit<React.ComponentProps<typeof Controller>, 'render'>

export const TextArea: React.FC<TextAreaProps> = props => (
    <Controller
        {...props}
        render={({ field, fieldState }) => <RenderTextArea {...props} {...field} {...fieldState} />}
    />
);








