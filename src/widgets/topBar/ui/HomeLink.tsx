'use client';

import Link from 'next/link';
import React from 'react';
import { CONSTANTS } from '~/shared/lib/strings';

export const HomeLink: React.FC<{ href?: string }> = ({ href }) => (
    <Link
        href={href ?? '/'}
        className={'text-14 font-700 leading-6 text-text hover:text-sub/70'}
    >
        {CONSTANTS.topBar.placeholder}
    </Link>
);
