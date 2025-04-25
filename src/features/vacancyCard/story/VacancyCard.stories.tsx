'use client';

import { Meta, StoryObj } from "@storybook/react";
import { VacancyCard } from "../ui/VacancyCard";

const meta = {
    component: VacancyCard,
    title: 'Vacancy Card',
    args: {
        title: 'UI/UX designer (Junior/Middle)',
        isFavorited: false,
        tags: [{ label: ' Moscow', color: 'bg-peach' }, { label: 'Remotely', color: 'bg-green' }, { label: 'Exp. 1-3 years', color: 'bg-blue' }],
        description: 'Sber is a leading financial institution in Russia, committed to innovation and enhancing customer experiences through technology. We are looking for a talented UI/UX Designer to join our dynamic team and contribute to the design of user-centric digital products.',
        company: {
            imgUrl: undefined,
            title: "T-Bank"
        },
        salary: 65000,
    },
    parameters: {
        layout: 'fullscreen',
    }
} satisfies Meta<typeof VacancyCard>

export default meta;

type Story = StoryObj<typeof meta>;

export const Example: Story = {
    render: (args) => <div className={'flex flex-col justify-center items-center w-screen h-screen'}><VacancyCard {...args} /></div>
}