import z from 'zod';

export const currencySchema = z.object({
    currency_id: z.string().uuid(),
    title: z.string(),
    char: z.string(),
});

export type CurrencySchema = z.infer<typeof currencySchema>;
