import {
    inputApplySchema,
    inputCheckIsApplied,
    inputDeleteApplicationSchema,
    inputGetCandidateItem,
    inputGetCandidateListSchema,
    inputGetMyApplicationsSchema,
    inputToggleFavoriteSchema,
    inputCheckIsFavoritedSchema,
} from '~/shared/api/schema/application';
import { TRPCError } from '@trpc/server';
import { clientProcedure, companyProcedure, createTRPCRouter } from '../trpc';

export const applicationRouter = createTRPCRouter({
    createApply: clientProcedure
        .input(inputApplySchema)
        .mutation(async ({ ctx, input }) => {
            const userId = ctx.session.user.id;
            const { vacancyId, resumeId } = input;

            const vacancy = await ctx.prisma.vacancy.findUnique({
                where: { vacancy_id: vacancyId },
                include: { platform: true },
            });

            if (!vacancy) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Вакансия не найдена',
                });
            }

            const isLocal = vacancy.platform.name === 'local';

            if (!isLocal && !vacancy.sourceUrl) {
                throw new TRPCError({
                    code: 'BAD_REQUEST',
                    message: 'Невозможно зафиксировать отклик',
                });
            }

            await ctx.prisma.application.upsert({
                where: {
                    user_vacancy_unique: {
                        vacancy_id: vacancyId,
                        user_id: userId,
                    },
                },
                create: {
                    user_id: userId,
                    vacancy_id: vacancyId,
                    resume_id: isLocal ? resumeId ?? null : null,
                },
                update: {},
            });
        }),

    deleteApplication: clientProcedure
        .input(inputDeleteApplicationSchema)
        .mutation(async ({ ctx, input }) => {
            const userId = ctx.session.user.id;

            const application = await ctx.prisma.application.findUnique({
                where: { application_id: input.applicationId },
            });

            if (!application) {
                throw new TRPCError({ code: 'NOT_FOUND', message: 'Отклик не найден' });
            }

            if (application.user_id !== userId) {
                throw new TRPCError({ code: 'FORBIDDEN' });
            }

            await ctx.prisma.application.delete({
                where: { application_id: input.applicationId },
            });
        }),

    checkIsApplied: clientProcedure
        .input(inputCheckIsApplied)
        .query(async ({ ctx, input }) => {
            const application = await ctx.prisma.application.findUnique({
                where: {
                    user_vacancy_unique: {
                        vacancy_id: input.vacancyId,
                        user_id: ctx.session.user.id,
                    },
                },
            });
            return !!application;
        }),

    getMyApplications: clientProcedure
        .input(inputGetMyApplicationsSchema)
        .query(async ({ ctx, input }) => {
            const userId = ctx.session.user.id;
            const limit = input.limit ?? 20;
            const { cursor } = input;

            const applications = await ctx.prisma.application.findMany({
                where: { user_id: userId },
                take: limit + 1,
                cursor: cursor ? { application_id: cursor } : undefined,
                orderBy: { created_at: 'desc' },
                include: {
                    vacancy: {
                        include: {
                            platform: true,
                            currency: true,
                            location: true,
                        },
                    },
                    resume: {
                        select: {
                            resume_id: true,
                            title: true,
                            desired_position: true,
                        },
                    },
                },
            });

            let nextCursor: typeof cursor | undefined;
            if (applications.length > limit) {
                const next = applications.pop();
                nextCursor = next!.application_id;
            }

            return { applications, nextCursor };
        }),

    toggleFavorite: clientProcedure
        .input(inputToggleFavoriteSchema)
        .mutation(async ({ ctx, input }) => {
            const userId = ctx.session.user.id;
            const { vacancyId } = input;

            const clientProfile = await ctx.prisma.clientProfile.findUnique({
                where: { user_id: userId },
                include: { favoriteVacancies: { where: { vacancy_id: vacancyId } } },
            });

            if (!clientProfile) {
                throw new TRPCError({ code: 'NOT_FOUND', message: 'Профиль не найден' });
            }

            const isFavorited = clientProfile.favoriteVacancies.length > 0;

            if (isFavorited) {
                await ctx.prisma.clientProfile.update({
                    where: { client_profile_id: clientProfile.client_profile_id },
                    data: {
                        favoriteVacancies: {
                            disconnect: { vacancy_id: vacancyId },
                        },
                    },
                });
                return { isFavorited: false };
            }

            await ctx.prisma.clientProfile.update({
                where: { client_profile_id: clientProfile.client_profile_id },
                data: {
                    favoriteVacancies: {
                        connect: { vacancy_id: vacancyId },
                    },
                },
            });
            return { isFavorited: true };
        }),

    checkIsFavorited: clientProcedure
        .input(inputCheckIsFavoritedSchema)
        .query(async ({ ctx, input }) => {
            const userId = ctx.session.user.id;

            const clientProfile = await ctx.prisma.clientProfile.findUnique({
                where: { user_id: userId },
                include: {
                    favoriteVacancies: {
                        where: { vacancy_id: input.vacancyId },
                        select: { vacancy_id: true },
                    },
                },
            });

            return !!(clientProfile?.favoriteVacancies.length);
        }),

    getMyAppliedVacancyIds: clientProcedure
        .query(async ({ ctx }) => {
            const userId = ctx.session.user.id;
            const applications = await ctx.prisma.application.findMany({
                where: { user_id: userId },
                select: { vacancy_id: true },
            });
            return applications.map((a) => a.vacancy_id);
        }),

    getMyFavorites: clientProcedure
        .query(async ({ ctx }) => {
            const userId = ctx.session.user.id;

            const clientProfile = await ctx.prisma.clientProfile.findUnique({
                where: { user_id: userId },
                include: {
                    favoriteVacancies: {
                        include: {
                            platform: true,
                            currency: true,
                            location: true,
                        },
                        orderBy: { published_at: 'desc' },
                    },
                },
            });

            return clientProfile?.favoriteVacancies ?? [];
        }),

    getCandidateItem: companyProcedure
        .input(inputGetCandidateItem)
        .query(async ({ ctx, input }) => {
            const { vacancyId, candidateId } = input;

            const aplication = await ctx.prisma.application.findUnique({
                where: {
                    user_vacancy_unique: {
                        user_id: candidateId,
                        vacancy_id: vacancyId,
                    },
                },
                include: {
                    resume: {
                        include: { sections: true },
                    },
                },
            });

            if (!aplication) {
                throw new Error('Application not found');
            }

            const candidate = await ctx.prisma.clientProfile.findUnique({
                where: {
                    user_id: aplication.user_id,
                },
            });
            if (!candidate) {
                throw new Error('Candidate not found');
            }
            return { ...candidate, attachedResume: aplication.resume };
        }),

    infinityCandidateList: companyProcedure
        .input(inputGetCandidateListSchema)
        .query(async ({ ctx, input }) => {
            const limit = input.limit ?? 50;
            const { cursor, vacancyId } = input;

            const applications = await ctx.prisma.application.findMany({
                where: {
                    vacancy_id: vacancyId,
                },
                take: limit + 1,
                cursor: cursor ? { application_id: cursor } : undefined,
                orderBy: {
                    created_at: 'desc',
                },
                include: {
                    user: {
                        include: {
                            ClientProfile: true,
                        },
                    },
                },
            });

            let nextCursor: typeof cursor | undefined;
            if (applications.length > limit) {
                const nextApplication = applications.pop();
                nextCursor = nextApplication!.application_id;
            }

            const candidates = applications.map((app) => ({
                applicationId: app.application_id,
                appliedAt: app.created_at,
                userProfile: app.user.ClientProfile,
                userId: app.user_id,
            }));

            return {
                candidates,
                nextCursor,
            };
        }),
});
