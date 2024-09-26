import React, {ButtonHTMLAttributes, PropsWithChildren} from "react";
import cn from 'classnames';

export  const ButtonView = {
    SMALL: 'small',
    LARGE: 'large',
} as const;

export type ButtonViewType = (typeof ButtonView)[keyof typeof ButtonView];

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
   buttonView: ButtonViewType
}

export const  Button: React.FC<ButtonProps> = (props) => {
    const {children, buttonView,className, ...other}=props;
    return (

            <button type={'button'} {...other} className={cn(buttonView === ButtonView.SMALL ? 'btn-small' : 'btn-large','relative flex flex-row gap-x-2 items-center justify-center rounded-6 outline-none',className)}>
                {children}
            </button>

    )
}

