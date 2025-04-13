import { type Icon as IconType } from "~/shared/lib/types";
import cn from 'classnames';
import React, { PropsWithChildren } from "react";

interface PreferencesItemProps extends PropsWithChildren {
    icon: IconType,
    label: string,
    contentClassName?: string
}

export const PreferencesItem: React.FC<PreferencesItemProps> = (props) => {
    const { label, children, icon: Icon, contentClassName } = props;
    return (
        <div className={'flex flex-col gap-y-2'}>
            <div className={'flex flex-row gap-x-2 items-center'}>
                <Icon className={'fill-sub w-4 h-4'} />
                <span className={'text-14 text-text font-500'}>{label}</span>
            </div>
            <div className={cn('flex flex-row gap-x-2 flex-wrap gap-y-2', contentClassName)}>
                {children}
            </div>
        </div>
    )
}