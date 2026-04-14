import { headers } from 'next/headers';
import { createSSRHelpers } from 'trpc/helpers';
import {
    DashboardHeader,
    RecentImportsCard,
    TopStatsCards,
    UsersByRoleCard,
    VacanciesByPlatformCard,
} from '~/widgets/adminDashboard';

export const dynamic = 'force-dynamic';

const DashboardPage = async () => {
    const helpers = await createSSRHelpers(headers());
    const stats = await helpers.admin.getStats.fetch();

    const totalVacancies = stats.vacanciesByPlatform.reduce(
        (s, p) => s + p.count,
        0
    );
    const totalUsers = stats.usersByRole.reduce((s, r) => s + r.count, 0);

    return (
        <div className="flex flex-col gap-6">
            <DashboardHeader />
            <TopStatsCards
                stats={stats}
                totalVacancies={totalVacancies}
                totalUsers={totalUsers}
            />

            <div className="grid grid-cols-2 gap-4">
                <VacanciesByPlatformCard
                    vacanciesByPlatform={stats.vacanciesByPlatform}
                />
                <UsersByRoleCard usersByRole={stats.usersByRole} />
            </div>
            <RecentImportsCard recentImports={stats.recentImports} />
        </div>
    );
};

export default DashboardPage;
