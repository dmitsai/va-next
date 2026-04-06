import { Search } from '~/widgets/Search';
import { TypingLabel } from '~/features/typingLabel';
import { AuthBlock } from '~/features/authBlock';
import { VacancyList } from '~/widgets/VacancyList/ui/VacancyList';
import { getServerSession } from '~/shared/lib/auth';

export default async () => {
    const session = await getServerSession();
    const isAuth = !!session;

    return (
        <main className="flex flex-col items-center justify-center gap-y-10 bg-base px-4 py-10 md:px-12 lg:px-20">
            <div className="flex h-full min-h-72 w-full flex-row gap-x-16">
                {!isAuth && <TypingLabel />}
                <div className={'flex w-full flex-col gap-y-8'}>
                    <Search />
                    {!isAuth && <AuthBlock />}
                </div>
            </div>
            <div className={'flex h-full w-full flex-col'}>
                <VacancyList />
            </div>
        </main>
    );
};
