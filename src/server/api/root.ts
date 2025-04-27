import { createTRPCRouter } from "~/server/api/trpc";
import { testRouter } from "./routers/test";
import { vacancyRouter } from "./routers/vacancy";

export const appRouter = createTRPCRouter({
  test: testRouter,
  vacancy: vacancyRouter,
});

export type AppRouter = typeof appRouter;
