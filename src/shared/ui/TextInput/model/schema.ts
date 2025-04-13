import z from 'zod';

export const textSchema  = z.string().min(1, { message: "Обязательное поле" });
export const optionalTextSchema  = z.string();