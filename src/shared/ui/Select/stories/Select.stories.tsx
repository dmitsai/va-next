'use client';

import React, { useState } from 'react';

import { Meta, StoryObj } from '@storybook/react';
import { Select } from '../ui/Select';

const meta: Meta<typeof Select> = {
    component: Select,
    title: 'Select'
};

export default meta;
type Story = StoryObj<typeof Select>;

// const SelectWithHook = () => {
//     const state = [
//         'Vacancy',
//         'Internship',
//         'Event'
//     ]
//     const [selected, setSelected] = useState(state[0])
//     return (<Select />)
// }

// export const ExampleSelect: Story = {
//     render: () => <SelectWithHook />
// }

export const Test = () => <Select />
export const Test2 = () => <div/>