'use client';

import { FilterMenu } from "~/entities/filterMenu";

export default () => (
  <main className="flex min-h-screen flex-col items-center justify-center bg-base">
    <div className="flex flex-col items-center justify-center">
      <FilterMenu clearOnClick={() => { console.log('CLEAR') }} searchOnClick={() => { console.log('SEARCH') }} >
        <div className={'bg-green/80 h-[370px]'} />
      </FilterMenu>
    </div>
  </main>
);