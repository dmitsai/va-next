'use client';

import React from "react";
import { Control, FieldValues, useForm } from "react-hook-form";
import Button, { ButtonView } from "~/shared/ui/Button";
import { Popup, PopupProps } from "~/shared/ui/Popup";
import { TextArea } from "~/shared/ui/textArea";

export interface EditProfileAboutMeProps extends Omit<PopupProps, 'title'> {
    type: 'CLIENT' | 'COMPANY'; 
};

export interface AboutMeForm {
    description: string,
}

export const EditProfileAboutMe: React.FC<EditProfileAboutMeProps> = (props) => {
    const { setIsOpen, type } = props;
    
    const title = type === 'CLIENT' 
        ? 'Редактирование информации о себе' 
        : 'Редактирование информации о компании';
    
    const placeholder = type === 'CLIENT'
        ? 'Напишите о себе...'
        : 'Расскажите о компании...';

    const { control, handleSubmit } = useForm<AboutMeForm>({
        defaultValues: {
            description: ''
        },
    });

    const onSubmit = (data: AboutMeForm) => {
        console.info('about me:', JSON.stringify(data));
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
                >
                    {'Сохранить'}
                </Button>
            </form>
        </Popup>
    );
}