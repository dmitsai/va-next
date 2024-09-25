"use client";

import Toaster from "~/entities/sonner/ui/index";
import { toast } from "sonner";
import IconSonnerInfo from "~/shared/assets/icons/icon-sonner-info.svg";

export default () => (
  <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
    <div className="flex flex-col items-center justify-center">
      <button
        type="button"
        onClick={() => {
          toast("Heads up!", {
            duration: 10000000,
            description: "You can add components to your app using the cli.",
            icon: <IconSonnerInfo />,
            closeButton: true,
          });
        }}
      >
        Test
      </button>
      <Toaster type="info" />
    </div>
  </main>
);
