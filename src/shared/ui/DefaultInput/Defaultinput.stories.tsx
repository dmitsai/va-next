'use client';

import React from 'react';
import { Control, FieldValues, useForm } from "react-hook-form";
import { type Meta, type StoryObj } from '@storybook/react';
import EmailInput, { emailSchema } from '~/shared/ui/EmailInput';
import PasswordInput, { passwordSchema } from '~/shared/ui/PasswordInput';
import SearchInput, { searchSchema } from '~/shared/ui/SearchInput';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { DefaultInput } from './DefaultInput';

const meta: Meta<typeof EmailInput> = {
    component: DefaultInput,
    title: 'Input'
};

export default meta;
type Story = StoryObj<typeof EmailInput>;

type EmailFormData = {
    email: string;
};

const RenderEmailInput = () => {
    const formSchema = z.object({
        email: emailSchema
    })
    const { handleSubmit, control } = useForm<EmailFormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
        }
    });

    const onSubmit = (data: EmailFormData) => {
        alert(JSON.stringify(data));
    };
    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <EmailInput name={'email'} control={(control as unknown) as Control<FieldValues>} />
        </form>
    )
}

export const Email: Story = {
    render: () => <RenderEmailInput />
}

type PasswordFormData = {
    password: string;
};

const RenderPasswordInput = () => {
    const formSchema = z.object({
        password: passwordSchema
    })
    const { handleSubmit, control } = useForm<PasswordFormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            password: '',
        }
    });

    const onSubmit = (data: PasswordFormData) => {
        alert(JSON.stringify(data));
    };
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <PasswordInput name={'password'} control={(control as unknown) as Control<FieldValues>} />
        </form>
    )
}

export const Password: Story = {
    render: () => <RenderPasswordInput />
}

type SearchFormData = {
    search: string;
};

const RenderSearchInput = () => {
    const formSchema = z.object({
        search: searchSchema
    })
    const { handleSubmit, control } = useForm<SearchFormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            search: '',
        }
    });

    const onSubmit = (data: SearchFormData) => {
        alert(JSON.stringify(data));
    };
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <SearchInput name={'search'} control={(control as unknown) as Control<FieldValues>} />
        </form>
    )
}

export const Search: Story = {
    render: () => <RenderSearchInput />
}