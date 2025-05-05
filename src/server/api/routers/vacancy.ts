import {
    inputCreateVacancyItemSchema,
    inputDeleteVacancyItemSchema,
    inputGetVacancyItemSchema,
    inputGetVacancyListSchema,
    inputUpdateVacancyItemSchema,
    VacancyResponseSchema,
} from '~/shared/api/schema/vacancy';
import { Prisma } from '@prisma/client';
import { createTRPCRouter, companyProcedure, publicProcedure } from '../trpc';

const prepareQuery = (query: string | undefined) => {
    if (!query) return [];

    return query
        .toLowerCase()
        .replace(/[^\wа-яё\s-]/gi, '')
        .split(/\s+/)
        .filter((term) => term.length > 2);
};
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
                    imgUrl: input.imgUrl,
                    currency: {
                        connect: {
                            currency_id: input.currencyId,
                        },
                    },
                    tags: input.tags,
                },
                include: {
                    currency: true,
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
                    currency: input.currencyId
                        ? {
                              connect: { currency_id: input.currencyId },
                          }
                        : undefined,
                    imgUrl: input.imgUrl,
                },
                include: {
                    currency: true,
                    company: true,
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
                include: {
                    company: true,
                    currency: true,
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
                    currency: true,
                    company: true,
                },
            });
            return vacancy as VacancyResponseSchema;
        }),

    infinityVacancy: publicProcedure
        .input(inputGetVacancyListSchema)
        .query(async ({ ctx, input }) => {
            const limit = input.limit ?? 50;
            const { cursor, tags } = input;

            // Явно указываем тип для условий WHERE
            const whereConditions: Prisma.VacancyWhereInput[] = [];

            // Поиск по тексту
            if (input.search) {
                const terms = prepareQuery(input.search);

                if (terms.length > 0) {
                    const searchConditions: Prisma.VacancyWhereInput[] =
                        terms.map((term) => ({
                            OR: [
                                {
                                    title: {
                                        contains: term,
                                        mode: 'insensitive',
                                    },
                                },
                                {
                                    description: {
                                        contains: term,
                                        mode: 'insensitive',
                                    },
                                },
                            ],
                        }));
                    whereConditions.push(...searchConditions);
                }
            }

            // Фильтрация по тегам
            if (tags?.workSchedule) {
                whereConditions.push({
                    tags: {
                        path: ['workSchedule'],
                        array_contains: tags.workSchedule,
                    },
                });
            }
            if (tags?.employmentTypes) {
                whereConditions.push({
                    tags: {
                        path: ['employmentTypes'],
                        array_contains: tags.employmentTypes,
                    },
                });
            }
            if (tags?.experience) {
                whereConditions.push({
                    tags: {
                        path: ['experience'],
                        array_contains: tags.experience,
                    },
                });
            }
            if (tags?.education) {
                whereConditions.push({
                    tags: {
                        path: ['education'],
                        array_contains: tags.education,
                    },
                });
            }

            // Собираем финальное условие WHERE
            const where: Prisma.VacancyWhereInput =
                whereConditions.length > 0 ? { AND: whereConditions } : {};

            const vacancyList = await ctx.prisma.vacancy.findMany({
                where,
                include: {
                    currency: true,
                    company: true,
                },
                take: limit + 1,
                cursor: cursor ? { vacancy_id: cursor } : undefined,
                orderBy: {
                    published_at: 'desc',
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
