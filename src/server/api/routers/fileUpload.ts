import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getServerAuthSession } from "~/server/auth";
import { prisma } from "~/server/db/db";

const uploadThing = createUploadthing();

const handleAuth = async (req: Request) => {
  const session = await getServerAuthSession({ req });
  
  if (!session?.user) {
    if (!session?.user) {
      throw new Error("Не авторизован");
    }
  }
  return { userId: session?.user.id, userRole: session?.user.role };
};

export const fileUploadRouter = {
  imageUploader: uploadThing({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req }) => {
      const authData = await handleAuth(req);
      return authData;
    })
    .onUploadComplete(async ({ metadata, file }) => {
      try {
        await prisma.clientProfile.update({
          where: { user_id: metadata.userId },
          data: { imgUrl: file.ufsUrl },
        });

        console.log("Изображение сохранено user:", metadata.userId);
        return { 
          uploadedBy: metadata.userId,
          fileType: "image",
          fileUrl: file.ufsUrl
        };
      } catch (error) {
        console.error("Не удалось сохранить изображение в базу данных:", error);
        throw new Error("Ошибка сохранения URL");
      }
    }),

  pdfUploader: uploadThing({
    pdf: {
      maxFileSize: "16MB",
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req }) => {
      const authData = await handleAuth(req);
      return authData;
    })
    .onUploadComplete(async ({ metadata, file }) => {
      try {
        await prisma.clientProfile.update({
          where: { user_id: metadata.userId },
          data: { resume: file.ufsUrl },
        });

        console.log("Файл сохранен user:", metadata.userId);
        return { 
          uploadedBy: metadata.userId,
          fileType: "pdf",
          fileUrl: file.ufsUrl 
        };
      } catch (error) {
        console.error("Не удалось сохранить файл в базу данных:", error);
        throw new Error("Ошибка сохранения URL");
      }
    }),

} satisfies FileRouter;

export type FileUploadRouter = typeof fileUploadRouter;