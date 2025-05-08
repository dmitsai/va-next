import { createRouteHandler } from "uploadthing/next";
import { fileUploadRouter } from "~/server/api/routers/fileUpload";

export const { GET, POST } = createRouteHandler({
  router: fileUploadRouter,
});