import { z } from 'zod';
import { availableFilters as tags } from '~/entities/vacancies/model/data';
import { CONSTANTS } from '~/shared/lib/strings';

const baseSchema = z.object({
    title: z.string().min(1, CONSTANTS.errors.validation.vacancy.title),
    description: z
        .string()
        .min(1, CONSTANTS.errors.validation.vacancy.description.required)
        .min(50, CONSTANTS.errors.validation.vacancy.description.min),
    salaryFrom: z
        .union([
            z.literal(''),
            z.string().regex(/^(?:\d+|\d{1,3}(?:\s\d{3})*)$/, {
                message: CONSTANTS.errors.validation.salary.number,
            }),
        ])
        .optional()
        .nullable(),
    salaryTo: z
        .union([
            z.literal(''),
            z.string().regex(/^(?:\d+|\d{1,3}(?:\s\d{3})*)$/, {
                message: CONSTANTS.errors.validation.salary.number,
            }),
        ])
        .optional()
        .nullable(),
});

const dynamicFilterFields = tags.reduce(
    (acc, tagGroup) => {
        tagGroup.value.forEach((tag) => {
            acc[tag.name] = z.boolean().optional();
        });
        return acc;
    },
    {} as Record<string, z.ZodOptional<z.ZodBoolean>>
);

export const vacancyFormSchema = baseSchema.extend(dynamicFilterFields);
