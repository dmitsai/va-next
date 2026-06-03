import z from 'zod';

export const inputApplySchema = z.object({
    vacancyId: z.string().uuid(),
    resumeId: z.string().uuid().optional(),
});

export const inputCheckIsApplied = z.object({
    vacancyId: z.string().uuid(),
});

export const inputDeleteApplicationSchema = z.object({
    applicationId: z.string().uuid(),
});

export const inputToggleFavoriteSchema = z.object({
    vacancyId: z.string().uuid(),
});

export const inputCheckIsFavoritedSchema = z.object({
    vacancyId: z.string().uuid(),
});

export const inputGetMyApplicationsSchema = z.object({
    limit: z.number().min(1).max(100).nullish(),
    cursor: z.string().nullish(),
});

export const inputGetCandidateItem = z.object({
    vacancyId: z.string().uuid(),
    candidateId: z.string().uuid(),
});

export const inputGetCandidateListSchema = z.object({
    vacancyId: z.string().uuid(),
    limit: z.number().min(1).max(100).nullish(),
    cursor: z.string().nullish(),
});
