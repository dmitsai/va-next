'use client';

import React, { useState } from "react";
import { EditProfileAboutMe } from "~/features/editProfileAboutMe";
import Button, { ButtonView } from "~/shared/ui/Button";
import { ReactComponent as IconEdit } from '~/shared/assets/icons/icon-edit.svg';
import cn from 'classnames';


export interface ProfileAboutMeProps {
    description: string,
}

export const ProfileAboutMe: React.FC<ProfileAboutMeProps> = ({ description }) => {
    const [isEditMode, setIsEditMode] = useState(false);
    const [isShowMore, setIsShowMore] = useState(false);
    return (
        <>
            <EditProfileAboutMe isOpen={isEditMode} setIsOpen={setIsEditMode} />
            <div className={'relative w-full flex flex-col gap-y-2 p-2'}>
                <IconEdit className={'absolute right-0 top-0 w-5 h-5 fill-sub hover:fill-surface cursor-pointer'} onClick={() => { setIsEditMode(true) }} />
                <span className={'text-14 text-text font-500'}>{'Обо мне'}</span>
                <div className={'flex flex-col gap-y-1'}>
                    <p className={cn('text-14 text-text h-fit', !isShowMore && 'line-clamp-4')}>
                        {
                            description
                        }
                    </p>
                    <Button
                        onClick={() => { setIsShowMore(!isShowMore) }}
                        className={'text-14 text-mauve bg-base hover:text-text !hover:bg-base !items-start self-end'}
                        buttonView={ButtonView.SMALL}
                    >
                        {isShowMore ? 'Показать меньше' : 'Показать полностью'}
                    </Button>
                </div>
            </div>
        </>
    )
}