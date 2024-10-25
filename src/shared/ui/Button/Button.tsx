import React, { ButtonHTMLAttributes } from "react";
import cn from 'classnames';

export const ButtonView = {
    SMALL: 'small',
    LARGE: 'large',
} as const;

export type ButtonViewType = (typeof ButtonView)[keyof typeof ButtonView];

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    buttonView: ButtonViewType
}

const Button: React.FC<ButtonProps> = (props) => {
    const { children, buttonView, className, ...other } = props;
    return (

        <button type={'button'} {...other} className={cn(
            buttonView === ButtonView.SMALL ? 'py-1.5 px-3 max-h-6' : 'px-4 py-3 max-h-10',
            'relative group flex flex-row gap-x-2 items-center justify-center rounded-6 outline-none overflow-hidden',
            'hover:text-base hover:bg-text disabled:text-sub-secondary/70 disabled:bg-surface-tertiary transition-all',
            className
        )}>
            {children}
        </button>

    )
}

export { Button }
