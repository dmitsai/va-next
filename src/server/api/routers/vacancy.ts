import {
  inputCreateVacancyItemSchema,
  inputDeleteVacancyItemSchema,
  inputGetVacancyItemSchema,
  inputGetVacancyListSchema,
  inputUpdateVacancyItemSchema,
  VacancyResponseSchema,
} from '~/shared/api/schema/vacancy';
import { createTRPCRouter, companyProcedure, publicProcedure } from '../trpc';

export const vacancyRouter = createTRPCRouter({
  createVacancy: companyProcedure
    .input(inputCreateVacancyItemSchema)
    .mutation(async ({ ctx, input }) => {
      const companyUserId = ctx.session.user.id;
      const companyProfile = await ctx.prisma.companyProfile.findUnique({
        where: { user_id: companyUserId },
      });

      if (!companyProfile) {
        throw new Error('Company profile not found');
      }
      const newVacancy = await ctx.prisma.vacancy.create({
        data: {
          title: input.title,
          company: {
            connect: {
              company_id: companyProfile.company_id,
            },
          },
          salaryFrom: input.salaryFrom,
          salaryTo: input.salaryTo,
          description: input.description,
          lan: input.lan,
          lng: input.lng,
          imgUrl: input.imgUrl,
          tags: {
            connect: input.tagIds?.map((id) => ({ tag_id: id })) ?? [],
          },
        },
        include: {
          tags: true,
          company: true,
        },
      });

      return newVacancy as VacancyResponseSchema;
    }),
  updateVacancy: companyProcedure
    .input(inputUpdateVacancyItemSchema)
    .mutation(async ({ ctx, input }) => {
      const companyUserId = ctx.session.user.id;

      const companyProfile = await ctx.prisma.companyProfile.findUnique({
        where: { user_id: companyUserId },
      });

      if (!companyProfile) {
        throw new Error('Company profile not found');
      }

      const updatedVacancy = await ctx.prisma.vacancy.update({
        where: {
          vacancy_id: input.vacancy_id,
          company_id: companyProfile.company_id,
        },
        data: {
          title: input.title,
          salaryFrom: input.salaryFrom,
          salaryTo: input.salaryTo,
          description: input.description,
          lan: input.lan,
          lng: input.lng,
          imgUrl: input.imgUrl,
        },
        include: {
          tags: true,
        },
      });

      return updatedVacancy as VacancyResponseSchema;
    }),

  deleteVacancy: companyProcedure
    .input(inputDeleteVacancyItemSchema)
    .mutation(async ({ ctx, input }) => {
      const companyUserId = ctx.session.user.id;

      const companyProfile = await ctx.prisma.companyProfile.findUnique({
        where: { user_id: companyUserId },
      });

      if (!companyProfile) {
        throw new Error('Company profile not found');
      }
      const deletedVacancy = await ctx.prisma.vacancy.delete({
        where: {
          vacancy_id: input.vacancyId,
          company_id: companyProfile.company_id,
        },
      });

      return deletedVacancy as VacancyResponseSchema;
    }),

  getVacancyItem: publicProcedure
    .input(inputGetVacancyItemSchema)
    .query(async ({ ctx, input }) => {
      const vacancy = await ctx.prisma.vacancy.findUnique({
        where: { vacancy_id: input.vacancyId },
        include: {
          tags: true,
          company: true,
        },
      });
      return vacancy as VacancyResponseSchema;
    }),

  infinityVacancy: publicProcedure
    .input(inputGetVacancyListSchema)
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 50;
      const { cursor, tagIds } = input;

      const vacancyList = await ctx.prisma.vacancy.findMany({
        include: {
          tags: true,
          company: true,
        },
        take: limit + 1,
        cursor: cursor ? { vacancy_id: cursor } : undefined,
        orderBy: {
          vacancy_id: 'asc',
        },
        where: {
          ...(tagIds && tagIds.length > 0
            ? {
                tags: {
                  some: {
                    tag_id: {
                      in: tagIds,
                    },
                  },
                },
              }
            : {}),
        },
      });

      let nextCursor: typeof cursor | undefined;

      if (vacancyList.length > limit) {
        const nextVacancy = vacancyList.pop();
        nextCursor = nextVacancy!.vacancy_id;
      }
      return {
        vacancyList: vacancyList as VacancyResponseSchema[],
        nextCursor,
      };
    }),
});
