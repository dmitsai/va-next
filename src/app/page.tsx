"use client";

import Toaster from "~/shared/ui/sonner/index";
import { toast } from "sonner";

export default () => (
  <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
    <div className="flex flex-col items-center justify-center">
      <button
        type="button"
        onClick={() => {
          toast.info("Heads up!", {
            duration: 10000000,
            description: "You can add components to your app using the cli.",
            closeButton: true,
          });
        }}
      >
        Test
      </button>
      <Toaster />
    </div>
  </main>
);
