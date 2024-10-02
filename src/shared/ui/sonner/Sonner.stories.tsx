import IconSonnerInfo from "~/shared/assets/icons/icon-sonner-info.svg?url";
import Image from "next/image";

import { toast } from "sonner";
import Toaster from "~/shared/ui/sonner/index";

export default {
  component: Toaster,
  title: "Toaster",
};

export const Info = () => {
  const triggerToast = () => {
    toast.info("Heads up!", {
      duration: 10000000,
      description: "You can add components to your app using the cli.",
      closeButton: true,
    });
  };

  return (
    <div>
      <button type="button" onClick={triggerToast}>
        Trigger Info Toast
      </button>
      <Toaster expand={false} />
    </div>
  );
};

export const Error = () => {
  const triggerToast = () => {
    toast.error("Error!", {
      duration: 10000000,
      description: "Something went wrong.",
      closeButton: true,
    });
  };

  return (
    <div>
      <button type="button" onClick={triggerToast}>
        Trigger Error Toast
      </button>
      <Toaster />
    </div>
  );
};
