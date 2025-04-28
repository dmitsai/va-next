"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Control, FieldValues, useForm } from "react-hook-form";
import { ButtonView } from "~/shared/ui/Button";
import { Button } from "~/shared/ui/Button/Button";
import TextInput, { codeSchema } from "~/shared/ui/TextInput";
import { CONSTANTS } from "~/shared/lib/strings";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReactComponent as BackIcon } from "~/shared/assets/icons/icon-back.svg";
import { ReactComponent as MailIcon } from "~/shared/assets/icons/icon-mail.svg"
  
export interface LoginPasswordFormData {
  code: string;
}

const formSchema = z.object({
  code: codeSchema,
});

const LoginPasswordPage = () => {
  const router = useRouter();

  const { control, handleSubmit, trigger, formState } = useForm<LoginPasswordFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
    },
    mode: "onSubmit",
  });

  const onSubmit = async () => {
    const isValid = await trigger();

    if (isValid) {
      router.push("/auth/password");
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
          <Link className={`absolute right-10 top-8`} href="/login">
            <Button
              type="button"
              buttonView={ButtonView.LARGE}
              className={`bg-mantle text-text hover:bg-text hover:text-base`}
            >
              {CONSTANTS.auth.logIn}
            </Button>
          </Link>
          <Link className={`absolute left-10 top-8`} href="/auth">
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
            <p className={`text-16 text-text`}>{CONSTANTS.auth.lable.code}</p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className={`flex flex-col gap-y-6`} noValidate>
              <TextInput
                control={control as unknown as Control<FieldValues>}
                name={"code"} placeholder={"code"}/>
              <Button
                type="submit"
                buttonView={ButtonView.LARGE}
                className={`w-88 rounded-md bg-mauve text-base hover:bg-text`}
              >
                {CONSTANTS.auth.signUp}
              </Button>
              <Button
                type="submit"
                buttonView={ButtonView.LARGE}
                className={`w-88 rounded-md bg-mantle text-text hover:bg-text hover:text-base group disabled:opacity-50`} 
                disabled={!!formState.errors.code} 
              >
                <MailIcon className={`fill-text group-hover:fill-base`}/>
                {CONSTANTS.auth.code}
              </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPasswordPage;
