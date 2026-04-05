'use client';

import {
    DehydratedState,
    HydrationBoundary,
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query';
import { createTRPCClient, httpBatchLink,loggerLink } from '@trpc/client';
import React, { ReactNode, useState } from 'react';
import { AppRouter } from '~/server/api/root';
import { createTRPCContext } from '@trpc/tanstack-react-query';
import {createTRPCReact} from '@trpc/react-query';
import { getUrl, makeQueryClient, transformer } from './shared';


export const { TRPCProvider, useTRPC, useTRPCClient } = createTRPCContext<AppRouter>();

let browserQueryClient: QueryClient;
function getQueryClient() {

  if (typeof window === 'undefined') {
    return makeQueryClient();
  }
  
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}

export const clientApi = createTRPCReact<AppRouter>();

interface ClientApiProviderProps {
  children: ReactNode;
  dehydratedState?: DehydratedState | null;
}

export const ClientApiProvider: React.FC<ClientApiProviderProps> = ({children,dehydratedState}) => {
  
  const queryClient =getQueryClient();
  const [trpcClient] = useState(() =>
    clientApi.createClient({
      links: [
        loggerLink(),
        httpBatchLink({
        transformer,
          url: getUrl(),
        }),
      ],
    }),
  );
  return (
    <clientApi.Provider client={trpcClient} queryClient={queryClient} >
      <QueryClientProvider client={queryClient}>
          <HydrationBoundary state={dehydratedState}>
            {children}
          </HydrationBoundary>
      </QueryClientProvider>
    </clientApi.Provider>
  );
}