import { z } from "zod";

export const inputUpdateCompanyProfileSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  website: z.string().nullable().optional(),
});

export type InputUpdateCompanyProfileSchema = z.infer<
    typeof inputUpdateCompanyProfileSchema
>;

export const companyProfileResponseSchema = z.object({
    company_id: z.string(),
    title: z.string(),
    phone: z.string(),
    email: z.string(),
    imgUrl: z.string().nullable(),
    pdfUrl: z.string().nullable(),
    description: z.string().nullable(),
    website: z.string().nullable(),
    user_id: z.string(),
  });
  
  export type CompanyProfileResponseSchema = z.infer<
    typeof companyProfileResponseSchema
>;