// FIXME: add view when small size of content
import { headers } from 'next/headers';
import { createSSRHelpers } from 'trpc/helpers';
import { VacancyDescription } from '~/features/vacancyDescription';
import { VacancyHeader } from '~/features/vacancyHeader';
import { CONSTANTS } from '~/shared/lib/strings';

export default async ({ params }: { params: { vacancyId: string } }) => {
  const helpers = await createSSRHelpers(headers());

  const vacancy = await helpers.vacancy.getVacancyItem.fetch({
    vacancyId: params.vacancyId,
  });

  //   FIXME: move to shared/utils
  const getStringifySalary = (
    salaryFrom: string | null,
    salaryTo: string | null,
    salaryCurency: string | null,
  ) => {
    const from = CONSTANTS.detailedVacancy.salary.from;
    const to = CONSTANTS.detailedVacancy.salary.to;
    const currency = salaryCurency ?? CONSTANTS.currency.ruble;
    if (salaryFrom && salaryTo)
      return `${from} ${vacancy.salaryFrom} ${to} ${vacancy.salaryTo} ${currency}`;
    if (salaryFrom) return `${from} ${vacancy.salaryFrom} ${currency}`;
    return CONSTANTS.detailedVacancy.salary.empty;
  };
  return (
    <main className={'flex w-full flex-col gap-y-8'}>
      <VacancyHeader
        company={vacancy.company}
        title={vacancy.title}
        tags={vacancy.tags}
        isFavorited={false}
        isApplied={false}
      />
      <span className={'text-32 font-600'}>
        {/* FIXME: add vacancy currency after update schema */}
        {getStringifySalary(vacancy.salaryFrom, vacancy.salaryTo, null)}
      </span>
      <VacancyDescription description={vacancy.description} />
    </main>
  );
};
