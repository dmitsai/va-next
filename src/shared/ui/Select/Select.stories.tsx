'use client';

import React, { useState } from 'react';

import { type Meta, type StoryObj } from '@storybook/react';
import { Select } from './Select';

const meta: Meta<typeof Select> = {
    component: Select,
    title: 'Select'
};

export default meta;
type Story = StoryObj<typeof Select>;

const RenderSelect = () => {
    const state = [
        'Vacancy',
        'Internship',
        'Event'
    ]
    const [selected, setSelected] = useState(state[0])
    return (<Select state={state} selected={selected} setSelected={setSelected} />)
}

export const ExampleSelect: Story = {
    render: () => <RenderSelect />
}
