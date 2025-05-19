'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { Control, FieldValues, useForm } from 'react-hook-form';
import { clientApi } from 'trpc/client';
import { z } from 'zod';
import Button, { ButtonView } from '~/shared/ui/Button';
import EmailInput, { emailSchema } from '~/shared/ui/EmailInput';
import PhoneInput, { phoneSchema } from '~/shared/ui/PhoneInput';
import { Popup, type PopupProps } from '~/shared/ui/Popup';
import TextInput, {
    textSchema,
    optionalTextSchema,
} from '~/shared/ui/TextInput';
import { ReactComponent as SpinIcon } from '~/shared/assets/icons/spin.svg';
import { ProfileBioProps } from '~/entities/profileBio';

export interface EditProfileBioProps extends Omit<PopupProps, 'title'> {
    bio: ProfileBioProps;
}

// export interface EditProfileBioProps extends Omit<PopupProps,  'title'> {
//     type: 'CLIENT' | 'COMPANY';
// };

export interface PersonalInfoForm {
    firstName?: string;
    lastName?: string;
    patronymic?: string;
    telegram?: string;
    phone?: string;
    email?: string;
    title?: string;
    website?: string;
}

export const EditProfileBio: React.FC<EditProfileBioProps> = (props) => {
    const {
        setIsOpen,
        bio: { type, data },
    } = props;

    const {
        mutate: updateClient,
        isPending: isClientPending,
        isSuccess: isClientSuccess,
        isError: isClientError,
    } = clientApi.clientProfile.updateProfile.useMutation();

    const {
        mutate: updateCompany,
        isPending: isCompanyPending,
        isSuccess: isCompanySuccess,
        isError: isCompanyError,
    } = clientApi.companyProfile.updateProfile.useMutation();

    const clientFormSchema = z.object({
        firstName: textSchema,
        lastName: textSchema,
        patronymic: optionalTextSchema,
        telegram: textSchema,
        phone: phoneSchema,
        email: emailSchema,
    });

    const companyFormSchema = z.object({
        title: textSchema,
        phone: phoneSchema,
        email: emailSchema,
        website: textSchema,
    });

    const formSchema = type === 'CLIENT' ? clientFormSchema : companyFormSchema;

    const {
        control,
        handleSubmit,
        formState: { isValid },
    } = useForm<PersonalInfoForm>({
        resolver: zodResolver(formSchema),
        defaultValues:
            type === 'CLIENT'
                ? {
                      firstName: data.firstName ?? '',
                      lastName: data.lastName ?? '',
                      patronymic: data.patronymic ?? '',
                      telegram: data.telegram ?? '',
                      phone: data.phoneNumber ?? '',
                      email: data.email ?? '',
                  }
                : {
                      title: data.title ?? '',
                      phone: data.phoneNumber ?? '',
                      email: data.email ?? '',
                      website: data.website ?? '',
                  },
    });

    const onSubmit = (data: PersonalInfoForm) => {
        console.log(data, 'data');
        if (type === 'CLIENT') {
            console.log(data, 'data');
            updateClient({
                name: data.firstName,
                surname: data.lastName,
                patronymic: data.patronymic,
                telegram: data.telegram,
                phone: data.phone,
                email: data.email,
            });
        }
        if (type === 'COMPANY') {
            updateCompany(data);
        }
        console.info('personal info:', JSON.stringify(data));
        setIsOpen(false);
    };

    return (
        <Popup title="Редактирование персональной информации" {...props}>
            <form
                className={'flex w-full flex-col items-end gap-y-8'}
                onSubmit={handleSubmit(onSubmit)}
            >
                {type === 'CLIENT' ? (
                    <>
                        <div className={'grid w-full grid-cols-2 gap-6'}>
                            <TextInput
                                control={
                                    control as unknown as Control<FieldValues>
                                }
                                placeholder={'Имя'}
                                name={'firstName'}
                            />
                            <TextInput
                                control={
                                    control as unknown as Control<FieldValues>
                                }
                                placeholder={'Фамилия'}
                                name={'lastName'}
                            />
                            <TextInput
                                control={
                                    control as unknown as Control<FieldValues>
                                }
                                placeholder={'Отчество (при наличии)'}
                                name={'patronymic'}
                            />
                        </div>
                        <div className={'grid w-full grid-cols-2 gap-6'}>
                            <TextInput
                                control={
                                    control as unknown as Control<FieldValues>
                                }
                                placeholder={'@telegram'}
                                name={'telegram'}
                            />
                            <EmailInput
                                control={
                                    control as unknown as Control<FieldValues>
                                }
                                name={'email'}
                            />
                            <PhoneInput
                                control={
                                    control as unknown as Control<FieldValues>
                                }
                                name={'phone'}
                            />
                        </div>
                    </>
                ) : (
                    <>
                        <div className={'grid w-full grid-cols-1 gap-6'}>
                            <TextInput
                                control={
                                    control as unknown as Control<FieldValues>
                                }
                                placeholder={'Название компании'}
                                name={'title'}
                            />
                        </div>
                        <div className={'grid w-full grid-cols-2 gap-6'}>
                            <PhoneInput
                                control={
                                    control as unknown as Control<FieldValues>
                                }
                                name={'phone'}
                            />
                            <EmailInput
                                control={
                                    control as unknown as Control<FieldValues>
                                }
                                name={'email'}
                            />
                            <TextInput
                                control={
                                    control as unknown as Control<FieldValues>
                                }
                                placeholder={'Сайт'}
                                name={'website'}
                            />
                        </div>
                    </>
                )}
                <Button
                    type={'submit'}
                    buttonView={ButtonView.LARGE}
                    disabled={!isValid || isClientPending || isCompanyPending}
                    className="w-1/4 bg-mauve text-base transition-colors hover:bg-text"
                >
                    {isClientPending || isCompanyPending ? (
                        <SpinIcon className="mt-1 animate-spin" />
                    ) : (
                        <span>Сохранить</span>
                    )}
                </Button>
            </form>
        </Popup>
    );
};
