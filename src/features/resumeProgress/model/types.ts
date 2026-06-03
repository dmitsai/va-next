export type SectionStatusType = 'completed' | 'not_started';

export type ResumeTab = {
    id: string;
    title: string;
    status: SectionStatusType;
    number: number;
};
