import { z } from 'zod';
import { Roles } from '@prisma/client';
import { tagsShema } from '~/shared/api/schema/tag';
import { createTRPCRouter, adminProcedure } from '../trpc';

export const adminRouter = createTRPCRouter({
    getStats: adminProcedure.query(async ({ ctx }) => {
        const [
            vacancyCountByPlatform,
            userCountByRole,
            totalApplications,
            recentImports,
            lastCronRun,
        ] = await Promise.all([
            ctx.prisma.vacancy.groupBy({
                by: ['platform_id'],
                _count: { vacancy_id: true },
            }),
            ctx.prisma.users.groupBy({
                by: ['role'],
                _count: { user_id: true },
            }),
            ctx.prisma.application.count(),
            ctx.prisma.importRun.findMany({
                orderBy: { startedAt: 'desc' },
                take: 5,
            }),
            ctx.prisma.importRun.findFirst({
                where: { triggeredBy: 'cron' },
                orderBy: { startedAt: 'desc' },
            }),
        ]);

        const platforms = await ctx.prisma.platform.findMany({
            select: { platform_id: true, name: true, title: true },
        });

        const platformMap = Object.fromEntries(
            platforms.map((p) => [p.platform_id, p]),
        );

        const vacanciesByPlatform = vacancyCountByPlatform.map((row) => ({
            platform: platformMap[row.platform_id] ?? {
                platform_id: row.platform_id,
                name: 'unknown',
                title: 'Unknown',
            },
            count: row._count.vacancy_id,
        }));

        const usersByRole = userCountByRole.map((row) => ({
            role: row.role,
            count: row._count.user_id,
        }));

        return {
            vacanciesByPlatform,
            usersByRole,
            totalApplications,
            recentImports,
            lastCronRun,
        };
    }),

    getUsers: adminProcedure
        .input(
            z.object({
                page: z.number().min(0).default(0),
                pageSize: z.number().min(1).max(100).default(20),
                role: z.string().optional(),
            }),
        )
        .query(async ({ ctx, input }) => {
            const { page, pageSize, role } = input;
            const where = role ? { role: role as Roles } : {};

            const [users, total] = await Promise.all([
                ctx.prisma.users.findMany({
                    where,
                    skip: page * pageSize,
                    take: pageSize,
                    orderBy: { user_id: 'desc' },
                    include: {
                        ClientProfile: {
                            select: {
                                name: true,
                                surname: true,
                                email: true,
                                imgUrl: true,
                                _count: { select: { favoriteVacancies: true } },
                            },
                        },
                        CompanyProfile: {
                            select: {
                                title: true,
                                imgUrl: true,
                                email: true,
                            },
                        },
                        _count: { select: { Application: true } },
                    },
                }),
                ctx.prisma.users.count({ where }),
            ]);

            return { users, total, page, pageSize };
        }),

    getVacancies: adminProcedure
        .input(
            z.object({
                platformName: z.string(),
                page: z.number().min(0).default(0),
                pageSize: z.number().min(1).max(100).default(20),
                search: z.string().optional(),
            }),
        )
        .query(async ({ ctx, input }) => {
            const { platformName, page, pageSize, search } = input;

            const platform = await ctx.prisma.platform.findUnique({
                where: { name: platformName },
            });

            if (!platform) {
                return { vacancies: [], total: 0, page, pageSize, platform: null };
            }

            const where = {
                platform_id: platform.platform_id,
                ...(search
                    ? {
                          OR: [
                              { title: { contains: search, mode: 'insensitive' as const } },
                              { companyName: { contains: search, mode: 'insensitive' as const } },
                          ],
                      }
                    : {}),
            };

            const [vacancies, total] = await Promise.all([
                ctx.prisma.vacancy.findMany({
                    where,
                    skip: page * pageSize,
                    take: pageSize,
                    orderBy: { published_at: 'desc' },
                    include: {
                        currency: true,
                        location: true,
                        _count: { select: { Application: true } },
                    },
                }),
                ctx.prisma.vacancy.count({ where }),
            ]);

            return { vacancies, total, page, pageSize, platform };
        }),

    deleteVacancy: adminProcedure
        .input(z.object({ vacancyId: z.string() }))
        .mutation(async ({ ctx, input }) => {
            await ctx.prisma.vacancy.delete({
                where: { vacancy_id: input.vacancyId },
            });
            return { ok: true };
        }),

    createTestVacancy: adminProcedure
        .input(
            z.object({
                title: z.string().min(1),
                description: z.string().min(1),
                companyName: z.string().min(1),
                salaryFrom: z.string().optional().nullable(),
                salaryTo: z.string().optional().nullable(),
                currencyName: z.string().optional().nullable(),
                tags: tagsShema.optional(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const [platform, currency] = await Promise.all([
                ctx.prisma.platform.findUnique({ where: { name: 'local' } }),
                input.currencyName
                    ? ctx.prisma.currency.findFirst({ where: { title: input.currencyName } })
                    : Promise.resolve(null),
            ]);

            if (!platform) throw new Error('Platform "local" not found');

            const salaryFrom = input.salaryFrom ? parseInt(input.salaryFrom, 10) : null;
            const salaryTo = input.salaryTo ? parseInt(input.salaryTo, 10) : null;

            const vacancy = await ctx.prisma.vacancy.create({
                data: {
                    title: input.title,
                    description: input.description,
                    companyName: input.companyName,
                    salaryFrom,
                    salaryTo,
                    currency_id: currency?.currency_id ?? null,
                    tags: input.tags,
                    platform_id: platform.platform_id,
                    published_at: new Date(),
                },
            });

            return vacancy;
        }),

    getImportRuns: adminProcedure
        .input(
            z.object({
                triggeredBy: z.enum(['all', 'manual', 'cron']).default('all'),
                page: z.number().min(0).default(0),
                pageSize: z.number().min(1).max(100).default(30),
            }),
        )
        .query(async ({ ctx, input }) => {
            const { triggeredBy, page, pageSize } = input;
            const where =
                triggeredBy === 'all' ? {} : { triggeredBy };

            const [runs, total] = await Promise.all([
                ctx.prisma.importRun.findMany({
                    where,
                    orderBy: { startedAt: 'desc' },
                    skip: page * pageSize,
                    take: pageSize,
                }),
                ctx.prisma.importRun.count({ where }),
            ]);

            return { runs, total, page, pageSize };
        }),

    /** Уникальные источники и запросы для фильтров на странице импортов (с учётом triggeredBy). */
    getImportRunFilterOptions: adminProcedure
        .input(
            z.object({
                triggeredBy: z.enum(['all', 'manual', 'cron']).default('all'),
            }),
        )
        .query(async ({ ctx, input }) => {
            const where =
                input.triggeredBy === 'all'
                    ? {}
                    : { triggeredBy: input.triggeredBy };

            const [bySource, emptyQueryCount, withQuery] = await Promise.all([
                ctx.prisma.importRun.groupBy({
                    by: ['source'],
                    where,
                    orderBy: { source: 'asc' },
                }),
                ctx.prisma.importRun.count({
                    where: {
                        ...where,
                        OR: [{ query: null }, { query: '' }],
                    },
                }),
                ctx.prisma.importRun.findMany({
                    where: {
                        ...where,
                        AND: [
                            { query: { not: null } },
                            { NOT: { query: '' } },
                        ],
                    },
                    distinct: ['query'],
                    select: { query: true },
                    orderBy: { query: 'asc' },
                }),
            ]);

            const sources = bySource.map((r) => r.source);
            const queries = withQuery
                .map((r) => r.query)
                .filter((q): q is string => q != null && q !== '');

            return {
                sources,
                queries,
                hasEmptyQuery: emptyQueryCount > 0,
            };
        }),
});
