'use client';

import SearchInput from '~/shared/ui/SearchInput';
import { useForm } from "react-hook-form";
import EmailInput from '~/shared/ui/EmailInput';
import PasswordInput from '~/shared/ui/PasswordInput';

export default () => {

  const { handleSubmit, control } = useForm({
    defaultValues: {
      search: '',
      email: '',
      password: '',
    }
  })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = (data: any) => {
    alert(JSON.stringify(data));
  };
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
      <div className="flex flex-col items-center justify-center">
        <form onSubmit={handleSubmit(onSubmit)} noValidate className='flex flex-col gap-y-5 w-full'>
          {/* @ts-ignore */}
          <SearchInput name='search' control={control} />
          {/* @ts-ignore */}
          <EmailInput name='email' control={control} />
          {/* @ts-ignore */}
          <PasswordInput name='password' control={control} />


        </form>
      </div>
    </main>
  )
};
