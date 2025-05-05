'use client';

import React, { useState } from "react";
import { EditProfileAboutMe } from "~/features/editProfileAboutMe";
import Button, { ButtonView } from "~/shared/ui/Button";
import { ReactComponent as IconEdit } from '~/shared/assets/icons/icon-edit.svg';
import cn from 'classnames';

export interface CompanyAbout {
    description: string;
}

export interface ClientAbout {
    description: string;
}



export type ProfileAboutMeProps =
    | {
          type: 'CLIENT';
          data: ClientAbout;
      }
    | {
          type: 'COMPANY';
          data: CompanyAbout;
      };


export const ProfileAboutMe: React.FC<ProfileAboutMeProps> = ({ data, type }) => {
    const [isEditMode, setIsEditMode] = useState(false);
    const [isShowMore, setIsShowMore] = useState(false);
    return (
        <>
            <EditProfileAboutMe isOpen={isEditMode} setIsOpen={setIsEditMode} type={type}/>
            <div className={'relative w-full flex flex-col gap-y-2 p-2'}>
                <IconEdit className={'absolute right-0 top-0 w-5 h-5 fill-sub hover:fill-surface cursor-pointer'} onClick={() => { setIsEditMode(true) }} />
                    {type === 'CLIENT' ? (
                        <span className={'text-14 text-text font-500'}>{'Обо мне'}</span>
                    ) : (
                        <span className={'text-14 text-text font-500'}>{'О компании'}</span>
                    )}
                <div className={'flex flex-col gap-y-1'}>
                    <p className={cn('text-14 text-text h-fit', !isShowMore && 'line-clamp-4')}>
                        {
                            data.description
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