'use client';

import React, { useState } from 'react';
import { ProfileContact } from '~/entities/profileContact';

import { ReactComponent as IconTelegram } from '~/shared/assets/icons/icon-telegram.svg';
import { ReactComponent as IconPhone } from '~/shared/assets/icons/icon-phone.svg';
import { ReactComponent as IconEmail } from '~/shared/assets/icons/icon-email.svg';
import { ReactComponent as IconEdit } from '~/shared/assets/icons/icon-edit.svg';
import { EditProfileBio } from '~/features/editProfileBio';
import { ProfileBioProps } from '~/entities/profileBio/model/type';
import { Avatar } from '~/widgets/avatar/Avatar';

export const ProfileBio: React.FC<ProfileBioProps> = (props) => {
    const { data, type } = props;
    const [isEditMode, setIsEditMode] = useState(false);
    return (
        <>
            <EditProfileBio
                isOpen={isEditMode}
                setIsOpen={setIsEditMode}
                bio={props}
            />
            <div className={'relative flex w-full flex-col gap-y-2 p-2'}>
                <IconEdit
                    className={
                        'absolute right-0 top-0 h-5 w-5 cursor-pointer fill-sub hover:fill-surface'
                    }
                    onClick={() => {
                        setIsEditMode(true);
                    }}
                />
                <div className={'flex w-full flex-row gap-x-4'}>
                    <Avatar />
                    {type === 'CLIENT' ? (
                        <div
                            className={
                                'flex h-full flex-col items-start pt-2 text-14 font-600 text-text'
                            }
                        >
                            <div className={'flex flex-row gap-x-2'}>
                                <span>{data.firstName}</span>
                                <span>{data.lastName}</span>
                            </div>
                            {data.patronymic && <span>{data.patronymic}</span>}
                        </div>
                    ) : (
                        <div
                            className={
                                'flex h-full flex-col items-start pt-2 text-14 font-600 text-text'
                            }
                        >
                            <div className={'flex flex-row gap-x-2'}>
                                <span>{data.title}</span>
                            </div>
                        </div>
                    )}
                </div>
                {/* TODO: move to constants */}
                <div className={'flex flex-col gap-y-3'}>
                    <span className={'text-14 font-600 text-text'}>
                        {'Контакты'}
                    </span>
                    {type === 'CLIENT' ? (
                        <div className={'flex flex-col gap-y-2'}>
                            {/* NOTE: temp solution,  rewrite after adding parse contacts logic */}
                            {data.telegram && (
                                <ProfileContact
                                    placeholder={'Телеграм'}
                                    url={''}
                                    icon={IconTelegram}
                                    value={data.telegram}
                                />
                            )}
                            {data.phoneNumber && (
                                <ProfileContact
                                    placeholder={'Телефон'}
                                    url={''}
                                    icon={IconPhone}
                                    value={data.phoneNumber}
                                />
                            )}
                            {data.email && (
                                <ProfileContact
                                    placeholder={'Почта'}
                                    url={''}
                                    icon={IconEmail}
                                    value={data.email}
                                />
                            )}
                        </div>
                    ) : (
                        <div className={'flex flex-col gap-y-2'}>
                            {/* NOTE: temp solution,  rewrite after adding parse contacts logic */}
                            {data.phoneNumber && (
                                <ProfileContact
                                    placeholder={'Телефон'}
                                    url={''}
                                    icon={IconPhone}
                                    value={data.phoneNumber}
                                />
                            )}
                            {data.email && (
                                <ProfileContact
                                    placeholder={'Почта'}
                                    url={''}
                                    icon={IconEmail}
                                    value={data.email}
                                />
                            )}
                            {data.website && (
                                <ProfileContact
                                    placeholder={'Сайт'}
                                    url={''}
                                    icon={IconEmail}
                                    value={data.website}
                                />
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};
