import z from 'zod';

export const currencySchema = z.object({
    currency_id: z.string(),
    title: z.string(),
    char: z.string(),
    code: z.string().nullable().optional(),
});

export type CurrencySchema = z.infer<typeof currencySchema>;
