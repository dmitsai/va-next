import { z } from "zod";

export const inputBaseTagSchema = z.object({
  vacancy_id: z.string().uuid(),
  tag_id: z.string().uuid(),
});
export type InputBaseTagSchema = z.infer<typeof inputBaseTagSchema>;

export const inputAddTagSchema = inputBaseTagSchema;
export type InputAddTagSchema = z.infer<typeof inputAddTagSchema>;

export const inputDeleteTagSchema = inputBaseTagSchema;
export type InputDeleteTagSchema = z.infer<typeof inputDeleteTagSchema>;

export const tagResponseSchema = z.object({
  tag_id: z.string(),
  title: z.string(),
  localTitle: z.string(),
});
export type TagResponseSchema = z.infer<typeof tagResponseSchema>;
