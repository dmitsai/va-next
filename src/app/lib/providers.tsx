
'use client';

import { ThemeProvider, } from "next-themes";
import React, { type PropsWithChildren, useEffect } from "react";
import { Theme, type ThemeType, useTheme } from "~/shared/lib/theme";

const AppProviders: React.FC<PropsWithChildren> = ({ children }) => {
    const { setTheme } = useTheme();
    useEffect(() => {
        const selectedTheme = localStorage.getItem('theme');
        setTheme(selectedTheme ? selectedTheme as ThemeType : Theme.system);
    }, [])

    return (
        <ThemeProvider defaultTheme={Theme.system}>
            {children}
        </ThemeProvider>);
}
export default AppProviders;