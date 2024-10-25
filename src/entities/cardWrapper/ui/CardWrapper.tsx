import React, { PropsWithChildren } from "react";
import cn from 'classnames';

export interface CardWrapperProps extends PropsWithChildren {
    className: string,
}

export const CardWrapper: React.FC<CardWrapperProps> = (props) => {
    const { className, children } = props
    return (
        <div className={cn('group relative flex flex-col max-w-card max-h-[204px] w-full h-full rounded-10 items-start px-4 py-3 gap-y-3', className)} >
            {children}
        </div>
    )
}