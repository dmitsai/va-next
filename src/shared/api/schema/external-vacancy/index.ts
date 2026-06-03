import { z } from 'zod';

export const inputSyncFromHHSchema = z.object({
    text: z.string().optional(),
    area: z.string().optional(),
    experience: z
        .enum([
            'noExperience',
            'between1And3',
            'between3And6',
            'moreThan6',
        ])
        .optional(),
    employment: z
        .enum(['full', 'part', 'project', 'probation'])
        .optional(),
    schedule: z
        .enum(['fullDay', 'shift', 'flexible', 'remote', 'flyInFlyOut'])
        .optional(),
    professionalRoles: z.array(z.string()).optional(),
    perPage: z.number().min(1).max(100).optional(),
    maxPages: z.number().min(1).max(20).optional(),
});

export type InputSyncFromHHSchema = z.infer<typeof inputSyncFromHHSchema>;
