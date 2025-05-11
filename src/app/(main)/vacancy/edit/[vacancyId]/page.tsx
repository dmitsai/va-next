import { createSSRHelpers } from 'trpc/helpers';
import { VacancyLabel } from '~/entities/vacancyLabel';
import { VacancyForm } from '~/widgets/vacancyForm';
import { headers } from 'next/headers';
import {
    getStringifySalary,
    getStringifySalaryForInput,
} from '~/shared/lib/strings';

export default async ({ params }: { params: { vacancyId: string } }) => {
    const helpers = await createSSRHelpers(headers());
    const vacancy = await helpers.vacancy.getVacancyItem.fetch({
        vacancyId: params.vacancyId,
    });
    const salaryFrom = getStringifySalaryForInput(vacancy.salaryFrom);
    const salaryTo = getStringifySalaryForInput(vacancy.salaryTo);
    return (
        <div className={'flex flex-col gap-y-10'}>
            <VacancyLabel mode={'edit'} vacancyTitle={vacancy.title} />
            <VacancyForm
                mode={'edit'}
                title={vacancy.title}
                description={vacancy.description}
                salaryFrom={salaryFrom}
                salaryTo={salaryTo}
                initialTags={vacancy.tags}
                vacancyId={vacancy.vacancy_id}
            />
        </div>
    );
};
