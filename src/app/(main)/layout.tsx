import { TopBar } from '~/widgets/topBar';
import React from 'react';

export default ({ children }: Readonly<{ children: React.ReactNode }>) => (
    <div className="flex h-screen min-h-screen flex-col">
        <TopBar />
        {children}
    </div>
);
