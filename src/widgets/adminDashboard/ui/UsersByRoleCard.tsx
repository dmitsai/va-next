import type { DashboardStats } from '../model/dashboard';
import { ROLE_COLORS, ROLE_LABELS } from '../model/dashboard';

type UsersByRoleCardProps = {
    usersByRole: DashboardStats['usersByRole'];
};

export const UsersByRoleCard = ({ usersByRole }: UsersByRoleCardProps) => {
    const gridLines = ['100%', '75%', '50%', '25%'];
    const maxCount = Math.max(...usersByRole.map((row) => row.count), 0);
    const chartMax = maxCount > 0 ? maxCount : 1;
    const roleBarColors: Record<string, string> = {
        ADMIN: 'from-red to-red/60',
        USER: 'from-blue to-blue/60',
        COMPANY: 'from-peach to-peach/60',
        GUEST: 'from-overlay1 to-overlay0',
    };

    return (
        <div className="rounded-8 border border-surface-tertiary">
            <div className="border-b border-surface-tertiary px-4 py-3">
                <p className="text-14">Пользователи по ролям</p>
            </div>
            <div className="p-4">
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
                    {usersByRole.map((row) => {
                        const heightPercent = (row.count / chartMax) * 100;

                        return (
                            <div
                                key={row.role}
                                className="flex min-w-0 flex-1 flex-col items-center"
                            >
                                <span className={`mb-1 text-xs font-medium ${ROLE_COLORS[row.role] ?? 'text-text'}`}>
                                    {row.count}
                                </span>
                                <div className="flex h-28 w-full items-end justify-center">
                                    <div
                                        className={`w-full max-w-12 rounded-t-md bg-gradient-to-t transition-all duration-500 ${roleBarColors[row.role] ?? 'from-subtext0 to-subtext0/60'}`}
                                        style={{
                                            height: `${Math.max(heightPercent, 8)}%`,
                                        }}
                                    />
                                </div>
                                <span className="mt-1 w-full truncate text-center text-xs text-subtext1">
                                    {ROLE_LABELS[row.role] ?? row.role}
                                </span>
                            </div>
                        );
                    })}
                        </div>
                    </div>
                </div>

                <div className="mt-4 rounded-md bg-surface-tertiary/40 p-2 text-xs text-subtext0">
                    Макс:{' '}
                    <span className="font-medium text-text">
                        {maxCount.toLocaleString('ru-RU')}
                    </span>
                </div>
            </div>
        </div>
    );
};
