import {
    ClientProfileResponseSchema,
    inputUpdateClientProfileSchema,
} from '~/shared/api/schema/profiles/client';
import { clientProcedure, createTRPCRouter } from '../trpc';

export const clientProfileRouter = createTRPCRouter({
    getProfile: clientProcedure.query(async ({ ctx }) => {
        const profile = await ctx.prisma.clientProfile.findUnique({
            where: { user_id: ctx.session.user.id },
            include: {
                currency: true,
                favoriteVacancies: true,
            },
        });
        return profile as ClientProfileResponseSchema;
    }),

    updateProfile: clientProcedure
        .input(inputUpdateClientProfileSchema)
        .mutation(async ({ input, ctx }) => {
            console.log('input', input.salaryFrom)
            const salaryFrom = input.salaryFrom
                ? // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                  parseInt(input.salaryFrom, 10)
                : null;
                console.log('parse', salaryFrom)
            const currency = await ctx.prisma.currency.findFirst({
                where: input.currencyName ? { title: input.currencyName } : {},
            });

            if (!currency) {
                throw new Error('Currency not found');
            }

            const currentProfile = await ctx.prisma.clientProfile.findUnique({
                where: { user_id: ctx.session.user.id },
            });

            const currentPreferences = (currentProfile?.preferences ?? {}) as {
                workSchedule?: string[];
                employmentTypes?: string[];
            };

            const updateData = {
                name: input.name,
                surname: input.surname,
                patronymic: input.patronymic,
                telegram: input.telegram,
                phone: input.phone,
                about_me: input.about_me,
                salaryFrom,
                currency: currency.currency_id
                    ? {
                          connect: { currency_id: currency.currency_id },
                      }
                    : undefined,
                ...(input.preferences && {
                    preferences: {
                        workSchedule:
                            input.preferences.workSchedule ??
                            currentPreferences.workSchedule ??
                            [],
                        employmentTypes:
                            input.preferences.employmentTypes ??
                            currentPreferences.employmentTypes ??
                            [],
                    },
                }),
            };

            const updatedProfile = await ctx.prisma.clientProfile.update({
                where: { user_id: ctx.session.user.id },
                data: updateData,
                include: {
                    favoriteVacancies: {
                        select: {
                            vacancy_id: true,
                            title: true,
                        },
                    },
                    user: {
                        select: {
                            email: true,
                        },
                    },
                    currency: true,
                },
            });
            return updatedProfile as ClientProfileResponseSchema;
        }),
});
