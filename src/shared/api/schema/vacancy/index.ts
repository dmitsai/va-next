import { z } from "zod";
import { tagResponseSchema } from "../tag";

export const inputGetVacancyItemSchema = z.object({
  vacancyId: z.string().uuid(),
});

export type InputGetVacancyItemSchema = z.infer<
  typeof inputGetVacancyItemSchema
>;

export const inputGetVacancyListSchema = z.object({
  limit: z.number().min(1).max(100).nullish(),
  cursor: z.string().nullish(),
  tagIds: z.array(z.string()).nullish(),
});

export type InputGetVacancyListSchema = z.infer<
  typeof inputGetVacancyListSchema
>;

export const inputCreateVacancyItemSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  salaryFrom: z.string().optional().nullable(),
  salaryTo: z.string().optional().nullable(),
  lan: z.string().optional().nullable(),
  lng: z.string().optional().nullable(),
  imgUrl: z.string().url().optional().nullable(),
  tagIds: z.array(z.string().uuid()).optional().nullable(),
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
  salaryFrom: z.string().nullable(),
  salaryTo: z.string().nullable(),
  lan: z.string().nullable(),
  lng: z.string().nullable(),
  imgUrl: z.string().nullable(),
  tags: z.array(tagResponseSchema),
  company: z.object({
    title: z.string(),
    imgUrl: z.string().nullable(),
  }),
});

export type VacancyResponseSchema = z.infer<typeof vacancyResponseSchema>;
