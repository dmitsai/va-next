import { z } from 'zod';
import { HHProvider, TrudvsemProvider, JobicyProvider, RemotiveProvider, VacancySyncService } from '~/server/services/vacancy-sync';
import { inputSyncFromHHSchema } from '~/shared/api/schema/external-vacancy';
import { createTRPCRouter, adminProcedure } from '../trpc';

const hhProvider = new HHProvider();
const trudvsemProvider = new TrudvsemProvider();
const jobicyProvider = new JobicyProvider();
const remotiveProvider = new RemotiveProvider();

export const vacancySyncRouter = createTRPCRouter({
    getProfessionalRoles: adminProcedure.query(() =>
        hhProvider.getProfessionalRoles(),
    ),

    syncFromHH: adminProcedure
        .input(inputSyncFromHHSchema)
        .mutation(async ({ ctx, input }) => {
            const syncService = new VacancySyncService(
                ctx.prisma,
                hhProvider,
            );

            return syncService.sync({
                text: input.text,
                area: input.area,
                experience: input.experience,
                employment: input.employment,
                schedule: input.schedule,
                professionalRoles: input.professionalRoles,
                perPage: input.perPage,
                maxPages: input.maxPages,
            });
        }),

    syncFromTrudvsem: adminProcedure
        .input(
            z.object({
                text: z.string().optional(),
                area: z.string().optional(),
                maxPages: z.number().min(1).max(50).default(5),
                perPage: z.number().min(1).max(100).default(100),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const syncService = new VacancySyncService(ctx.prisma, trudvsemProvider);

            return syncService.sync({
                text: input.text,
                area: input.area,
                perPage: input.perPage,
                maxPages: input.maxPages,
                triggeredBy: 'manual',
            });
        }),

    syncFromJobicy: adminProcedure
        .input(
            z.object({
                text: z.string().optional(),
                area: z.string().optional(),
                count: z.number().min(1).max(50).default(50),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const syncService = new VacancySyncService(ctx.prisma, jobicyProvider);

            return syncService.sync({
                text: input.text,
                area: input.area,
                perPage: input.count,
                maxPages: 1,
                triggeredBy: 'manual',
            });
        }),

    syncFromRemotive: adminProcedure
        .input(
            z.object({
                text: z.string().optional(),
                category: z.string().optional(),
                limit: z.number().min(1).max(100).default(100),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const syncService = new VacancySyncService(ctx.prisma, remotiveProvider);

            return syncService.sync({
                text: input.text,
                area: input.category,
                perPage: input.limit,
                maxPages: 1,
                triggeredBy: 'manual',
            });
        }),

    cancelRunningHHSync: adminProcedure.mutation(async ({ ctx }) => {
        const runningRun = await ctx.prisma.importRun.findFirst({
            where: {
                source: hhProvider.source,
                status: 'RUNNING',
                triggeredBy: 'manual',
            },
            orderBy: { startedAt: 'desc' },
            select: { import_run_id: true },
        });

        if (!runningRun) {
            return { canceled: false };
        }

        await ctx.prisma.importRun.update({
            where: { import_run_id: runningRun.import_run_id },
            data: {
                status: 'FAILED',
                finishedAt: new Date(),
                errorMessage: 'Синхронизация отменена пользователем',
            },
        });

        return { canceled: true, importRunId: runningRun.import_run_id };
    }),

    getImportRuns: adminProcedure.query(({ ctx }) =>
        ctx.prisma.importRun.findMany({
            orderBy: { startedAt: 'desc' },
            take: 50,
        }),
    ),
});
