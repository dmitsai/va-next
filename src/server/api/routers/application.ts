import {
    inputApplySchema,
    inputCheckIsApplied,
    inputGetCandidateItem,
    inputGetCandidateListSchema,
} from '~/shared/api/schema/application';
import { clientProcedure, companyProcedure, createTRPCRouter } from '../trpc';

export const applicationRouter = createTRPCRouter({
    createApply: clientProcedure
        .input(inputApplySchema)
        .mutation(async ({ ctx, input }) => {
            const userId = ctx.session.user.id;
            const { vacancyId } = input;
            await ctx.prisma.application.create({
                data: {
                    user_id: userId,
                    vacancy_id: vacancyId,
                },
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
            return candidate;
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
            const hasNextPage = false;
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
