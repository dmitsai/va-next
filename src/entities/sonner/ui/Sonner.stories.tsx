import Toaster from "~/entities/sonner/ui/index";
import IconSonnerInfo from "~/shared/assets/icons/icon-sonner-info.svg?url";
import { toast } from "sonner";

export default {
  component: Toaster,
  title: "Toaster",
};

export const Info = () => {
  // Создаем кнопку
  const triggerToast = () => {
    // Запускаем функцию toast с нужными параметрами
    toast("Heads up!", {
      duration: 10000000,
      description: "You can add components to your app using the cli.",
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      icon: IconSonnerInfo,
      closeButton: true,
    });
  };

  // Возвращаем разметку
  return (
    <div>
      <button type="button" onClick={triggerToast}>
        Trigger Info Toast
      </button>
      <Toaster type="info" />
    </div>
  );
};

// export const Error = () => {
//   // Создаем кнопку
//   const triggerToast = () => {
//     // Запускаем функцию toast с нужными параметрами
//     toast("Error!", {
//       duration: 10000000,
//       description: "Something went wrong.",
//       type: "error",
//       icon: <IconSonnerError />,
//       closeButton: true,
//     });
//   };

//   // Возвращаем разметку
//   return (
//     <div>
//       <button onClick={triggerToast}>Trigger Error Toast</button>
//       <Toaster type="error" />
//     </div>
//   );
// };
