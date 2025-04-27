import type { NextApiHandler } from 'next';
import NextAuth from 'next-auth';
import { authOptions } from '~/server/auth';

const handler = NextAuth(authOptions) as {
  GET: NextApiHandler;
  POST: NextApiHandler;
};

export { handler as GET, handler as POST };