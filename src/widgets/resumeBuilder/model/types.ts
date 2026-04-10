import type { Prisma } from '@prisma/client';

export type ResumeWithRelations = Prisma.ResumeGetPayload<{
    include: { sections: true; analysis: true };
}>;

export type BasicSection = {
    name: string;
    surname: string;
    desired_position: string;
    photo_url?: string;
};

export type ContactsSection = {
    email: string;
    phone?: string;
    city?: string;
    telegram?: string;
    linkedin?: string;
    github?: string;
};

export type AboutSection = { text: string };

export type ExperienceItem = {
    company: string;
    position: string;
    period_from: string;
    period_to?: string;
    is_current: boolean;
    description: string;
};
export type ExperienceSection = { items: ExperienceItem[] };

export type EducationItem = {
    institution: string;
    degree: string;
    field: string;
    year_from: string;
    year_to?: string;
};
export type EducationSection = { items: EducationItem[] };

export type SkillsSection = { hard: string[]; soft: string[] };

export type PortfolioItem = { title: string; url: string; description?: string };
export type PortfolioSection = { items: PortfolioItem[] };

export type ResumeFormState = {
    BASIC: BasicSection;
    CONTACTS: ContactsSection;
    ABOUT: AboutSection;
    EXPERIENCE: ExperienceSection;
    EDUCATION: EducationSection;
    SKILLS: SkillsSection;
    PORTFOLIO: PortfolioSection;
};

export const STEP_DEFS = [
    { id: 1, tabId: 'basic', label: 'Основное', section: 'BASIC' as const },
    { id: 2, tabId: 'contacts', label: 'Контакты', section: 'CONTACTS' as const },
    { id: 3, tabId: 'about', label: 'О себе', section: 'ABOUT' as const },
    { id: 4, tabId: 'experience', label: 'Опыт работы', section: 'EXPERIENCE' as const },
    { id: 5, tabId: 'education', label: 'Образование', section: 'EDUCATION' as const },
    { id: 6, tabId: 'skills', label: 'Навыки', section: 'SKILLS' as const },
    { id: 7, tabId: 'portfolio', label: 'Портфолио', section: 'PORTFOLIO' as const },
    { id: 8, tabId: 'final', label: 'Завершить', section: null },
] as const;

export const STEP_TOTAL = STEP_DEFS.length;

export const TAB_ID_TO_STEP = Object.fromEntries(
    STEP_DEFS.map((s) => [s.tabId, s.id])
) as Record<string, number>;

export const STEP_TO_TAB_ID = Object.fromEntries(
    STEP_DEFS.map((s) => [s.id, s.tabId])
) as Record<number, string>;

export type StepErrors = Partial<Record<string, string>>;

export function validateStep(step: number, state: ResumeFormState): StepErrors {
    const errors: StepErrors = {};
    if (step === 1) {
        if (!state.BASIC.name.trim() && !state.BASIC.surname.trim()) {
            errors.name = 'Укажите имя или фамилию';
        }
        if (!state.BASIC.desired_position.trim()) {
            errors.desired_position = 'Укажите желаемую должность';
        }
    }
    if (step === 2) {
        if (!state.CONTACTS.email.trim()) {
            errors.email = 'Email обязателен';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.CONTACTS.email)) {
            errors.email = 'Неверный формат email';
        }
    }
    return errors;
}

export const emptyState: ResumeFormState = {
    BASIC: { name: '', surname: '', desired_position: '', photo_url: '' },
    CONTACTS: {
        email: '',
        phone: '',
        city: '',
        telegram: '',
        linkedin: '',
        github: '',
    },
    ABOUT: { text: '' },
    EXPERIENCE: {
        items: [
            {
                company: '',
                position: '',
                period_from: '',
                period_to: '',
                is_current: false,
                description: '',
            },
        ],
    },
    EDUCATION: {
        items: [
            {
                institution: '',
                degree: '',
                field: '',
                year_from: '',
                year_to: '',
            },
        ],
    },
    SKILLS: { hard: [], soft: [] },
    PORTFOLIO: { items: [{ title: '', url: '', description: '' }] },
};
