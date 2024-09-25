import { type ExternalToast, toast } from "sonner";
import { type ReactNode } from "react";
import { Toaster } from "./Sonner";
import IconSonnerInfo from "~/shared/assets/icons/icon-sonner-info.svg";
import IconSonnerError from "~/shared/assets/icons/icon-sonner-error.svg";



export type ToastFunc = {
  msg: string;
  duration: number;
  description: string;
  icon: ReactNode;
  closeButton: boolean;
  props: ExternalToast | undefined;
};

export const toastError = ({
  msg,
  duration,
  description,
  closeButton,
  props,
}: ToastFunc) => {
  toast(msg, {
    duration: 10000000,
    description: "You can add components to your app using the cli.",
    icon: <IconSonnerInfo/>,
    closeButton: true,
  });
};

export default Toaster;
