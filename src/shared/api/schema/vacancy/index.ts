import { z } from 'zod';
import { tagsShema } from '../tag';
import { currencySchema } from '../currency';
import { periods, periodsKeys } from '../../model/tags/data';

export const inputGetVacancyItemSchema = z.object({
    vacancyId: z.string().uuid(),
});

export type InputGetVacancyItemSchema = z.infer<
    typeof inputGetVacancyItemSchema
>;

export const inputGetVacancyListSchema = z.object({
    limit: z.number().min(1).max(100).nullish(),
    cursor: z.string().nullish(),
    tags: tagsShema.optional(),
    search: z.string().optional().nullish(),
    salaryFrom: z.string().optional().nullable(),
    period: z.enum(periodsKeys).optional().nullable(),
    currencyName: z.string().optional().nullable(),
});

export type InputGetVacancyListSchema = z.infer<
    typeof inputGetVacancyListSchema
>;

export const inputCreateVacancyItemSchema = z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    salaryFrom: z.string().optional().nullable(),
    salaryTo: z.string().optional().nullable(),
    imgUrl: z.string().url().optional().nullable(),
    currencyId: z.string().uuid(),
    tags: tagsShema.optional(),
});

export type InputCreateVacancyItemSchema = z.infer<
    typeof inputCreateVacancyItemSchema
>;

export const inputUpdateVacancyItemSchema = inputCreateVacancyItemSchema
    .extend({
        vacancy_id: z.string().uuid().min(1),
    })
    .partial();

export type InputUpdateVacancyItemSchema = z.infer<
    typeof inputUpdateVacancyItemSchema
>;

export const inputDeleteVacancyItemSchema = inputGetVacancyItemSchema;

export type InputDeleteVacancyItemSchema = z.infer<
    typeof inputDeleteVacancyItemSchema
>;

export const vacancyResponseSchema = z.object({
    vacancy_id: z.string(),
    title: z.string(),
    company_id: z.string(),
    description: z.string(),
    salaryFrom: z.number().nullable(),
    salaryTo: z.number().nullable(),
    currency: currencySchema,
    imgUrl: z.string().nullable(),
    tags: tagsShema.nullable(),
    company: z.object({
        title: z.string(),
        imgUrl: z.string().nullable(),
    }),
    published_at: z.date(),
});

export type VacancyResponseSchema = z.infer<typeof vacancyResponseSchema>;
