'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { Control, FieldValues, useForm } from "react-hook-form";
import { z } from "zod";
import Button, { ButtonView } from "~/shared/ui/Button";
import EmailInput, { emailSchema } from "~/shared/ui/EmailInput";
import PhoneInput, { phoneSchema } from "~/shared/ui/PhoneInput";
import { Popup, type PopupProps } from "~/shared/ui/Popup";
import TextInput, { textSchema, optionalTextSchema } from "~/shared/ui/TextInput";

export interface EditProfileBioProps extends Omit<PopupProps, 'title'> {
    type: 'CLIENT' | 'COMPANY';
};

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
    const { setIsOpen, type } = props;
    
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

    const { control, handleSubmit } = useForm<PersonalInfoForm>({
        resolver: zodResolver(formSchema),
        defaultValues: type === 'CLIENT' ? {
            firstName: '',
            lastName: '',
            patronymic: '',
            telegram: '',
            phone: '',
            email: '',
        } : {
            title: '',
            phone: '',
            email: '',
            website: '',
        },
    });

    const onSubmit = (data: PersonalInfoForm) => {
        console.info('personal info:', JSON.stringify(data));
        setIsOpen(false);
    };

    return (
        <Popup title="Редактирование персональной информации" {...props}>
            <form className={'flex flex-col gap-y-8 w-full items-end'} onSubmit={handleSubmit(onSubmit)}>
                {type === 'CLIENT' ? (
                    <>
                        <div className={'grid grid-cols-2 gap-6 w-full'}>
                            <TextInput control={(control as unknown) as Control<FieldValues>} placeholder={"Имя"} name={'firstName'} />
                            <TextInput control={(control as unknown) as Control<FieldValues>} placeholder={"Фамилия"} name={'lastName'} />
                            <TextInput control={(control as unknown) as Control<FieldValues>} placeholder={"Отчество (при наличии)"} name={'patronymic'} />
                        </div>
                        <div className={'grid grid-cols-2 gap-6 w-full'}>
                            <TextInput control={(control as unknown) as Control<FieldValues>} placeholder={"@telegram"} name={"telegram"} />
                            <EmailInput control={(control as unknown) as Control<FieldValues>} name={"email"} />
                            <PhoneInput control={(control as unknown) as Control<FieldValues>} name={"phone"} />
                        </div>
                    </>
                ) : (
                    <>
                        <div className={'grid grid-cols-1 gap-6 w-full'}>
                            <TextInput control={(control as unknown) as Control<FieldValues>} placeholder={"Название компании"} name={'title'} />
                        </div>
                        <div className={'grid grid-cols-2 gap-6 w-full'}>
                            <PhoneInput control={(control as unknown) as Control<FieldValues>} name={"phone"} />
                            <EmailInput control={(control as unknown) as Control<FieldValues>} name={"email"} />
                            <TextInput control={(control as unknown) as Control<FieldValues>} placeholder={"Сайт"} name={"website"} />
                        </div>
                    </>
                )}
                <Button type={'submit'} buttonView={ButtonView.LARGE} className="w-1/4 text-base bg-mauve hover:bg-text transition-colors">
                    {'Сохранить'}
                </Button>
            </form>
        </Popup>
    )
}