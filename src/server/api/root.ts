import { createTRPCRouter } from "~/server/api/trpc";
import { vacancyRouter } from "./routers/vacancy";
import { tagRouter } from "./routers/tag";
import { clientProfileRouter } from "./routers/clientProfile";
import { fileUploadRouter } from "./routers/fileUpload";

export const appRouter = createTRPCRouter({
  vacancy: vacancyRouter,
  tag: tagRouter,
  clientProfile: clientProfileRouter,
  fileUpload: fileUploadRouter
});

export type AppRouter = typeof appRouter;
