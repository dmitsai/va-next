import { type ResumeSection } from '@prisma/client';

const ALL_SECTION_TYPES = [
    'BASIC',
    'CONTACTS',
    'ABOUT',
    'EXPERIENCE',
    'EDUCATION',
    'SKILLS',
    'PORTFOLIO',
] as const;

function isSectionFilled(type: string, content: unknown): boolean {
    if (!content || typeof content !== 'object') return false;
    const c = content as Record<string, unknown>;
    switch (type) {
        case 'BASIC':
            return !!(c.name && c.surname);
        case 'CONTACTS':
            return !!c.email;
        case 'ABOUT':
            return typeof c.text === 'string' && c.text.trim().length > 0;
        case 'EXPERIENCE':
        case 'EDUCATION':
        case 'PORTFOLIO':
            return Array.isArray(c.items) && c.items.length > 0;
        case 'SKILLS':
            return (
                (Array.isArray(c.hard) && c.hard.length > 0) ||
                (Array.isArray(c.soft) && c.soft.length > 0)
            );
        default:
            return false;
    }
}

export const computeResumeScore = (sections: ResumeSection[]): number => {
    const map = new Map(sections.map((s) => [s.type as string, s.content]));
    const filled = ALL_SECTION_TYPES.filter((t) =>
        isSectionFilled(t, map.get(t) ?? null)
    ).length;
    const pct = (types: readonly string[]) =>
        Math.round(
            (ALL_SECTION_TYPES.filter(
                (t) => types.includes(t) && isSectionFilled(t, map.get(t) ?? null)
            ).length /
                types.length) *
                100
        );
    const scoreCompleteness = Math.round((filled / ALL_SECTION_TYPES.length) * 100);
    const scoreStructure = pct(['BASIC', 'CONTACTS', 'ABOUT']);
    const scoreSkills = pct(['SKILLS', 'EXPERIENCE']);
    const scoreKeywords = pct(['ABOUT', 'EXPERIENCE', 'SKILLS']);
    return Math.round(
        (scoreCompleteness + scoreStructure + scoreSkills + scoreKeywords) / 4
    );
};

export const daysAgo = (date: Date | string): string => {
    const diff = Math.floor(
        (Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24)
    );
    if (diff === 0) return 'сегодня';
    if (diff === 1) return '1 день назад';
    if (diff < 5) return `${diff} дня назад`;
    return `${diff} дней назад`;
};

export const getSectionWord = (count: number): string => {
    if (count === 1) return 'секция';
    if (count < 5) return 'секции';
    return 'секций';
};

export const getScoreClassName = (score: number): string => {
    const baseClassName = 'text-base border ';
    if (score < 50) return `${baseClassName} text-red border-red/25 bg-red/15`;
    if (score < 70)
        return `${baseClassName} text-yellow border-yellow/25 bg-yellow/15`;
    if (score < 90) {
        return `${baseClassName} text-score-success-text border-score-success-border/25 bg-score-success-bg/15`;
    }
    return `${baseClassName} text-blue border-blue/25 bg-blue/15`;
};
