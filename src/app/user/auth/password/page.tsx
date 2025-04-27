"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Control, FieldValues, useForm } from "react-hook-form";
import { ButtonView } from "~/shared/ui/Button";
import { Button } from "~/shared/ui/Button/Button";
import PasswordInput, { passwordSchema } from "~/shared/ui/PasswordInput";
import { CONSTANTS } from "~/shared/lib/strings";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReactComponent as BackIcon } from "~/shared/assets/icons/icon-back.svg";

export interface LoginPasswordFormData {
  password: string;
  password2: string;
}

const formSchema = z.object({
  password: passwordSchema,
  password2: passwordSchema,
}).refine((data) => data.password === data.password2, {
  message: "Пароли не совпадают",
  path: ["password2"],
});

const LoginPasswordPage = () => {
  const router = useRouter();

  const { control, handleSubmit, trigger, formState: { errors } } = useForm<LoginPasswordFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      password2: "",
    },
    mode: "onSubmit",
  });

  const onSubmit = async () => {
    const isValid = await trigger();

    if (isValid) {
      router.push("/user/auth/resume");
    }
  };

  return (
    <div className={`flex h-screen`}>
      <div className={`w-1/2 bg-mauve relative`}>
        <p className={`absolute left-10 top-8 text-base`}>
          {CONSTANTS.topBar.placeholder}
        </p>
      </div>
      <div className={`w-1/2 relative bg-base`}>
          <Link className={`absolute right-10 top-8`} href="/user/login">
            <Button
              type="button"
              buttonView={ButtonView.LARGE}
              className={`bg-mantle text-text hover:bg-text hover:text-base`}
            >
              {CONSTANTS.auth.logIn}
            </Button>
          </Link>
          <Link className={`absolute left-10 top-8`} href="/user/auth">
            <Button
              type="button"
              buttonView={ButtonView.LARGE}
              className={`bg-mantle text-text hover:bg-text group`}
            >
              <BackIcon className={`fill-text group-hover:fill-base`} />
            </Button>
          </Link>
        <div className={`h-screen flex flex-col items-center justify-center gap-y-5`}>
          <div className={`flex flex-col items-center justify-center gap-y-7`}>
            <h1 className={`text-text`}>{CONSTANTS.auth.lable.signUp}</h1>
            <p className={`text-16 text-text`}>{CONSTANTS.auth.enterPassword}</p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className={`flex flex-col gap-y-6`} noValidate>
              <PasswordInput
                control={control as unknown as Control<FieldValues>}
                name={"password"}
              />
              <PasswordInput
                control={control as unknown as Control<FieldValues>}
                name={"password2"}
                aria-errormessage={errors.password2?.message}
              />
              <Button
                type="submit"
                buttonView={ButtonView.LARGE}
                className={`w-88 rounded-md bg-mauve text-base hover:bg-text`}
              >
                {CONSTANTS.auth.signUp}
              </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPasswordPage;