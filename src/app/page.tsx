import { Search } from "~/widgets/Search";
import { TypingLabel } from "~/features/typingLabel";
import { AuthBlock } from "~/features/authBlock";
import { VacancyList } from "~/widgets/VacancyList/ui/VacancyList";
import { Suspense } from "react";

const isAuth = false;

export default () => (
  <Suspense>
    <main className="flex flex-col items-center justify-center bg-base px-20 py-10 gap-y-10">
      <div className="flex flex-row w-full gap-x-16 h-full min-h-72" >
        {!isAuth && <TypingLabel />}
        <div className={'flex flex-col gap-y-8 w-full'}>
          <Search />
          {!isAuth && <AuthBlock />}
        </div>
      </div>
      <div className={'flex flex-col w-full h-full'}>
        <VacancyList />
      </div>
    </main>
  </Suspense>

);