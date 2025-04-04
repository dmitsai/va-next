'use client';

import React, { useState } from "react";
import { ProfileContact } from "~/entities/profileContact";

import { ReactComponent as IconTelegram } from '~/shared/assets/icons/icon-telegram.svg';
import { ReactComponent as IconPhone } from '~/shared/assets/icons/icon-phone.svg';
import { ReactComponent as IconEmail } from '~/shared/assets/icons/icon-email.svg';
import { ReactComponent as IconEdit } from '~/shared/assets/icons/icon-edit.svg';
import { EditProfileBio } from "~/features/editProfileBio";


export interface ProfileBioProps {
    firstName: string,
    lastName: string,
    patronymic: string | undefined,

    telegram: string | undefined,
    phoneNumber: string | undefined,
    email: string | undefined,
}

export const ProfileBio: React.FC<ProfileBioProps> = (props) => {
    const { firstName, lastName, patronymic, telegram, phoneNumber, email } = props;
    const [isEditMode, setIsEditMode] = useState(false);
    return (
        <>
            <EditProfileBio isOpen={isEditMode} setIsOpen={setIsEditMode} />
            <div className={'relative flex flex-col p-2 gap-y-2 w-full'}>
                <IconEdit className={'absolute right-0 top-0 w-5 h-5 fill-sub hover:fill-surface cursor-pointer'} onClick={() => { setIsEditMode(true) }} />
                <div className={'flex flex-row w-full gap-x-4'}>
                    {/* TODO: add Avatar component */}
                    <div className={'flex w-20 h-20 rounded-20 bg-rosewater items-center justify-center text-14 text-text'}>
                        AVATAR
                    </div>
                    <div className={'flex flex-col h-full items-start text-14 text-text font-600 pt-2'}>
                        <div className={'flex flex-row gap-x-2'}>
                            <span>{firstName}</span>
                            <span>{lastName}</span>
                        </div>
                        {patronymic && <span>{patronymic}</span>}
                    </div>
                </div>
                {/* TODO: move to constants */}
                <div className={'flex flex-col gap-y-3'}>
                    <span className={'text-text  text-14 font-600'}>{'Контакты'}</span>
                    <div className={'flex flex-col gap-y-2'}>
                        {/*NOTE: temp solution,  rewrite after adding parse contacts logic */}
                        {telegram && <ProfileContact placeholder={"Телеграм"} url={""} icon={IconTelegram} value={telegram} />}
                        {phoneNumber && <ProfileContact placeholder={"Телефон"} url={""} icon={IconPhone} value={phoneNumber} />}
                        {email && <ProfileContact placeholder={"Почта"} url={""} icon={IconEmail} value={email} />}
                    </div>
                </div>
            </div >
        </>
    )
}