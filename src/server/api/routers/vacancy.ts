import {
    inputCreateVacancyItemSchema,
    inputDeleteVacancyItemSchema,
    inputGetVacancyItemSchema,
    inputGetVacancyListSchema,
    inputUpdateVacancyItemSchema,
} from '~/shared/api/schema/vacancy';
import type { TagsSchema } from '~/shared/api/schema/tag';
import { Prisma } from '@prisma/client';
import { createTRPCRouter, companyProcedure, publicProcedure } from '../trpc';

const VACANCY_INCLUDE = {
    currency: true,
    company: true,
    platform: true,
    location: true,
} as const;

type VacancyWithRelations = Prisma.VacancyGetPayload<{
    include: typeof VACANCY_INCLUDE;
}>;

function normalizeVacancy(v: VacancyWithRelations) {
    return {
        ...v,
        tags: (v.tags as TagsSchema | null) ?? null,
        company: v.company ?? {
            title: v.companyName ?? '',
            imgUrl: v.companyLogoUrl ?? null,
        },
        currency: v.currency ?? {
            currency_id: '',
            title: '',
            char: '',
        },
    };
}

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
            const companyProfile =
                await ctx.prisma.companyProfile.findUnique({
                    where: { user_id: companyUserId },
                });

            if (!companyProfile) {
                throw new Error('Company profile not found');
            }

            const currency = await ctx.prisma.currency.findFirst({
                where: input.currencyName ? { title: input.currencyName } : {},
            });

            if (!currency) {
                throw new Error('Currency not found');
            }
            const localPlatform =
                await ctx.prisma.platform.findUnique({
                    where: { name: 'local' },
                });

            if (!localPlatform) {
                throw new Error(
                    'Platform "local" not found. Run seed first.',
                );
            }
            const salaryFrom = input.salaryFrom
                ? parseInt(input.salaryFrom, 10)
                : null;
            const salaryTo = input.salaryTo
                ? parseInt(input.salaryTo, 10)
                : null;

            const newVacancy = await ctx.prisma.vacancy.create({
                data: {
                    title: input.title,
                    description: input.description,
                    platform_id: localPlatform.platform_id,
                    company_id: companyProfile.company_id,
                    companyName: companyProfile.title,
                    companyLogoUrl: companyProfile.imgUrl,
                    salaryFrom,
                    salaryTo,
                    imgUrl: input.imgUrl,
                    currency_id: currency.currency_id,
                    tags: input.tags,
                },
                include: VACANCY_INCLUDE,
            });

            return normalizeVacancy(newVacancy);
        }),

    updateVacancy: companyProcedure
        .input(inputUpdateVacancyItemSchema)
        .mutation(async ({ ctx, input }) => {
            const companyUserId = ctx.session.user.id;

            const companyProfile =
                await ctx.prisma.companyProfile.findUnique({
                    where: { user_id: companyUserId },
                });

            if (!companyProfile) {
                throw new Error('Company profile not found');
            }
            const currency = await ctx.prisma.currency.findFirst({
                where: input.currencyName ? { title: input.currencyName } : {},
            });

            if (!currency) {
                throw new Error('Currency not found');
            }

            const salaryFrom = input.salaryFrom
                ? parseInt(input.salaryFrom, 10)
                : null;
            const salaryTo = input.salaryTo
                ? parseInt(input.salaryTo, 10)
                : null;

            const updatedVacancy = await ctx.prisma.vacancy.update({
                where: {
                    vacancy_id: input.vacancy_id,
                    company_id: companyProfile.company_id,
                },
                data: {
                    title: input.title,
                    salaryFrom,
                    salaryTo,
                    description: input.description,
                    currency_id: currency?.currency_id,
                    imgUrl: input.imgUrl,
                },
                include: VACANCY_INCLUDE,
            });

            return normalizeVacancy(updatedVacancy);
        }),

    deleteVacancy: companyProcedure
        .input(inputDeleteVacancyItemSchema)
        .mutation(async ({ ctx, input }) => {
            const companyUserId = ctx.session.user.id;

            const companyProfile =
                await ctx.prisma.companyProfile.findUnique({
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
                include: VACANCY_INCLUDE,
            });

            return normalizeVacancy(deletedVacancy);
        }),

    getVacancyItem: publicProcedure
        .input(inputGetVacancyItemSchema)
        .query(async ({ ctx, input }) => {
            const vacancy = await ctx.prisma.vacancy.findUnique({
                where: { vacancy_id: input.vacancyId },
                include: VACANCY_INCLUDE,
            });

            if (!vacancy) return null;
            return normalizeVacancy(vacancy);
        }),

    infinityVacancy: publicProcedure
        .input(inputGetVacancyListSchema)
        .query(async ({ ctx, input }) => {
            const limit = input.limit ?? 50;
            const {
                cursor,
                tags,
                period,
                salaryFrom,
                currencyName,
                companyId,
                platformName,
            } = input;

            const whereConditions: Prisma.VacancyWhereInput[] = [];

            if (companyId) {
                whereConditions.push({
                    company_id: companyId,
                });
            }
            if (platformName) {
                whereConditions.push({
                    platform: { name: platformName },
                });
            }

            if (currencyName) {
                whereConditions.push({
                    currency: { title: currencyName },
                });
            }

            if (salaryFrom) {
                const numberSalaryFrom = parseInt(salaryFrom, 10);

                whereConditions.push({
                    salaryFrom: {
                        gte: numberSalaryFrom,
                    },
                });
            }

            if (period && period !== 'all') {
                const now = new Date();
                let startDate: Date = now;

                switch (period) {
                    case 'day':
                        startDate = new Date(
                            now.setDate(now.getDate() - 1),
                        );
                        break;
                    case 'month':
                        startDate = new Date(
                            now.setMonth(now.getMonth() - 1),
                        );
                        break;
                    case 'threeMonths':
                        startDate = new Date(
                            now.setMonth(now.getMonth() - 3),
                        );
                        break;
                    default:
                        break;
                }

                whereConditions.push({
                    published_at: {
                        gte: startDate,
                    },
                });
            }

            if (input.search) {
                const terms = prepareQuery(input.search);

                if (terms.length > 0) {
                    const searchConditions: Prisma.VacancyWhereInput[] =
                        terms.map((term) => ({
                            OR: [
                                {
                                    title: {
                                        contains: term,
                                        mode: 'insensitive' as const,
                                    },
                                },
                                {
                                    description: {
                                        contains: term,
                                        mode: 'insensitive' as const,
                                    },
                                },
                                {
                                    companyName: {
                                        contains: term,
                                        mode: 'insensitive' as const,
                                    },
                                },
                            ],
                        }));
                    whereConditions.push(...searchConditions);
                }
            }

            if (tags?.workSchedule && tags?.workSchedule.length > 0) {
                whereConditions.push({
                    tags: {
                        path: ['workSchedule'],
                        array_contains: tags.workSchedule,
                    },
                });
            }
            if (tags?.employmentTypes && tags?.employmentTypes.length > 0) {
                whereConditions.push({
                    tags: {
                        path: ['employmentTypes'],
                        array_contains: tags.employmentTypes,
                    },
                });
            }
            if (tags?.experience && tags?.experience.length > 0) {
                whereConditions.push({
                    tags: {
                        path: ['experience'],
                        array_contains: tags.experience,
                    },
                });
            }
            if (tags?.education && tags?.education.length > 0) {
                whereConditions.push({
                    tags: {
                        path: ['education'],
                        array_contains: tags.education,
                    },
                });
            }
            const where: Prisma.VacancyWhereInput =
                whereConditions.length > 0
                    ? { AND: whereConditions }
                    : {};

            const vacancyList = await ctx.prisma.vacancy.findMany({
                where,
                include: VACANCY_INCLUDE,
                take: limit + 1,
                cursor: cursor
                    ? { vacancy_id: cursor }
                    : undefined,
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
                vacancyList: vacancyList.map(normalizeVacancy),
                nextCursor,
            };
        }),
});
