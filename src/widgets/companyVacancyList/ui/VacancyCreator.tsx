import Link from 'next/link';
import React from 'react';
import { ReactComponent as IconPlus } from '~/shared/assets/icons/icon-plus.svg';

export const VacancyCreator: React.FC = () => (
    <Link
        href={'vacancy/create'}
        className={
            'card flex flex-col items-center justify-center border-2 border-dashed border-text bg-base transition-all hover:opacity-75'
        }
    >
        <IconPlus className={'h-10 w-10 fill-text'} />
    </Link>
);
