'use client';

import { Meta, StoryObj } from "@storybook/react";
import { EventCard } from "../ui/EventCard";

const meta = {
    component: EventCard,
    title: 'Event Card',
    args: {
        title: 'IT picnic',
        date: '1713465600',
        region: 'Москва',
    },
    parameters: {
        layout: 'fullscreen',
    }
} satisfies Meta<typeof EventCard>

export default meta;

type Story = StoryObj<typeof meta>;

export const Example: Story = {
    render: (args) => <div className={'flex flex-col justify-center items-center w-screen h-screen'}><EventCard {...args} /></div>
}