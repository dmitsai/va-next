"use client";

import { Toaster as Sonner } from "sonner";
import { useTheme } from "next-themes";
import type React from "react";

type ToasterProps = React.ComponentProps<typeof Sonner>;

interface IToaster {
  type: "error" | "info";
}

const Toaster = ({ type, ...props }: ToasterProps & IToaster) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: `group toast group-[.toaster]:bg-base-dark group-[.toaster]:text-text-dark group-[.toaster]:p-[0.75rem] rounded-6 small ${type === "error" ? "border-red-dark" : "border-mauve-dark"}`,
          description:
            "group-[.toast]:text-sub-secondary-dark/70 group-[.toaster]:text-12",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          icon: "group-[.toast]:self-start group-[.toast]:translate-y-1 group-[.toast]:translate-x-1",
          closeButton:
            "group-[.toaster]:bg-base-dark group-[.toast]:text-muted-foreground group-[.toast]:border-none group-[.toast]:left-0 group-[.toast]:right-[10px]",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
