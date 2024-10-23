import z from 'zod';
import { CONSTANTS } from '~/shared/lib/strings';

export const emailSchema = z.string().email({message: CONSTANTS.errors.validation.email.invalid});
