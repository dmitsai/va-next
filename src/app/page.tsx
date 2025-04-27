"use client";

import { Search } from "~/widgets/Search";
import { TypingLabel } from "~/features/typingLabel";
import { AuthBlock } from "~/features/authBlock";
import { VacancyList } from "~/widgets/VacancyList/ui/VacancyList";
import { Suspense, useEffect } from "react";
import { createSSRHelpers } from "trpc/helpers";
import { headers } from "next/headers";
import { clientApi } from "trpc/client";

const isAuth = false;

export default () => (
  // const { mutate } = clientApi.vacancy.createVacancy.useMutation();
  // const created = mutate({
  //   title: "test-vacancy",
  //   description: "test-description",
  // });

  <Suspense>
    <main className="flex flex-col items-center justify-center gap-y-10 bg-base px-20 py-10">
      <div className="flex h-full min-h-72 w-full flex-row gap-x-16">
        {/* {isSuccess && data.title} */}
        {!isAuth && <TypingLabel />}
        <div className={"flex w-full flex-col gap-y-8"}>
          <Search />
          {!isAuth && <AuthBlock />}
        </div>
      </div>
      <div className={"flex h-full w-full flex-col"}>
        <VacancyList />
      </div>
    </main>
  </Suspense>
);
