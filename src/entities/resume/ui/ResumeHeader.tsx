import Link from 'next/link';
import React from 'react';

interface ResumeHeaderProps {
    activeCount: number;
    limit: number;
    canCreate: boolean;
}
export const ResumeHeader: React.FC<ResumeHeaderProps> = ({
    activeCount,
    limit,
    canCreate,
}) => (
    <div className="flex flex-col gap-y-2">
        <p className="text-28 font-700 text-text">Мои резюме</p>
        <p className="muted whitespace-nowrap text-12 text-sub-secondary/70">
            {'У вас '}
            <span className="font-600">{activeCount}</span>
            {' из '}
            <span className="font-600">{limit}</span>
            {' резюме.'}
            {canCreate && (
                <span className="ml-1 text-sub-secondary/70">
                    <Link
                        href="/resume/builder/new"
                        className="ml-1 text-sub-secondary/70 hover:text-text"
                    >
                        Создайте ещё одно
                    </Link>{' '}
                    или отредактируйте существующее.
                </span>
            )}
        </p>
    </div>
);
