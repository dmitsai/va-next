import {
  inputAddTagSchema,
  inputDeleteTagSchema,
  TagResponseSchema,
} from "~/shared/api/schema/tag";
import { companyProcedure, createTRPCRouter } from "../trpc";

export const tagRouter = createTRPCRouter({
  addTag: companyProcedure
    .input(inputAddTagSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const companyUserId = ctx.session.user.id;

        const companyProfile = await ctx.prisma.companyProfile.findUnique({
          where: { user_id: companyUserId },
        });

        if (!companyProfile) {
          throw new Error("Company profile not found");
        }
        const addedTag = await ctx.prisma.tag.findUnique({
          where: { tag_id: input.tag_id },
        });

        if (!addedTag) {
          throw new Error(`Error: tag ${input.tag_id} dosent exist`);
        }

        await ctx.prisma.vacancy.update({
          where: {
            vacancy_id: input.vacancy_id,
            company_id: companyProfile.company_id,
          },
          data: { tags: { connect: { tag_id: addedTag.tag_id } } },
          include: { tags: true },
        });

        return addedTag;
      } catch (err) {
        console.error(
          `Error adding tag ${input.tag_id} to vacancy ${input.vacancy_id}`,
          err,
        );
        throw err;
      }
    }),
  deleteTag: companyProcedure
    .input(inputDeleteTagSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const companyUserId = ctx.session.user.id;

        const companyProfile = await ctx.prisma.companyProfile.findUnique({
          where: { user_id: companyUserId },
        });

        if (!companyProfile) {
          throw new Error("Company profile not found");
        }
        const deletedTag = await ctx.prisma.tag.findUnique({
          where: { tag_id: input.tag_id },
        });

        if (!deletedTag) {
          throw new Error(`Error: tag ${input.tag_id} dosent exist`);
        }
        await ctx.prisma.vacancy.update({
          where: {
            vacancy_id: input.vacancy_id,
            company_id: companyProfile.company_id,
          },
          data: {
            tags: {
              disconnect: { tag_id: input.tag_id },
            },
          },
          include: { tags: true },
        });
      } catch (err) {
        console.error(
          `Error deleting tag ${input.tag_id} to vacancy ${input.vacancy_id}`,
          err,
        );
        throw err;
      }
    }),
  getAllTags: companyProcedure.query(async ({ ctx }) => {
    const tags = await ctx.prisma.tag.findMany();
    return tags as TagResponseSchema[];
  }),
});
