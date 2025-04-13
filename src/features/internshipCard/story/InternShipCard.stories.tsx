'use client';

import { Meta, StoryObj } from "@storybook/react";
import { InternshipCard } from "../ui/InternshipCard";

const meta = {
    component: InternshipCard,
    title: 'Internship Card',
    args: {
        wrappeclassName: 'bg-sapphire'
        title: 'UI/UX designer',
        isFavorited: false,
        tags: ['Paid', 'From 20 hours a week', 'In the office or remotely'],
        description: 'Sber is a leading financial institution in Russia, committed to innovation and enhancing customer experiences through technology. We are looking for a talented UI/UX Designer to join our dynamic team and contribute to the design of user-centric digital products.',
        company: {
            imgUrl: undefined,
            title: "T-Bank"
        }
    },
    parameters: {
        layout: 'fullscreen',
    }
} satisfies Meta<typeof InternshipCard>

export default meta;

type Story = StoryObj<typeof meta>;

export const Example: Story = {
    render: (args) => <div className={'flex flex-col justify-center items-center w-screen h-screen'}><InternshipCard {...args} /></div>
}