import { createTRPCRouter, protectedProcedure } from '../trpc';

export const profileFilesRouter = createTRPCRouter({
    getAvatar: protectedProcedure.query(async ({ ctx }) => {
        const { role, id } = ctx.session.user;

        if (role === 'USER') {
            const profile = await ctx.prisma.clientProfile.findUnique({
                where: {
                    user_id: id,
                },
            });

            if (!profile) {
                throw new Error('Profile not found');
            }

            return profile.imgUrl;
        }

        if (role === 'COMPANY') {
            const profile = await ctx.prisma.companyProfile.findUnique({
                where: {
                    user_id: id,
                },
            });

            if (!profile) {
                throw new Error('Profile not found');
            }

            return profile.imgUrl;
        }
        return null;
    }),
    getPdf: protectedProcedure.query(async ({ ctx }) => {
        const { role, id } = ctx.session.user;

        if (role === 'USER') {
            const profile = await ctx.prisma.clientProfile.findUnique({
                where: {
                    user_id: id,
                },
            });

            if (!profile) {
                throw new Error('Profile not found');
            }

            return profile.pdfUrl;
        }

        if (role === 'COMPANY') {
            const profile = await ctx.prisma.companyProfile.findUnique({
                where: {
                    user_id: id,
                },
            });

            if (!profile) {
                throw new Error('Profile not found');
            }

            return profile.pdfUrl;
        }
        return null;
    }),
    deletePdf: protectedProcedure.mutation(async ({ ctx }) => {
        const { role, id } = ctx.session.user;

        if (role === 'USER') {
            const profile = await ctx.prisma.clientProfile.update({
                data: {
                    pdfUrl: null,
                },
                where: {
                    user_id: id,
                },
            });

            if (!profile) {
                throw new Error('Profile not found');
            }

            return profile.pdfUrl;
        }

        if (role === 'COMPANY') {
            const profile = await ctx.prisma.companyProfile.update({
                data: {
                    pdfUrl: null,
                },
                where: {
                    user_id: id,
                },
            });

            if (!profile) {
                throw new Error('Profile not found');
            }
        }
        return null;
    }),
});
