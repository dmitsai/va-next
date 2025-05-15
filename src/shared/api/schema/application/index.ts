import z from 'zod';

export const inputApplySchema = z.object({
    vacancyId: z.string().uuid(),
});

export const inputCheckIsApplied = inputApplySchema;

export const inputGetCandidateItem = z.object({
    vacancyId: z.string().uuid(),
    candidateId: z.string().uuid(),
});

export const inputGetCandidateListSchema = z.object({
    vacancyId: z.string().uuid(),
    limit: z.number().min(1).max(100).nullish(),
    cursor: z.string().nullish(),
});
