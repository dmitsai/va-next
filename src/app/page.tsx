"use client";

import { useEffect } from "react";
import Toaster from "~/entities/sonner/ui/index";
import { toast } from "sonner";

export default () => {
  useEffect(() => {
    toast("Error", {
      duration: 10000,
      id: "test-id",
    });
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center text-black">
      <div className="flex flex-col items-center justify-center">
        <Toaster type="error" />
      </div>
    </main>
  );
};
