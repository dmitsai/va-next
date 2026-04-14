'use client';

import { clientApi } from 'trpc/client';
import type { RouterOutputs } from 'trpc/shared';
import { ApplicationRow } from './ApplicationRow';

type Application =
    RouterOutputs['application']['getMyApplications']['applications'][number];

interface Props {
    initialApplications: Application[];
}

export const ApplicationsWidgetClient = ({ initialApplications }: Props) => {
    const { data } = clientApi.application.getMyApplications.useQuery(
        { limit: 3 },
        {
            initialData: {
                applications: initialApplications,
                nextCursor: undefined,
            },
        }
    );

    const applications = data?.applications ?? initialApplications;

    return (
        <div className="flex w-full flex-col gap-y-2">
            {applications.map((app) => (
                <ApplicationRow key={app.application_id} application={app} />
            ))}
        </div>
    );
};
