import { Roles } from "@prisma/client";
import {
  DefaultSession,
  DefaultUser,
  getServerSession,
  type NextAuthOptions,
} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "~/server/db/db";
import { compare } from "bcrypt";
import { JWT as DefaultJWT } from "next-auth/jwt";



declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: Roles;
    } & DefaultSession["user"];
  }
  interface User extends DefaultUser {
    id: string;
    role: Roles;
  }

  interface JWT extends DefaultJWT {
    role: Roles;
  }
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: 'Sign in',
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "Enter email",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error("Пожалуйста, введите email и пароль");
        }

        const user = await prisma.users.findUnique({
          where: {
            email: credentials.email
          }
        })

        if (!user) {
          throw new Error("Такого пользователя не существует");
        }

        const isPasswordValid = await compare(
          credentials.password,
          user.password_hash
        )

        if (!isPasswordValid) {
          throw new Error("Неверный пароль");
        }

        return {
          id: user.user_id,
          email: user.email,
          role: user.role,
        }
      }
    })
  ],
  callbacks: {
    session: ({ session, token }) => ({
      ...session,
      user: {
        ...session.user,
        id: token.id,
        role: token.role,
      },
    }),
    jwt: ({ token, user }) => {
      if (user) {
        return {
          ...token,
          id: user.id,
          role: user.role,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      }
      return token;
    },
  },
} satisfies NextAuthOptions;
export const getServerAuthSession = (p0?: unknown) => getServerSession(authOptions);
