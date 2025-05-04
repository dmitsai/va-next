'use client';

import { ThemeProvider, } from "next-themes";
import React, { type PropsWithChildren, useEffect } from "react";
import { Theme, type ThemeType, useTheme } from "~/shared/lib/theme";
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { ClientApiProvider } from "trpc/client";

const AppProviders: React.FC<PropsWithChildren> = ({ children }) => {
    const { setTheme } = useTheme();
    useEffect(() => {
        const selectedTheme = localStorage.getItem('theme');
        setTheme(selectedTheme ? selectedTheme as ThemeType : Theme.system);
    }, [])

    return (
        <NuqsAdapter>
            <ThemeProvider defaultTheme={Theme.system}>
                <ClientApiProvider>
                    {children}
                </ClientApiProvider>
            </ThemeProvider>
        </NuqsAdapter>
    );
}
export default AppProviders;