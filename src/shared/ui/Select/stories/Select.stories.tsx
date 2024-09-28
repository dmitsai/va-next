'use client';

import { useState } from 'react';
import { Select } from '~/shared/ui/Select';

export default {
    component: Select,
    title: "Select"
};

export const ExampleSelect = () => {
    const state = [
        'Vacancy',
        'Internship',
        'Event'
    ];
    const [selected, setSelected] = useState(state[0])
    return (
        <div>
            <Select selected={selected} setSelected={setSelected} state={state} />
        </div>
    )
}