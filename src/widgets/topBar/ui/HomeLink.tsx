'use client';

import { useRouter } from 'next/navigation';
import React from 'react';
import { CONSTANTS } from '~/shared/lib/strings';

export const HomeLink: React.FC = () => {
    const router = useRouter();

    return (
        <button
            type={'button'}
            onClick={() => {
                router.replace('/?', { scroll: false });
                setTimeout(() => router.refresh(), 50);
            }}
            className={'text-14 font-700 leading-6 text-text hover:text-sub/70'}
        >
            {CONSTANTS.topBar.placeholder}
        </button>
    );
};
