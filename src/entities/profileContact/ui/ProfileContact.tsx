
import React from "react";
import Link from "next/link";
import { type Icon as IconType } from "~/shared/lib/types";


export interface ProfileContactProps {
    placeholder: string,
    url: string,
    icon: IconType,
    value: string,
}

export const ProfileContact: React.FC<ProfileContactProps> = (props) => {
    const { placeholder, url, icon: Icon, value } = props;
    return (
        <Link className={'group flex flex-row gap-x-3 w-full justify-start items-center cursor-pointer'} href={url}>
            <div className={'flex flex-row gap-x-2 items-center justify-center'}>
                <Icon className={'fill-sub w-4 h-4 '} />
                <span className={'text-14 text-sub '}>{`${placeholder}:`}</span>
            </div>
            <span className={'text-14 text-text font-600 group-hover:text-surface'}>{value}</span>
        </Link>
    )
}