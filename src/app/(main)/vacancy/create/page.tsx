import { VacancyLabel } from '~/entities/vacancyLabel';
import { VacancyForm } from '~/widgets/vacancyForm';

export default () => (
    <div className={'flex flex-col gap-y-10'}>
        <VacancyLabel mode={'create'} />
        <VacancyForm mode={'create'} />
    </div>
);
