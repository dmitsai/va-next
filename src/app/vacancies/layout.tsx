import React from 'react';
import { Search } from '~/widgets/Search';
import DefailtList from './@list/default';

export default ({
  detailed,
  list,
}: Readonly<{
  detailed: React.ReactNode;
  list: React.ReactNode;
}>) => (
  <main className={'relative flex w-full flex-col gap-y-10 px-20 py-10'}>
    <Search />
    <div className={'flex w-full flex-row gap-x-10'}>
      {list}
      {detailed}
    </div>
  </main>
);
