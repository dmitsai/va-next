import { CONSTANTS } from '~/shared/lib/strings';

export type Tab = {
    id: 'aboutMe' | 'resume';
    displayValue: string;
};

export const tabs = [
    {
        id: 'aboutMe',
        displayValue: CONSTANTS.candidate.tabs.aboutMe,
    } as Tab,
    {
        id: 'resume',
        displayValue: CONSTANTS.candidate.tabs.resume,
    } as Tab,
];
