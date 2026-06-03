import type { DashboardStats } from '../model/dashboard';

type VacanciesByPlatformCardProps = {
    vacanciesByPlatform: DashboardStats['vacanciesByPlatform'];
};

export const VacanciesByPlatformCard = ({
    vacanciesByPlatform,
}: VacanciesByPlatformCardProps) => {
    const gridLines = ['100%', '75%', '50%', '25%'];
    const maxCount = Math.max(
        ...vacanciesByPlatform.map((row) => row.count),
        0
    );
    const chartMax = maxCount > 0 ? maxCount : 1;

    return (
        <div className="rounded-8 border border-surface-tertiary">
            <div className="border-b border-surface-tertiary px-4 py-3">
                <p className="text-14">Вакансии по платформам</p>
            </div>
            <div className="p-4">
                {vacanciesByPlatform.length === 0 ? (
                    <p className="text-sm text-subtext0">Нет данных</p>
                ) : (
                    <div className="flex flex-col gap-4">
                        <div className="grid h-44 grid-rows-[1fr_auto] gap-2">
                            <div className="relative">
                                <div className="absolute inset-0 grid grid-rows-4">
                                    {gridLines.map((line) => (
                                        <div
                                            key={line}
                                            className="border-b border-dashed border-surface-tertiary/80 last:border-b-0"
                                        />
                                    ))}
                                </div>
                                <div className="relative z-10 flex h-full items-end gap-2">
                                    {vacanciesByPlatform.map((row) => {
                                        const heightPercent =
                                            (row.count / chartMax) * 100;
                                        const shortTitle =
                                            row.platform.title.slice(0, 14);

                                        return (
                                            <div
                                                key={row.platform.platform_id}
                                                className="flex min-w-0 flex-1 flex-col items-center"
                                            >
                                                <span className="text-xs font-medium mb-1 text-mauve">
                                                    {row.count.toLocaleString(
                                                        'ru-RU'
                                                    )}
                                                </span>
                                                <div className="flex h-28 w-full items-end justify-center">
                                                    <div
                                                        className="w-full max-w-12 rounded-t-md bg-gradient-to-t from-mauve to-blue transition-all duration-500"
                                                        style={{
                                                            height: `${Math.max(heightPercent, 8)}%`,
                                                        }}
                                                        title={`${row.platform.title}: ${row.count.toLocaleString('ru-RU')}`}
                                                    />
                                                </div>
                                                <span
                                                    className="text-xs text-subtext1 mt-1 w-full truncate text-center"
                                                    title={row.platform.title}
                                                >
                                                    {shortTitle}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="text-xs text-subtext0 rounded-md bg-surface-tertiary/40 p-2">
                            Макс:{' '}
                            <span className="font-medium text-text">
                                {maxCount.toLocaleString('ru-RU')}
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
