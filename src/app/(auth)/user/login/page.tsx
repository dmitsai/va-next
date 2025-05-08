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
import PasswordInput, { passwordSchema } from "~/shared/ui/PasswordInput";
import { signIn } from "next-auth/react";
import { ReactComponent as SpinIcon } from "~/shared/assets/icons/spin.svg";
import { Roles } from "@prisma/client";

export interface LoginFormData {
  email: string;
  password: string;
}

const formSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

const LoginPage = () => {
  const router = useRouter();

  const { 
    control, 
    handleSubmit, 
    formState: { errors, isSubmitting },
    setError: setFormError
  } = useForm<LoginFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onSubmit",
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
        role: Roles.USER 
      });
  
      if (result?.error) {
        if (result.error === 'COMPANY_ACCOUNT') {
          setFormError('root', {
            type: 'manual',
            message: 'Это аккаунт компании.'
          });
        } else {
          setFormError('root', {
            type: 'manual',
            message: result.error === 'CredentialsSignin' 
              ? 'Неверный email или пароль' 
              : result.error
          });
        }
      } else {
        router.push("/");
      }
    } catch (err) {
      setFormError('root', {
        type: 'manual',
        message: 'Произошла ошибка при входе'
      });
    }
  };

  return (
    <div className={`flex h-screen`}>
      <div className={`w-1/2 bg-mauve`}>
        <Link className={`absolute left-10 text-16 top-10 text-base`} href="/">
          {CONSTANTS.topBar.placeholder}
        </Link>
      </div>
      <div className={`w-1/2 bg-base`}>
        <Link className={`absolute right-10 top-10`} href="/user/auth">
          <Button
            type="button"
            buttonView={ButtonView.LARGE}
            className={`bg-mantle text-text hover:bg-text hover:text-base`}
          >
            {CONSTANTS.auth.signUp}
          </Button>
        </Link>
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
            <PasswordInput
              control={control as unknown as Control<FieldValues>}
              name={"password"}
            />
            {errors.root && (
              <div className="text-red flex items-center justify-center text-16">
                {errors.root.message}
              </div>
            )}
            <Button
              type="submit"
              buttonView={ButtonView.LARGE}
              className={`w-88 rounded-md bg-mauve text-base hover:bg-text disabled:opacity-50`} 
              disabled={isSubmitting || !!errors.email || !!errors.password}
            >
              {isSubmitting ? 
                <div className="flex gap-2">
                  <SpinIcon className="mt-1 animate-spin" />
                  {CONSTANTS.auth.logIn}
                </div>
                : CONSTANTS.auth.logIn}
            </Button>
            <div className="relative flex items-center before:content-[''] before:flex-grow before:border-t before:border-text after:content-[''] after:flex-grow after:border-t after:border-text">
              <span className="mx-4 text-text">{CONSTANTS.auth.continue}</span>
            </div>
            <Link href="/company/login"> 
              <Button
                type="button"
                buttonView={ButtonView.LARGE}
                className={`w-88 rounded-md bg-mantle text-text hover:bg-text hover:text-base`} 
              >
                {CONSTANTS.auth.company}
              </Button>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;