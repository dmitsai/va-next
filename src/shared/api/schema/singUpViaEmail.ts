import { z } from 'zod';

export const signUpCredentialsSchema = z.object({
    provider: z.literal('credentials'),
    data: z.object({
        email: z.string(),
        password: z.string(),
    }),
});

export type SignUpCredentialsSchema = z.infer<typeof signUpCredentialsSchema>;