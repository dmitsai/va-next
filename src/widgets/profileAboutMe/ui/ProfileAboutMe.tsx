'use client';

import React, { useState } from "react";
import { EditProfileAboutMe } from "~/features/editProfileAboutMe";
import Button, { ButtonView } from "~/shared/ui/Button";
import { ReactComponent as IconEdit } from '~/shared/assets/icons/icon-edit.svg';
import cn from 'classnames';
import { AboutMeProps } from "~/entities/aboutMe";


export const ProfileAboutMe: React.FC<AboutMeProps> = (props) => {
    const { data, type } = props;
    const [isEditMode, setIsEditMode] = useState(false);
    const [isShowMore, setIsShowMore] = useState(false);
    return (
        <>
            <EditProfileAboutMe isOpen={isEditMode} setIsOpen={setIsEditMode} description={props}/>
            <div className={'relative w-full flex flex-col gap-y-2 p-2'}>
                <IconEdit className={'absolute right-0 top-0 w-5 h-5 fill-sub hover:fill-surface cursor-pointer'} onClick={() => { setIsEditMode(true) }} />
                    {type === 'CLIENT' ? (
                        <span className={'text-14 text-text font-500'}>{'Обо мне'}</span>
                    ) : (
                        <span className={'text-14 text-text font-500'}>{'О компании'}</span>
                    )}
                <div className={'flex flex-col gap-y-1'}>
                    {data.description ? (
                        <>
                            <p className={cn('text-14 text-text h-fit', !isShowMore && 'line-clamp-4')}>
                                {data.description}
                            </p>
                            <Button
                                onClick={() => { setIsShowMore(!isShowMore) }}
                                className={'text-14 text-mauve bg-base hover:text-text !hover:bg-base !items-start self-end'}
                                buttonView={ButtonView.SMALL}
                            >
                                {isShowMore ? 'Показать меньше' : 'Показать полностью'}
                            </Button>
                        </>
                    ) : (
                        <p className={'text-14 text-sub-secondary/50 italic'}>
                            Расскажите о себе
                        </p>
                    )}
                </div>
            </div>
        </>
    )
}