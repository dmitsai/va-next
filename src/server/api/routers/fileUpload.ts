import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { getServerAuthSession } from '~/server/auth';
import { prisma } from '~/server/db/db';
import { Roles } from '@prisma/client';

const uploadThing = createUploadthing();

const handleAuth = async (req: Request) => {
    const session = await getServerAuthSession({ req });

    if (!session?.user) {
        if (!session?.user) {
            throw new Error('Не авторизован');
        }
    }
    return {
        userId: session?.user.id,
        userRole: session?.user.role,
    };
};

export const fileUploadRouter = {
    imageUploader: uploadThing({
        image: {
            maxFileSize: '4MB',
            maxFileCount: 1,
        },
    })
        .middleware(async ({ req }) => {
            console.log('Middleware request headers:', req.headers);
            const authData = await handleAuth(req);
            return authData;
        })
        // eslint-disable-next-line consistent-return
        .onUploadComplete(async ({ metadata, file }) => {
            if (metadata.userRole === Roles.USER) {
                try {
                    await prisma.clientProfile.update({
                        where: { user_id: metadata.userId },
                        data: { imgUrl: file.ufsUrl },
                    });

                    console.log('Изображение сохранено user:', metadata.userId);
                    return {
                        uploadedBy: metadata.userId,
                        fileType: 'image',
                        fileUrl: file.ufsUrl,
                    };
                } catch (error) {
                    console.error(
                        'Не удалось сохранить изображение в базу данных:',
                        error
                    );
                    throw new Error('Ошибка сохранения URL');
                }
            } else if (metadata.userRole === Roles.COMPANY) {
                try {
                    await prisma.companyProfile.update({
                        where: { user_id: metadata.userId },
                        data: { imgUrl: file.ufsUrl },
                    });

                    console.log('Изображение сохранено user:', metadata.userId);
                    return {
                        uploadedBy: metadata.userId,
                        fileType: 'image',
                        fileUrl: file.ufsUrl,
                    };
                } catch (error) {
                    console.error(
                        'Не удалось сохранить изображение в базу данных:',
                        error
                    );
                    throw new Error('Ошибка сохранения URL');
                }
            }
        }),

    pdfUploader: uploadThing({
        pdf: {
            maxFileSize: '16MB',
            maxFileCount: 1,
        },
    })
        .middleware(async ({ req }) => {
            const authData = await handleAuth(req);
            return authData;
        })
        // eslint-disable-next-line consistent-return
        .onUploadComplete(async ({ metadata, file }) => {
            if (metadata.userRole === Roles.USER) {
                try {
                    await prisma.clientProfile.update({
                        where: { user_id: metadata.userId },
                        data: { pdfUrl: file.ufsUrl },
                    });

                    console.log('Файл сохранен user:', metadata.userId);
                    return {
                        uploadedBy: metadata.userId,
                        fileType: 'pdf',
                        fileUrl: file.ufsUrl,
                    };
                } catch (error) {
                    console.error(
                        'Не удалось сохранить файл в базу данных:',
                        error
                    );
                    throw new Error('Ошибка сохранения URL');
                }
            } else if (metadata.userRole === Roles.COMPANY) {
                try {
                    await prisma.companyProfile.update({
                        where: { user_id: metadata.userId },
                        data: { pdfUrl: file.ufsUrl },
                    });

                    console.log('Файл сохранен user:', metadata.userId);
                    return {
                        uploadedBy: metadata.userId,
                        fileType: 'pdf',
                        fileUrl: file.ufsUrl,
                    };
                } catch (error) {
                    console.error(
                        'Не удалось сохранить файл в базу данных:',
                        error
                    );
                    throw new Error('Ошибка сохранения URL');
                }
            }
        }),
} satisfies FileRouter;

export type FileUploadRouter = typeof fileUploadRouter;
