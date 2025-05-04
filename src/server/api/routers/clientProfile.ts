import {
  ClientProfileResponseSchema,
  inputGetClientProfileSchema,
  inputUpdateClientProfileSchema,
} from "~/shared/api/schema/profiles/client";
import { clientProcedure, createTRPCRouter } from "../trpc";

export const clientProfileRouter = createTRPCRouter({
  getProfile: clientProcedure
    .input(inputGetClientProfileSchema)
    .query(async ({ input, ctx }) => {
      const profile = await ctx.prisma.clientProfile.findUnique({
          where: { user_id: input.user_id },
      });

      if(ctx.session.user.id !== profile?.user_id) throw new Error("Нельзя получить чужой профиль");
      return profile as ClientProfileResponseSchema;
  }),
  
  updateProfile: clientProcedure
  .input(inputUpdateClientProfileSchema)
  .mutation(async ({ input, ctx }) => {
    const currentProfile = await ctx.prisma.clientProfile.findUnique({
      where: { user_id: input.user_id },
    });

    if(ctx.session.user.id !== currentProfile?.user_id) throw new Error("Нельзя получить чужой профиль");
    
    const currentPreferences = (currentProfile?.preferences ?? {}) as {
      workSchedule?: string[];
      employmentTypes?: string[];
      salary?: string | null;
    };

    const updateData = {
      name: input.name,
      surname: input.surname,
      patronymic: input.patronymic,
      imgUrl: input.imgUrl,
      telegram: input.telegram,
      phone: input.phone,
      about_me: input.about_me,
      resume: input.resume,
      ...(input.preferences && {
        preferences: {
          workSchedule: input.preferences.workSchedule ?? currentPreferences.workSchedule ?? [],
          employmentTypes: input.preferences.employmentTypes ?? currentPreferences.employmentTypes ?? [],
          salary: input.preferences.salary ?? currentPreferences.salary
        }
      }),
    };

    const updatedProfile = await ctx.prisma.clientProfile.update({
      where: { user_id: input.user_id },
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
      },
    });
    return updatedProfile as ClientProfileResponseSchema;
  }),
});