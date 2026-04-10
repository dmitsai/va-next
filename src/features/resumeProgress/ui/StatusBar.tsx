import { ResumeTab } from '../model/types';

interface StatusBarProps {
    tabs: ResumeTab[];
}

export const StatusBar = ({ tabs }: StatusBarProps) => {
    const total = tabs.length;
    const completed = tabs.filter((tab) => tab.status === 'completed').length;
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

    return (
        <div className="flex flex-col gap-y-2 px-5">
            <div className="h-1 w-full overflow-hidden rounded-full bg-surface/35">
                <div
                    className="h-full bg-mauve transition-all duration-300"
                    style={{ width: `${progress}%` }}
                />
            </div>
            <p className="text-12 text-surface">
                {completed} из {total} шагов
            </p>
        </div>
    );
};
