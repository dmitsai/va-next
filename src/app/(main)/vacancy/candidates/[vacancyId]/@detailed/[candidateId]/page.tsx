export default async ({
    params,
}: {
    params: { vacancyId: string; candidateId: string };
}) => <p>{`Вакансия: ${params.vacancyId} кандидат: ${params.candidateId}`}</p>;
