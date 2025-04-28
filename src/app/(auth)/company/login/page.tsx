"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Control, FieldValues, useForm } from "react-hook-form";
import { ButtonView } from "~/shared/ui/Button";
import { Button } from "~/shared/ui/Button/Button";
import EmailInput, { emailSchema } from "~/shared/ui/EmailInput";
import { CONSTANTS } from "~/shared/lib/strings";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export interface LoginFormData {
  email: string;
}

const formSchema = z.object({
  email: emailSchema,
});

const LoginPage = () => {
  const router = useRouter();

  const { 
    control, 
    handleSubmit, 
    trigger, 
    formState
  } = useForm<LoginFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
    mode: "onSubmit",
  });

  const onSubmit = async () => {
    const isValid = await trigger();

    if (isValid) {
      router.push("/company/login/password");
    }
  };

  return (
    <div className={`flex h-screen`}>
      <div className={`w-1/2 bg-teal`}>
        <p className={`absolute left-10 top-8 text-base`}>
          {CONSTANTS.topBar.placeholder}
        </p>
      </div>
      <div className={`w-1/2 bg-base`}>
        <div className={`h-screen flex flex-col items-center justify-center gap-y-5`}>
          <div className={`flex flex-col items-center justify-center gap-y-7`}>
            <h1 className={`text-text`}>{CONSTANTS.auth.lable.logIn}</h1>
            <p className={`text-16 text-text`}>{CONSTANTS.auth.enterEmail}</p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className={`flex flex-col gap-y-6`} noValidate>
              <EmailInput
                control={control as unknown as Control<FieldValues>}
                name={"email"}
              />
              <Button
                type="submit"
                buttonView={ButtonView.LARGE}
                className={`w-88 rounded-md bg-teal text-base hover:bg-text disabled:opacity-50`} 
                disabled={!!formState.errors.email} 
              >
                {CONSTANTS.auth.logIn}
              </Button>
              <div className="relative flex items-center before:content-[''] before:flex-grow before:border-t before:border-gray-300 after:content-[''] after:flex-grow after:border-t after:border-gray-300">
                <span className="mx-4">{CONSTANTS.auth.continue}</span>
              </div>
              <Link href="/user/login"> 
                <Button
                  type="submit"
                  buttonView={ButtonView.LARGE}
                  className={`w-88 rounded-md bg-mantle text-text hover:bg-text`} 
                >
                  {CONSTANTS.auth.user}
                </Button>
              </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;