import React from 'react';
import cn from 'classnames';
import { ReactComponent as IconCheck } from '~/shared/assets/icons/check-icon.svg';
import type { ResumeTab } from '../model/types';

export interface SectionStatusProps extends ResumeTab {
    isActive: boolean;
}

export const SectionStatus: React.FC<SectionStatusProps> = ({
    title,
    status,
    number,
    isActive,
}) => {
    const isCompleted = status === 'completed';
    return (
        <div
            className={cn(
                'flex flex-row items-center gap-x-3 rounded-8 px-4 py-2 transition-colors',
                isActive &&
                    'bg-resume-progress-active/10 group-hover:bg-resume-progress-active/20',
                !isActive && 'group-hover:bg-resume-progress-active/20'
            )}
        >
            <span
                className={cn(
                    'flex size-6 items-center justify-center rounded-full border p-2 text-12',
                    isCompleted &&
                        'border-score-success-border/25 bg-score-success-bg/15',
                    isActive &&
                        'border-resume-progress-active/50 bg-resume-progress-active/20 text-resume-progress-active-text',
                    !isActive &&
                        !isCompleted &&
                        'border-surface/50 text-surface group-hover:border-resume-progress-active/35 group-hover:text-resume-progress-active-text'
                )}
            >
                {isCompleted ? (
                    <IconCheck className="fill-score-success-text size-2" />
                ) : (
                    number
                )}
            </span>
            <p
                className={cn(
                    'text-14 transition-colors',
                    isActive ? 'text-text' : 'text-surface group-hover:text-text'
                )}
            >
                {title}
            </p>
        </div>
    );
};
