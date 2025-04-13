import z from 'zod';
import { CONSTANTS } from '~/shared/lib/strings';

export const phoneSchema = z.string()
.regex(/^(\s*)?(\+)?([- _():=+]?\d[- _():=+]?){10,14}(\s*)?$/,{message:CONSTANTS.errors.validation.phone.invalid})
.min(1, { message: "Обязательное поле" });