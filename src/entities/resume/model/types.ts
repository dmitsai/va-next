import { Prisma } from '@prisma/client';

export type ResumeWithRelations = Prisma.ResumeGetPayload<{
    include: { sections: true; analysis: true };
}>;

export const STATUS_LABEL: Record<string, string> = {
    DRAFT: 'Черновик',
    PUBLISHED: 'Опубликовано',
    ARCHIVED: 'Архив',
};

export const STATUS_CLASS: Record<string, string> = {
    DRAFT: 'bg-overlay/30 text-sub',
    PUBLISHED: 'bg-teal/10 text-teal',
    ARCHIVED: 'bg-surface text-sub-secondary',
};
