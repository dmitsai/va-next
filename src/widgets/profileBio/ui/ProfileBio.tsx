'use client';

import React, { useState } from "react";
import { ProfileContact } from "~/entities/profileContact";

import { ReactComponent as IconTelegram } from '~/shared/assets/icons/icon-telegram.svg';
import { ReactComponent as IconPhone } from '~/shared/assets/icons/icon-phone.svg';
import { ReactComponent as IconEmail } from '~/shared/assets/icons/icon-email.svg';
import { ReactComponent as IconEdit } from '~/shared/assets/icons/icon-edit.svg';
import { EditProfileBio } from "~/features/editProfileBio";
import { ProfileAvatarUploader } from "~/widgets/avatar/ui/Avatar";

export interface CompanyBio {
    title: string,
    email: string,
    phoneNumber: string,
    website: string
}

export interface ClientBio {
    firstName: string,
    lastName: string,
    patronymic: string | undefined,
    
    telegram: string | undefined,
    phoneNumber: string | undefined,
    email: string | undefined,
}

export type ProfileBioProps =
    | {
          type: 'CLIENT';
          data: ClientBio;
      }
    | {
          type: 'COMPANY';
          data: CompanyBio;
      };

export const ProfileBio: React.FC<ProfileBioProps> = (props) => {
    const { data, type } = props;
    const [isEditMode, setIsEditMode] = useState(false);
    return (
        <>
            <EditProfileBio isOpen={isEditMode} setIsOpen={setIsEditMode} type={type}/>
            <div className={'relative flex flex-col p-2 gap-y-2 w-full'}>
                <IconEdit className={'absolute right-0 top-0 w-5 h-5 fill-sub hover:fill-surface cursor-pointer'} onClick={() => { setIsEditMode(true) }} />
                <div className={'flex flex-row w-full gap-x-4'}>
                   <IconEdit className="absolute right-0 top-0 w-5 h-5 fill-sub hover:fill-surface cursor-pointer" onClick={() => { setIsEditMode(true) }} />
                    <ProfileAvatarUploader />
                    {type === 'CLIENT' ?  (
                    <div className={'flex flex-col h-full items-start text-14 text-text font-600 pt-2'}>
                        <div className={'flex flex-row gap-x-2'}>
                            <span>{data.firstName}</span>
                            <span>{data.lastName}</span>
                        </div>
                        {data.patronymic && <span>{data.patronymic}</span>}
                    </div>):
                    (
                    <div className={'flex flex-col h-full items-start text-14 text-text font-600 pt-2'}>
                        <div className={'flex flex-row gap-x-2'}>
                            <span>{data.title}</span>
                        </div>
                    </div>
                    )}
                </div>
                {/* TODO: move to constants */}
                <div className={'flex flex-col gap-y-3'}>
                    <span className={'text-text  text-14 font-600'}>{'Контакты'}</span>
                    {type === 'CLIENT' ?  (
                    <div className={'flex flex-col gap-y-2'}>
                        {/* NOTE: temp solution,  rewrite after adding parse contacts logic */}
                        {data.telegram && <ProfileContact placeholder={"Телеграм"} url={""} icon={IconTelegram} value={data.telegram} />}
                        {data.phoneNumber && <ProfileContact placeholder={"Телефон"} url={""} icon={IconPhone} value={data.phoneNumber} />}
                        {data.email && <ProfileContact placeholder={"Почта"} url={""} icon={IconEmail} value={data.email} />}
                    </div>) :
                    (
                        <div className={'flex flex-col gap-y-2'}>
                        {/* NOTE: temp solution,  rewrite after adding parse contacts logic */}
                        {data.phoneNumber && <ProfileContact placeholder={"Телефон"} url={""} icon={IconPhone} value={data.phoneNumber} />}
                        {data.email && <ProfileContact placeholder={"Почта"} url={""} icon={IconEmail} value={data.email} />}
                        {data.website && <ProfileContact placeholder={"Сайт"} url={""} icon={IconEmail} value={data.website} />}
                        </div>
                    )}
                </div>
            </div >
        </>
    )
}