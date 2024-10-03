
import { type Meta, type StoryObj } from '@storybook/react';
import React from 'react';
import { ReactComponent as IconSettings } from "~/shared/assets/icons/settings-icon.svg";
import { ReactComponent as DeleteIcon } from '~/shared/assets/icons/delete-icon.svg';
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
        {'Sign up / Log in'}
    </Button>,
};

export const Settings: Story = {
    args: {
        className: 'group !p-3 bg-mantle hover:bg-text w-10 h-10 transition-colors',
        buttonView: ButtonView.LARGE,
    },
    render: (args) => <Button {...args} >
        <IconSettings className={'absolute fill-text group-hover:fill-base'} />
    </Button>
};

export const Delete: Story = {
    args: {
        buttonView: ButtonView.LARGE,
        className: 'bg-red hover:bg-text transition-colors'
    },
    render: (args) => <Button {...args}>
        <DeleteIcon className={'w-full h-full'} />
        <span className={'text-base'}>{'Delete'}</span>
    </Button>
}