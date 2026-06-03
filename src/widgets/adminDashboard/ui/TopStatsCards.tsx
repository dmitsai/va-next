import type { DashboardStats } from '../model/dashboard';
import { formatDateTime } from '../model/dashboard';

type TopStatsCardsProps = {
    stats: DashboardStats;
    totalVacancies: number;
    totalUsers: number;
};

export const TopStatsCards = ({
    stats,
    totalVacancies,
    totalUsers,
}: TopStatsCardsProps) => {
    const cards = [
        {
            label: 'Вакансий',
            value: totalVacancies.toLocaleString('ru-RU'),
            color: 'text-mauve',
        },
        { label: 'Пользователей', value: totalUsers, color: 'text-blue' },
        {
            label: 'Откликов',
            value: stats.totalApplications,
            color: 'text-green',
        },
        {
            label: 'Последний крон',
            value: stats.lastCronRun
                ? formatDateTime(stats.lastCronRun.startedAt)
                : '—',
            color: 'text-peach',
            small: true,
        },
    ];

    return (
        <div className="grid grid-cols-4 gap-3">
            {cards.map((card) => (
                <div
                    key={card.label}
                    className="flex flex-col gap-y-2 rounded-8 border border-surface-tertiary p-4"
                >
                    <p className="text-14 text-sub">{card.label}</p>
                    <p className={` ${card.color} text-16 font-700`}>
                        {card.value}
                    </p>
                </div>
            ))}
        </div>
    );
};
