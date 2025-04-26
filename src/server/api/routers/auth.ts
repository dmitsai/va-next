import { Roles } from '@prisma/client';
import bcrypt, { compare } from 'bcrypt';
import { z } from 'zod';
import { prisma } from '~/server/db/db';
// eslint-disable-next-line import/no-cycle
import { publicProcedure, createTRPCRouter} from '~/server/api/trpc';

export const authRouter = createTRPCRouter({
  signUp: publicProcedure
    .input(
      z.object({
        email: z.string(),
        password: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const exist = await prisma.users.findUnique({ 
        where: { email: input.email } 
      });

      if (exist) {
        throw new Error('Пользователь с такой почтой уже существует');
      }

      const hashedPassword = await bcrypt.hash(input.password, 10);

      const user = await prisma.users.create({
        data: {
          email: input.email,
          password_hash: hashedPassword,
          role: Roles.USER,
        },
      });

      return { success: true, userId: user.user_id };
    }),

  signIn: publicProcedure
    .input(
      z.object({
        email: z.string(),
        password: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const user = await prisma.users.findUnique({
        where: { email: input.email },
      });

      if (!user) {
        throw new Error('Неверный email или пароль');
      }

      const isPasswordValid = await compare(
        input.password,
        user.password_hash,
      );

      if (!isPasswordValid) {
        throw new Error('Неверный email или пароль');
      }

      return {
        id: user.user_id,
        email: user.email,
        role: user.role,
      };
    }),
});