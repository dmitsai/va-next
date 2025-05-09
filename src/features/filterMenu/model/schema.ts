import z from 'zod';
import { CONSTANTS } from '~/shared/lib/strings';

export const filterMenuSchema = z.object({
    salaryFrom: z
        .union([
            z.literal(''), // Разрешаем пустую строку без валидации
            z.string().regex(/^(?:\d+|\d{1,3}(?:\s\d{3})*)$/, {
                message: CONSTANTS.errors.validation.salary.number,
            }),
        ])
        .optional()
        .nullable(),
});

export type FilterMenuSchema = z.infer<typeof filterMenuSchema>;
