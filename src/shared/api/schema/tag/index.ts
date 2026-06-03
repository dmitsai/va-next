import { z } from 'zod';
import {
    education,
    employmentTypes,
    experience,
    workSchedule,
} from '../../model/tags/data';

export const tagsShema = z.object({
    workSchedule: z.array(z.nativeEnum(workSchedule)).optional(),
    employmentTypes: z.array(z.nativeEnum(employmentTypes)).optional(),
    experience: z.array(z.nativeEnum(experience)).optional(),
    education: z.array(z.nativeEnum(education)).optional(),
});

export type TagsSchema = z.infer<typeof tagsShema>;
