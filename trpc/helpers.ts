import { createServerSideHelpers } from '@trpc/react-query/server';
import { appRouter } from '~/server/api/root';
import { createSSRContext } from '~/server/api/trpc';
import { transformer } from './shared';

export const createSSRHelpers = async (headers?: Headers) => {
  const ctx = await createSSRContext({ headers });

  return createServerSideHelpers({
    router: appRouter,
    ctx,
    transformer,
  });
};