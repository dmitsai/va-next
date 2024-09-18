"use client";

import { useEffect } from "react";
import Toaster from "~/entities/sonner/ui/index";
import { toast } from "sonner";
import IconSonnerInfo from "~/shared/assets/icons/icon-sonner-info.svg";

export default () => {
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    toast("Error", {
      duration: 10000000,
      description: "Your session has expired. Please log in again.  ",
      icon: <IconSonnerInfo />,
      closeButton: true,
    });
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black text-black">
      <div className="flex flex-col items-center justify-center">
        <Toaster type="info" />
      </div>
    </main>
  );
};
