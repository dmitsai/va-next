import { Roles } from '@prisma/client';
import { DefaultSession, getServerSession, type NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '~/server/db/db'
import { authRouter } from '../api/routers/auth';
import axios from 'axios';
import { createSSRHelpers } from 'trpc/helpers';
import { headers } from 'next/headers';

declare module 'next-auth' {
    interface Session extends DefaultSession {
        user: {
            id: string;
            role: Roles;
        } & DefaultSession['user'];
    }
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt'
  },
  providers: [
    CredentialsProvider({
      name: 'Sign in',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'Enter email'
        },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null
        }

        const ctx = {
          session: null,
          prisma,
          headers: new Headers(),
          http: axios.create(),
        };
        
        const caller = authRouter.createCaller(ctx);

        try {
          const user = await caller.signIn({
            email: credentials.email,
            password: credentials.password
          });
          return {
            id: user.id,
            email: user.email,
            role: user.role,
          };
        } catch (error) {
          console.error('Ошибка Аутентификации:', error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    session: ({ session, token }) => {
      console.log('Session Callback', { session, token })
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          randomKey: token.randomKey
        }
      }
    },
    jwt: ({ token, user }) => {
      console.log('JWT Callback', { token, user })
      if (user) {
        const u = user as unknown as any
        return {
          ...token,
          id: u.id,
          randomKey: u.randomKey

        }
      }
      return token
    }
  }
}
export const getServerAuthSession = () => getServerSession(authOptions);