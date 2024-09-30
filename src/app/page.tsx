'use client';

import { useState } from "react";
import { Select } from "~/shared/ui/Select";

export default () => {
  const state = ['1', '2']
  const [s, S] = useState(state[0])
  return (<main className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
    <div className="flex flex-col items-center justify-center" />
    <Select setSelected={S} selected={s} state={state} />
  </main>)
};