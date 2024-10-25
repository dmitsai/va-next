import z from 'zod';
import { CONSTANTS } from '~/shared/lib/strings';

export const passwordSchema = z.string()
.min(8,{message: CONSTANTS.errors.validation.password.min})
.regex(/[a-z]/,{message: CONSTANTS.errors.validation.password.lower})
.regex(/[A-Z]/,{message: CONSTANTS.errors.validation.password.upper})
.regex(/[0-9]/,{message: CONSTANTS.errors.validation.password.number})
.regex(/[^a-zA-Z0-9]/, {message: CONSTANTS.errors.validation.password.specialCharacter});

