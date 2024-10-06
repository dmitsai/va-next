'use client';

import React from 'react';
import { useForm } from "react-hook-form";
import { type Meta, type StoryObj } from '@storybook/react';
import EmailInput from '~/shared/ui/EmailInput';
import PasswordInput from '~/shared/ui/PasswordInput';
import SearchInput from '~/shared/ui/SearchInput';
import DefaultInput from './DefaultInput';

const meta: Meta<typeof EmailInput> = {
    component: DefaultInput,
    title: 'Input'
};

export default meta;
type Story = StoryObj<typeof EmailInput>;

const EmailInputWithHook = () => {
    const { handleSubmit, control } = useForm({
        defaultValues: {
            email: '',
        }
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onSubmit = (data: any) => {
        alert(JSON.stringify(data));
    };
    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <EmailInput name={'email'} control={control} />
        </form>
    )
}

export const Email: Story = {
    render: () => <EmailInputWithHook />
}

const PasswordInputWithHook = () => {
    const { handleSubmit, control } = useForm({
        defaultValues: {
            password: '',
        }
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onSubmit = (data: any) => {
        alert(JSON.stringify(data));
    };
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <PasswordInput name={'password'} control={control} />
        </form>
    )
}

export const Password: Story = {
    render: () => <PasswordInputWithHook />
}

const SearchInputWithHook = () => {
    const { handleSubmit, control } = useForm({
        defaultValues: {
            search: '',
        }
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onSubmit = (data: any) => {
        alert(JSON.stringify(data));
    };
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <SearchInput name={'search'} control={control} />
        </form>
    )
}

export const Search: Story = {
    render: () => <SearchInputWithHook />
}