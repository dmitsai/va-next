'use client';

import { ThemeProvider } from "next-themes";
import React, { PropsWithChildren, useEffect, useState } from "react";

const AppProviders: React.FC<PropsWithChildren> = ({ children }) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, [])

    return !mounted ?
        // eslint-disable-next-line react/jsx-no-useless-fragment
        <>{children}</>
        :
        <ThemeProvider>
            {children}
        </ThemeProvider>
}
export default AppProviders;