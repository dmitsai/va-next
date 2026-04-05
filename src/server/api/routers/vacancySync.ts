import { inputSyncFromHHSchema } from '~/shared/api/schema/external-vacancy';
import { createTRPCRouter, adminProcedure } from '../trpc';
import { HHProvider, VacancySyncService } from '~/server/services/vacancy-sync';

const hhProvider = new HHProvider();

export const vacancySyncRouter = createTRPCRouter({
    getProfessionalRoles: adminProcedure.query(async () => {
        return hhProvider.getProfessionalRoles();
    }),

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

    getImportRuns: adminProcedure.query(async ({ ctx }) => {
        return ctx.prisma.importRun.findMany({
            orderBy: { startedAt: 'desc' },
            take: 50,
        });
    }),
});
