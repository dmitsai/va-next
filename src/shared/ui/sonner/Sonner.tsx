"use client";

import { Toaster as Sonner } from "sonner";
// import { useTheme } from "next-themes";
import type React from "react";
import { ReactComponent as IconSonnerInfo } from "~/shared/assets/icons/icon-sonner-info.svg";
import { ReactComponent as IconSonnerError } from "~/shared/assets/icons/icon-sonner-error.svg";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => (
  // const { theme = "system" } = useTheme();

  <Sonner
    /* FIXME: fix this, when you start implementing themes */
    theme="dark"
    className="toaster font-jbm group"
    toastOptions={{
      classNames: {
        toast: `group toast group-[.toaster]:right-[1rem] group-[.toaster]:flex group-[.toaster]:bg-base group-[.toaster]:text-text group-[.toaster]:gap-x-[0.75rem] group-[.toaster]:p-[0.75rem] group-[.toaster]:border-[2px] rounded-6 small`,
        description:
          "group-[.toast]:text-sub-secondary/70 group-[.toaster]:text-12",
        error: "border-red",
        info: "border-mauve",
        actionButton:
          "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
        icon: "group-[.toast]:self-start group-[.toast]:translate-y-[2px] group-[.toast]:my-0 group-[.toast]:mx-0 w-fit h-fit",
        closeButton:
          "group-[.toaster]:bg-base group-[.toast]:text-muted-foreground group-[.toast]:border-none group-[.toast]:left-[auto] group-[.toast]:right-[0px] [&>svg]:w-4 [&>svg]:h-4  top-[1rem] text-sub-secondary/70",
      },
    }}
    icons={{
      info: <IconSonnerInfo />,
      error: <IconSonnerError />,
    }}
    {...props}
  />
);
export { Toaster };
