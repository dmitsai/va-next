'use client';

import {
    DehydratedState,
    QueryClient,
    QueryClientProvider,
    HydrationBoundary,
} from '@tanstack/react-query';
import {
    httpBatchLink,
    httpLink,
    isNonJsonSerializable,
    loggerLink,
    splitLink,
} from '@trpc/client';
import React, { ReactNode, useState } from 'react';
import { AppRouter } from '~/server/api/root';
import { createTRPCContext } from '@trpc/tanstack-react-query';
import { createTRPCReact } from '@trpc/react-query';
import { getUrl, makeQueryClient, transformer } from './shared';

export const { TRPCProvider, useTRPC, useTRPCClient } =
    createTRPCContext<AppRouter>();

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

export const ClientApiProvider: React.FC<ClientApiProviderProps> = ({
    children,
    dehydratedState,
}) => {
    const queryClient = getQueryClient();
    const [trpcClient] = useState(() =>
        clientApi.createClient({
            links: [
                loggerLink({
                    enabled: (op) =>
                        process.env.NODE_ENV === 'development' ||
                        op.direction === 'down' ||
                        op.type === 'mutation',
                }),
                splitLink({
                    condition: (op) => isNonJsonSerializable(op.input),
                    true: httpLink({
                        url: getUrl(),
                        transformer,
                    }),
                    false: httpBatchLink({
                        url: getUrl(),
                        transformer,
                    }),
                }),
            ],
        })
    );
    return (
        <clientApi.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
                <HydrationBoundary state={dehydratedState}>
                    {children}
                </HydrationBoundary>
            </QueryClientProvider>
        </clientApi.Provider>
    );
};
