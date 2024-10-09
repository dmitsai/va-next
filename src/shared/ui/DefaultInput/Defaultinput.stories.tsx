'use client';

import React from 'react';
import { useForm } from "react-hook-form";
import { type Meta, type StoryObj } from '@storybook/react';
import EmailInput from '~/shared/ui/EmailInput';
import PasswordInput from '~/shared/ui/PasswordInput';
import SearchInput from '~/shared/ui/SearchInput';
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
    const { handleSubmit, control } = useForm<EmailFormData>({
        defaultValues: {
            email: '',
        }
    });

    const onSubmit = (data: EmailFormData) => {
        alert(JSON.stringify(data));
    };
    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <EmailInput name={'email'} control={control} />
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
    const { handleSubmit, control } = useForm<PasswordFormData>({
        defaultValues: {
            password: '',
        }
    });

    const onSubmit = (data: PasswordFormData) => {
        alert(JSON.stringify(data));
    };
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <PasswordInput name={'password'} control={control} />
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
    const { handleSubmit, control } = useForm<SearchFormData>({
        defaultValues: {
            search: '',
        }
    });

    const onSubmit = (data: SearchFormData) => {
        alert(JSON.stringify(data));
    };
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <SearchInput name={'search'} control={control} />
        </form>
    )
}

export const Search: Story = {
    render: () => <RenderSearchInput />
}