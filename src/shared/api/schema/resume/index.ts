import { z } from 'zod';
import { ResumeSectionType } from '@prisma/client';

export const inputGetResumeItemSchema = z.object({
    resume_id: z.string().uuid(),
});

export type InputGetResumeItemSchema = z.infer<typeof inputGetResumeItemSchema>;

export const inputCreateResumeSchema = z.object({
    title: z.string().min(1),
    desired_position: z.string().optional().nullable(),
});

export type InputCreateResumeSchema = z.infer<typeof inputCreateResumeSchema>;

export const inputUpdateSectionSchema = z.object({
    resume_id: z.string().uuid(),
    type: z.nativeEnum(ResumeSectionType),
    content: z.record(z.unknown()),
    is_visible: z.boolean().optional(),
    order_index: z.number().int().optional(),
});

export type InputUpdateSectionSchema = z.infer<typeof inputUpdateSectionSchema>;

export const inputPublishResumeSchema = inputGetResumeItemSchema;
export type InputPublishResumeSchema = z.infer<typeof inputPublishResumeSchema>;

export const inputArchiveResumeSchema = inputGetResumeItemSchema;
export type InputArchiveResumeSchema = z.infer<typeof inputArchiveResumeSchema>;

export const inputGetAnalysisSchema = inputGetResumeItemSchema;
export type InputGetAnalysisSchema = z.infer<typeof inputGetAnalysisSchema>;

export const inputExportPdfSchema = inputGetResumeItemSchema;
export type InputExportPdfSchema = z.infer<typeof inputExportPdfSchema>;

export const inputImportFromPdfSchema = z.object({
    fileBase64: z.string().min(1),
});
export type InputImportFromPdfSchema = z.infer<typeof inputImportFromPdfSchema>;
