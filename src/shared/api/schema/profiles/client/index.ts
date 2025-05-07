import { z } from "zod";
import { employmentTypes, workSchedule } from "~/shared/api/model/preferances/data";

const preferencesSchema = z.object({
  workSchedule: z.array(z.nativeEnum(workSchedule)),
  employmentTypes: z.array(z.nativeEnum(employmentTypes)),
  salary: z.number().nullable(),
})

export const inputUpdateClientProfileSchema = z.object({
  user_id: z.string().uuid(),
  name: z.string().optional(),
  surname: z.string().optional(),
  patronymic: z.string().nullable().optional(),
  imgUrl: z.string().url().nullable().optional(),
  telegram: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  about_me: z.string().nullable().optional(),
  preferences: preferencesSchema.partial().optional(),
  resume: z.string().nullable().optional(),
});

export type InputUpdateClientProfileSchema = z.infer<
    typeof inputUpdateClientProfileSchema
>;

export const clientProfileResponseSchema = z.object({
    client_profile_id: z.string(),
    user_id: z.string(),
    name: z.string(),
    surname: z.string(),
    patronymic: z.string().nullable(),
    imgUrl: z.string().nullable(),
    telegram: z.string(),
    phone: z.string(),
    email: z.string(),
    about_me: z.string().nullable(),
    preferences: preferencesSchema.nullable(),
    resume: z.string().nullable(),
    favoriteVacancies: z.array(
      z.object({
        vacancy_id: z.string(),
        title: z.string(),
      })
    ).nullable(),
  });
  
  export type ClientProfileResponseSchema = z.infer<
    typeof clientProfileResponseSchema
>;