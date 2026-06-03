import { headers } from 'next/headers';
import { createSSRHelpers } from 'trpc/helpers';

export const dynamic = 'force-dynamic';

const ROLE_LABELS: Record<string, string> = {
    ADMIN: 'Админ',
    USER: 'Кандидат',
    COMPANY: 'Компания',
    GUEST: 'Гость',
};

const ROLE_STYLES: Record<string, string> = {
    ADMIN: 'bg-red/10 text-red',
    USER: 'bg-blue/10 text-blue',
    COMPANY: 'bg-peach/10 text-peach',
    GUEST: 'bg-surface1 text-subtext0',
};

const gridCols = 'grid-cols-[2fr_0.8fr_1.4fr_0.5fr_1.4fr]';

const UsersPage = async ({
    searchParams,
}: {
    searchParams: { role?: string; page?: string };
}) => {
    const role = searchParams.role ?? '';
    const page = Math.max(0, Number(searchParams.page ?? 0));
    const pageSize = 30;

    const helpers = await createSSRHelpers(headers());
    const [data, totals] = await Promise.all([
        helpers.admin.getUsers.fetch({ page, pageSize, role: role || undefined }),
        helpers.admin.getUsers.fetch({ page: 0, pageSize: 1 }),
    ]);

    const totalPages = Math.ceil(data.total / pageSize);

    return (
        <div className="flex flex-col gap-5">
            {/* Heading */}
            <div>
                <h2 className="text-24 font-700">Пользователи</h2>
                <p className="mt-0.5 text-14 text-sub">
                    Всего зарегистрировано:{' '}
                    <span className="text-text">{totals.total}</span>
                </p>
            </div>

            {/* Role tabs */}
            <div className="flex gap-0.5 rounded-6 border border-surface-tertiary bg-mantle p-0.5 w-fit">
                {[
                    { value: '', label: 'Все' },
                    { value: 'USER', label: 'Кандидаты' },
                    { value: 'COMPANY', label: 'Компании' },
                    { value: 'ADMIN', label: 'Админы' },
                ].map((opt) => (
                    <a
                        key={opt.value}
                        href={`/admin/users?role=${opt.value}&page=0`}
                        className={`rounded-6 px-3 py-1 text-12 font-500 transition-colors ${
                            role === opt.value
                                ? 'bg-base text-text shadow-sm'
                                : 'text-sub hover:text-text'
                        }`}
                    >
                        {opt.label}
                    </a>
                ))}
            </div>

            {/* Table */}
            <div className="rounded-8 border border-surface-tertiary">
                {/* Toolbar */}
                <div className="border-b border-surface-tertiary px-4 py-2.5">
                    <p className="text-12 text-sub">
                        <span className="font-700 text-text">{data.users.length}</span>
                        {' '}из{' '}
                        <span className="text-text">{data.total}</span>
                    </p>
                </div>

                {data.users.length === 0 ? (
                    <p className="py-10 text-center text-12 text-sub">Пользователей нет</p>
                ) : (
                    <div
                        className="min-h-0 overflow-auto overscroll-contain [scrollbar-gutter:stable]"
                        style={{ maxHeight: 'min(76vh, calc(100dvh - 18rem))' }}
                    >
                        <div className="w-max min-w-full">
                            {/* Sticky header */}
                            <div
                                className={`sticky top-0 z-20 grid ${gridCols} gap-2 border-b border-surface-tertiary bg-base px-4 py-2.5 text-12 font-500 text-sub shadow-sm`}
                            >
                                <span>Email</span>
                                <span>Роль</span>
                                <span>Имя / Компания</span>
                                <span className="text-center">Отклики</span>
                                <span>Контакт</span>
                            </div>

                            {/* Rows */}
                            <div className="divide-y divide-surface-tertiary">
                                {data.users.map((user) => {
                                    const profile = user.ClientProfile;
                                    const company = user.CompanyProfile;
                                    const applicationsCount = user._count.Application;
                                    const displayName =
                                        profile
                                            ? [profile.name, profile.surname].filter(Boolean).join(' ') || '—'
                                            : company?.title ?? '—';
                                    const contactEmail = profile?.email ?? company?.email ?? '—';

                                    return (
                                        <div
                                            key={user.user_id}
                                            className={`grid ${gridCols} items-center gap-2 px-4 py-2 text-12 transition-colors hover:bg-surface0/30`}
                                        >
                                            <span className="block max-w-[220px] truncate text-text" title={user.email}>
                                                {user.email}
                                            </span>
                                            <span>
                                                <span
                                                    className={`rounded-6 px-1.5 py-0.5 text-11 font-500 ${ROLE_STYLES[user.role] ?? 'bg-surface1 text-sub'}`}
                                                >
                                                    {ROLE_LABELS[user.role] ?? user.role}
                                                </span>
                                            </span>
                                            <span className="block max-w-[180px] truncate text-subtext1" title={displayName}>
                                                {displayName}
                                            </span>
                                            <div className="flex justify-center">
                                                {applicationsCount > 0 ? (
                                                    <span className="rounded-full bg-green/10 px-1.5 py-0.5 text-11 font-500 text-green">
                                                        {applicationsCount}
                                                    </span>
                                                ) : (
                                                    <span className="text-11 text-overlay0">0</span>
                                                )}
                                            </div>
                                            <span className="block max-w-[180px] truncate text-sub" title={contactEmail}>
                                                {contactEmail}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 border-t border-surface-tertiary px-4 py-2.5">
                        <a
                            href={`/admin/users?role=${role}&page=${Math.max(0, page - 1)}`}
                            className={`rounded-6 border border-surface-tertiary px-2.5 py-1 text-12 text-sub transition hover:border-mauve hover:text-mauve ${page === 0 ? 'pointer-events-none opacity-40' : ''}`}
                        >←</a>
                        <span className="text-12 text-sub">{page + 1} / {totalPages}</span>
                        <a
                            href={`/admin/users?role=${role}&page=${Math.min(totalPages - 1, page + 1)}`}
                            className={`rounded-6 border border-surface-tertiary px-2.5 py-1 text-12 text-sub transition hover:border-mauve hover:text-mauve ${page >= totalPages - 1 ? 'pointer-events-none opacity-40' : ''}`}
                        >→</a>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UsersPage;
