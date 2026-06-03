import { headers } from 'next/headers';
import { createSSRHelpers } from 'trpc/helpers';
import Link from 'next/link';
import { ApplicationsWidgetClient } from './ApplicationsWidgetClient';

const PREVIEW_LIMIT = 3;

export const ApplicationsWidget = async () => {
    const helpers = await createSSRHelpers(headers());

    let data;
    try {
        data = await helpers.application.getMyApplications.fetch({ limit: PREVIEW_LIMIT });
    } catch {
        return null;
    }

    const { applications } = data;

    return (
        <div className="flex w-full flex-col gap-y-3">
            <div className="flex w-full flex-row items-center justify-between">
                <p className="text-16 font-600 text-text">Отклики</p>
                {applications.length > 0 && (
                    <Link
                        href="/applications"
                        className="text-14 text-sub-secondary/70 transition-colors hover:text-mauve"
                    >
                        Все отклики →
                    </Link>
                )}
            </div>

            {applications.length === 0 ? (
                <div className="flex w-full flex-col items-center gap-y-3 rounded-8 border border-surface-secondary bg-mantle py-8 text-center">
                    <p className="text-14 text-sub-secondary/70">Откликов пока нет</p>
                    <Link
                        href="/vacancies"
                        className="text-14 font-500 text-mauve transition-colors hover:text-text"
                    >
                        Найти вакансии →
                    </Link>
                </div>
            ) : (
                <ApplicationsWidgetClient initialApplications={applications} />
            )}
        </div>
    );
};
