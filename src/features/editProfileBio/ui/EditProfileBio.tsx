'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Button, { ButtonView } from "~/shared/ui/Button";
import EmailInput, { emailSchema } from "~/shared/ui/EmailInput";
import PhoneInput, { phoneSchema } from "~/shared/ui/PhoneInput";
import { Popup, type PopupProps } from "~/shared/ui/Popup";
import TextInput, { textSchema, optionalTextSchema } from "~/shared/ui/TextInput";

export interface EditProfileBioProps extends Omit<PopupProps, 'title'> { };

export interface PersonalInfoForm {
    firstName: string,
    lastName: string,
    patronymic: string,
    telegram: string,
    phone: string,
    email: string,
}

export const EditProfileBio: React.FC<EditProfileBioProps> = (props) => {
    const { setIsOpen } = props;
    // NOTE: add  logic of dispay patronymic if exists 
    const formSchema = z.object({
        firstName: textSchema,
        lastName: textSchema,
        patronymic: optionalTextSchema,
        telegram: textSchema,
        phone: phoneSchema,
        email: emailSchema,

    })
    const { control, handleSubmit } = useForm<PersonalInfoForm>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            patronymic: '',
            telegram: '',
            phone: '',
            email: '',
        },
    });
    const onSubmit = (data: PersonalInfoForm) => {
        alert(JSON.stringify(data));
        setIsOpen(false);
    };
    return (
        <Popup title="Редактирование персональной информации" {...props}>
            <form className={'flex flex-col gap-y-8 w-full items-end'} onSubmit={handleSubmit(onSubmit)}>
                <div className={'grid grid-cols-2 gap-6'}>
                    <TextInput control={control} placeholder={"Имя"} name={'firstName'} />
                    <TextInput control={control} placeholder={"Фамилия"} name={'lastName'} />
                    <TextInput control={control} placeholder={"Отчество (при наличии)"} name={'patronymic'} />
                </div>
                {/*TODO: fix after add parsing contacts */}
                <div className={'grid grid-cols-2 gap-6'}>
                    <TextInput control={control} placeholder={"@telegram"} name={"telegram"} />
                    <EmailInput control={control} name={"email"} />
                    <PhoneInput control={control} name={"phone"} />
                </div>
                <Button type={'submit'} buttonView={ButtonView.LARGE} className=" w-1/4 text-base bg-mauve hover:bg-text transition-colors">
                    {'Сохранить'}
                </Button>
            </form>
        </Popup >
    )
}