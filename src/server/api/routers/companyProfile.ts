import {
    CompanyProfileResponseSchema,
    inputUpdateCompanyProfileSchema,
  } from "~/shared/api/schema/profiles/company";
  import { companyProcedure, createTRPCRouter } from "../trpc";
  
export const companyProfileRouter = createTRPCRouter({
    getProfile: companyProcedure
    .query(async ({ ctx }) => {
        const profile = await ctx.prisma.companyProfile.findUnique({
            where: { user_id: ctx.session.user.id },
            include:{
                user:{
                    select:{
                        email:true,
                    },
                },
            },
        });
        return profile as CompanyProfileResponseSchema;
      }),
    
    updateProfile: companyProcedure
      .input(inputUpdateCompanyProfileSchema)
      .mutation(async ({ input, ctx }) => {

        const updateData ={
           title: input.title,
           phone: input.phone,
           description: input.description,
           email: input.email,
           website: input.website,
        }
        const updateProfile = await ctx.prisma.companyProfile.update({
            where: { user_id: ctx.session.user.id },
            data: updateData,
            include:{
                user:{
                    select:{
                        email:true,
                    },
                },
            },
        })
        return updateProfile as CompanyProfileResponseSchema;
      }),
  });