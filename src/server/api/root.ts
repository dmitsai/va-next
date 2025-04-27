import { createTRPCRouter } from "~/server/api/trpc";
import { vacancyRouter } from "./routers/vacancy";
import { tagRouter } from "./routers/tag";

export const appRouter = createTRPCRouter({
  vacancy: vacancyRouter,
  tag: tagRouter,
});

export type AppRouter = typeof appRouter;
