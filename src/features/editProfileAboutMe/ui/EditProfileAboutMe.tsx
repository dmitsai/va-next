'use client';

import React from "react";
import { Control, FieldValues, useForm } from "react-hook-form";
import { clientApi } from "trpc/client";
import Button, { ButtonView } from "~/shared/ui/Button";
import { Popup, PopupProps } from "~/shared/ui/Popup";
import { TextArea } from "~/shared/ui/textArea";
import { ReactComponent as SpinIcon } from "~/shared/assets/icons/spin.svg";
import { AboutMeProps } from "~/entities/aboutMe/model/type";

export interface EditProfileAboutMeProps extends Omit<PopupProps, 'title'> {description:AboutMeProps }

export interface AboutMeForm {
    description?: string,
}

export const EditProfileAboutMe: React.FC<EditProfileAboutMeProps> = (props) => {
    const { setIsOpen, description:{type, data} } = props;

     const {
            mutate : updateClient,
            isPending : isClientPending,
            isSuccess : isClientSuccess,
            isError : isClientError,
        } = clientApi.clientProfile.updateProfile.useMutation()
    
        const {
            mutate : updateCompany,
            isPending : isCompanyPending,
            isSuccess : isCompanySuccess,
            isError : isCompanyError,
        } = clientApi.companyProfile.updateProfile.useMutation()
    
    const title = type === 'CLIENT' 
        ? 'Редактирование информации о себе' 
        : 'Редактирование информации о компании';
    
    const placeholder = type === 'CLIENT'
        ? 'Напишите о себе...'
        : 'Расскажите о компании...';

    const { control, handleSubmit, formState: {isValid} } = useForm<AboutMeForm>({
        defaultValues: {
            description: data.description ?? '',
        },
    });

    const onSubmit = (data: AboutMeForm) => {
        if (type === 'CLIENT'){
            console.log(data, 'data')
            updateClient({about_me: data.description})
        }
        if (type === 'COMPANY'){
            updateCompany(data)
        }
        console.info('personal info:', JSON.stringify(data));
        setIsOpen(false);
    };

    return (
        <Popup title={title} {...props}>
            <form className={'flex flex-col w-full justify-between items-end h-96'} onSubmit={handleSubmit(onSubmit)}>
                <TextArea 
                    label={placeholder} 
                    name={'description'} 
                    control={(control as unknown) as Control<FieldValues>} 
                    textAreaClassName={'resize-y max-h-80 min-h-48 w-full'} 
                />
                <Button 
                    type={'submit'} 
                    buttonView={ButtonView.LARGE} 
                    className="w-1/4 text-base bg-mauve hover:bg-text transition-colors"
                    disabled={!isValid || isClientPending || isCompanyPending}
                >
                    {isClientPending || isCompanyPending ?
                                            <SpinIcon className="mt-1 animate-spin" />
                                        :
                                            <span>Сохранить</span>
                                        }
                </Button>
            </form>
        </Popup>
    );
}