"use client";

import { useEffect } from "react";
import IconSonnerError from "~/shared/assets/icons/icon-sonner-error.svg?url";

export default () => {
  useEffect(() => console.log(IconSonnerError), []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
      <div className="flex flex-col items-center justify-center" />
    </main>
  );
};
