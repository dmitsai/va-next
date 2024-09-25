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
      className="toaster font-jbm group"
      toastOptions={{
        classNames: {
          toast: `group toast group-[.toaster]:right-[1rem] group-[.toaster]:bg-base-dark group-[.toaster]:text-text-dark group-[.toaster]:gap-[0.75rem] group-[.toaster]:p-[0.75rem] group-[.toaster]:border-[2px] rounded-6 small ${type === "error" ? "border-red-dark" : "border-mauve-dark"}`,
          description:
            "group-[.toast]:text-sub-secondary-dark/70 group-[.toaster]:text-12",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          icon: "group-[.toast]:self-start group-[.toast]:translate-y-[2px] group-[.toast]:my-0 group-[.toast]:mx-0",
          closeButton:
            "group-[.toaster]:bg-base-dark group-[.toast]:text-muted-foreground group-[.toast]:border-none group-[.toast]:left-[auto] group-[.toast]:right-[0px] [&>svg]:w-4 [&>svg]:h-4  top-[10px]",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
