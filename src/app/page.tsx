import { Search } from "~/widgets/Search";
import { TypingLabel } from "~/features/typingLabel";
import { AuthBlock } from "~/features/authBlock";


const isAuth = false;

export default () => (
  <main className="flex min-h-screen flex-col items-center justify-center bg-base px-20 pt-10">
    <div className="flex flex-row w-full gap-x-16" >
      {isAuth && <TypingLabel />}
      <div className={'flex flex-col gap-y-8 w-full'}>
        <Search />
        {isAuth && <AuthBlock />}
      </div>
    </div>
    <div className={'flex flex-col w-full h-full'}>
      {'FRESH VACANCIES'}
    </div>
  </main>
);