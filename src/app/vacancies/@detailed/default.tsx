// vacancies/@detailed/default.tsx
import { redirect } from 'next/navigation';
import { createSSRHelpers } from 'trpc/helpers';
import { headers } from 'next/headers';

export default async function DefaultDetailed() {
  const helpers = await createSSRHelpers(headers());

  const { vacancyList } = await helpers.vacancy.infinityVacancy.fetch({
    limit: 1,
  });

  if (!vacancyList?.[0]?.vacancy_id) {
    return <div className="p-8">Нет доступных вакансий</div>;
  }

  redirect(`/vacancies/${vacancyList[0].vacancy_id}`);
}
