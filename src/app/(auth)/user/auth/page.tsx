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

export interface SignUpFormData {
  email: string;
  password: string;
  password2: string;
}

const formSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    password2: passwordSchema,
  })
  .refine((data) => data.password === data.password2, {
    message: "Пароли не совпадают",
    path: ["password2"],
  });

const SignUpPage = () => {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError: setFormError,
  } = useForm<SignUpFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      password2: "",
    },
    mode: "onSubmit",
  });

  const onSubmit = async (data: SignUpFormData) => {
    try {
      const res = await fetch("/api/signUp/viaEmail/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          provider: "credentials",
          data: {
            email: data.email,
            password: data.password,
          },
        }),
      });

      if (!res.ok) {
        if (res.status === 409) {
          setFormError('root', {
            type: 'manual',
            message: 'Пользователь с такой почтой уже существует'
          });
          return;
        }
        throw new Error("Ошибка регистрации");
      }

      const result = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      router.push("/user/auth/resume");
    } catch (err) {
      setFormError('root', {
        type: 'manual',
        message: err instanceof Error ? err.message : "Неизвестная ошибка"
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
        <Link className={`absolute right-10 top-10`} href="/user/login">
          <Button
            type="button"
            buttonView={ButtonView.LARGE}
            className={`bg-mantle text-text hover:bg-text hover:text-base`}
          >
            {CONSTANTS.auth.logIn}
          </Button>
        </Link>
        <div className={`flex h-screen flex-col items-center justify-center gap-y-5`}>
          <div className={`flex flex-col items-center justify-center gap-y-7`}>
            <h1 className={`text-text`}>{CONSTANTS.auth.lable.signUp}</h1>
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
            <PasswordInput
              placeholder="Confirm password"
              control={control as unknown as Control<FieldValues>}
              name={"password2"}
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
              disabled={isSubmitting || !!errors.email || !!errors.password || !!errors.password2}
            >
              {isSubmitting ? 
                <div className="flex gap-2">
                  <SpinIcon className="mt-1 animate-spin" />
                  {CONSTANTS.auth.signUp}
                </div>
                : CONSTANTS.auth.signUp}
            </Button>
            <div className="relative flex items-center before:flex-grow before:border-t before:border-text before:content-[''] after:flex-grow after:border-t after:border-text after:content-['']">
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

export default SignUpPage;