"use client";

import { Toaster as Sonner } from "sonner";
import { useTheme } from "next-themes";
import type React from "react";

type ToasterProps = React.ComponentProps<typeof Sonner>;

interface IToaster {
  type: "error" | "info";
}

const Toaster = ({ ...props }: ToasterProps & IToaster) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-base-dark group-[.toaster]:text-foreground group-[.toaster]:shadow-lg small",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
