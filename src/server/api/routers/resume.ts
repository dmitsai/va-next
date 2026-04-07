import {
    inputCreateResumeSchema,
    inputGetResumeItemSchema,
    inputUpdateSectionSchema,
    inputPublishResumeSchema,
    inputArchiveResumeSchema,
    inputGetAnalysisSchema,
    inputExportPdfSchema,
    inputImportFromPdfSchema,
} from '~/shared/api/schema/resume';
import { Prisma, ResumeStatus } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { createTRPCRouter, clientProcedure } from '../trpc';

const ACTIVE_RESUME_LIMIT = 2;

const RESUME_INCLUDE = {
    sections: true,
    analysis: true,
} as const;

export const resumeRouter = createTRPCRouter({
    getList: clientProcedure.query(async ({ ctx }) => {
        const userId = ctx.session.user.id;

        const clientProfile = await ctx.prisma.clientProfile.findUnique({
            where: { user_id: userId },
        });

        if (!clientProfile) {
            throw new TRPCError({ code: 'NOT_FOUND', message: 'Client profile not found' });
        }

        return ctx.prisma.resume.findMany({
            where: {
                client_profile_id: clientProfile.client_profile_id,
                status: { not: ResumeStatus.ARCHIVED },
            },
            include: RESUME_INCLUDE,
            orderBy: { updated_at: 'desc' },
        });
    }),

    getItem: clientProcedure
        .input(inputGetResumeItemSchema)
        .query(async ({ ctx, input }) => {
            const userId = ctx.session.user.id;

            const clientProfile = await ctx.prisma.clientProfile.findUnique({
                where: { user_id: userId },
            });

            if (!clientProfile) {
                throw new TRPCError({ code: 'NOT_FOUND', message: 'Client profile not found' });
            }

            const resume = await ctx.prisma.resume.findUnique({
                where: { resume_id: input.resume_id },
                include: RESUME_INCLUDE,
            });

            if (!resume) return null;

            if (resume.client_profile_id !== clientProfile.client_profile_id) {
                throw new TRPCError({ code: 'FORBIDDEN' });
            }

            return resume;
        }),

    create: clientProcedure
        .input(inputCreateResumeSchema)
        .mutation(async ({ ctx, input }) => {
            const userId = ctx.session.user.id;

            const clientProfile = await ctx.prisma.clientProfile.findUnique({
                where: { user_id: userId },
            });

            if (!clientProfile) {
                throw new TRPCError({ code: 'NOT_FOUND', message: 'Client profile not found' });
            }

            const activeCount = await ctx.prisma.resume.count({
                where: {
                    client_profile_id: clientProfile.client_profile_id,
                    status: { not: ResumeStatus.ARCHIVED },
                },
            });

            if (activeCount >= ACTIVE_RESUME_LIMIT) {
                throw new TRPCError({
                    code: 'FORBIDDEN',
                    message: `Resume limit reached (max ${ACTIVE_RESUME_LIMIT} active resumes)`,
                });
            }

            return ctx.prisma.resume.create({
                data: {
                    client_profile_id: clientProfile.client_profile_id,
                    title: input.title,
                    desired_position: input.desired_position,
                },
                include: RESUME_INCLUDE,
            });
        }),

    updateSection: clientProcedure
        .input(inputUpdateSectionSchema)
        .mutation(async ({ ctx, input }) => {
            const userId = ctx.session.user.id;

            const clientProfile = await ctx.prisma.clientProfile.findUnique({
                where: { user_id: userId },
            });

            if (!clientProfile) {
                throw new TRPCError({ code: 'NOT_FOUND', message: 'Client profile not found' });
            }

            const resume = await ctx.prisma.resume.findUnique({
                where: { resume_id: input.resume_id },
            });

            if (!resume) {
                throw new TRPCError({ code: 'NOT_FOUND', message: 'Resume not found' });
            }

            if (resume.client_profile_id !== clientProfile.client_profile_id) {
                throw new TRPCError({ code: 'FORBIDDEN' });
            }

            return ctx.prisma.resumeSection.upsert({
                where: {
                    resume_id_type: {
                        resume_id: input.resume_id,
                        type: input.type,
                    },
                },
                create: {
                    resume_id: input.resume_id,
                    type: input.type,
                    content: input.content as Prisma.InputJsonValue,
                    is_visible: input.is_visible ?? true,
                    order_index: input.order_index ?? 0,
                },
                update: {
                    content: input.content as Prisma.InputJsonValue,
                    ...(input.is_visible !== undefined && { is_visible: input.is_visible }),
                    ...(input.order_index !== undefined && { order_index: input.order_index }),
                },
            });
        }),

    publish: clientProcedure
        .input(inputPublishResumeSchema)
        .mutation(async ({ ctx, input }) => {
            const userId = ctx.session.user.id;

            const clientProfile = await ctx.prisma.clientProfile.findUnique({
                where: { user_id: userId },
            });

            if (!clientProfile) {
                throw new TRPCError({ code: 'NOT_FOUND', message: 'Client profile not found' });
            }

            const resume = await ctx.prisma.resume.findUnique({
                where: { resume_id: input.resume_id },
            });

            if (!resume) {
                throw new TRPCError({ code: 'NOT_FOUND', message: 'Resume not found' });
            }

            if (resume.client_profile_id !== clientProfile.client_profile_id) {
                throw new TRPCError({ code: 'FORBIDDEN' });
            }

            return ctx.prisma.resume.update({
                where: { resume_id: input.resume_id },
                data: { status: ResumeStatus.PUBLISHED },
                include: RESUME_INCLUDE,
            });
        }),

    archive: clientProcedure
        .input(inputArchiveResumeSchema)
        .mutation(async ({ ctx, input }) => {
            const userId = ctx.session.user.id;

            const clientProfile = await ctx.prisma.clientProfile.findUnique({
                where: { user_id: userId },
            });

            if (!clientProfile) {
                throw new TRPCError({ code: 'NOT_FOUND', message: 'Client profile not found' });
            }

            const resume = await ctx.prisma.resume.findUnique({
                where: { resume_id: input.resume_id },
            });

            if (!resume) {
                throw new TRPCError({ code: 'NOT_FOUND', message: 'Resume not found' });
            }

            if (resume.client_profile_id !== clientProfile.client_profile_id) {
                throw new TRPCError({ code: 'FORBIDDEN' });
            }

            return ctx.prisma.resume.update({
                where: { resume_id: input.resume_id },
                data: { status: ResumeStatus.ARCHIVED },
                include: RESUME_INCLUDE,
            });
        }),

    getAnalysis: clientProcedure
        .input(inputGetAnalysisSchema)
        .query(async ({ ctx, input }) => {
            const userId = ctx.session.user.id;

            const clientProfile = await ctx.prisma.clientProfile.findUnique({
                where: { user_id: userId },
            });

            if (!clientProfile) {
                throw new TRPCError({ code: 'NOT_FOUND', message: 'Client profile not found' });
            }

            const resume = await ctx.prisma.resume.findUnique({
                where: { resume_id: input.resume_id },
            });

            if (!resume) {
                throw new TRPCError({ code: 'NOT_FOUND', message: 'Resume not found' });
            }

            if (resume.client_profile_id !== clientProfile.client_profile_id) {
                throw new TRPCError({ code: 'FORBIDDEN' });
            }

            return ctx.prisma.resumeAnalysis.findUnique({
                where: { resume_id: input.resume_id },
            });
        }),

    exportPdf: clientProcedure
        .input(inputExportPdfSchema)
        .mutation(async () => {
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'PDF export not yet implemented',
            });
        }),

    importFromPdf: clientProcedure
        .input(inputImportFromPdfSchema)
        .mutation(async () => {
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'PDF import not yet implemented',
            });
        }),
});
