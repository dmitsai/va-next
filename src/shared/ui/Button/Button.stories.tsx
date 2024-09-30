
import { type Meta, type StoryObj } from '@storybook/react';
import React from 'react';
import IconSettings from "~/shared/assets/icons/settings-icon.svg?url";
import IconSettingLight from "~/shared/assets/icons/settings-light-icon.svg?url";
import DeleteIcon from '~/shared/assets/icons/delete-icon.svg?url';
import Image from "next/image";
import { Button, ButtonView } from './Button';

const meta: Meta<typeof Button> = {
    component: Button,
    title: 'Button',
    args: {
        buttonView: ButtonView.SMALL,
        children: 'Click me',
        className: '',
    },
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Enter: Story = {
    args: {
        className: 'text-base bg-mauve hover:bg-text transition-colors',
    },
    render: (args) => <Button {...args}>
        <p>{'Sign up / Log in'}</p>
    </Button>,
};

export const Settings: Story = {
    args: {
        className: 'group !p-3 bg-mantle hover:bg-text w-10 h-10 transition-colors',
        buttonView: ButtonView.LARGE,
    },
    render: (args) => <Button {...args} >
        <Image
            src={IconSettings as string}
            alt="Sonner icon"
            className={'absolute w-4 h-4 visible group-hover:invisible'}
        />
        <Image
            src={IconSettingLight as string}
            className={'absolute w-4 h-4 invisible group-hover:visible'}
            alt="Sonner icon"
        />
    </Button>
};

export const Delete: Story = {
    args: {
        buttonView: ButtonView.LARGE,
        className: 'bg-red hover:bg-text transition-colors'
    },
    render: (args) => <Button {...args}>
        <Image
            src={DeleteIcon as string}
            alt="Sonner icon"
            className={'w-full h-full'}
        />
        <span className={'text-base'}>{'Delete'}</span>
    </Button>
}