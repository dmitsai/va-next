import type React from "react";
import { ButtonView } from "../shared/ui/Button";
import { Button } from "../shared/ui/Button/Button";
import { EmailInput } from "../shared/ui/EmailInput/EmailInput";
import { Control, FieldValues } from "react-hook-form"

interface SignInProps {
  control?: Control<FieldValues>; 
  onSubmit?: () => void;
  onGoogleAuth?: () => void;
  loading?: boolean;
}

export const SignIn: React.FC<SignInProps> = ({ 
  control, 
  onSubmit, 
  onGoogleAuth,
  loading = false 
}) => (
  <div className="flex h-screen">
    <div className="bg-mauveLight w-1/2 flex pt-10 pl-10">
      <p>vakansiy.net</p>
    </div>
    
    <div className="bg-white w-1/2 flex flex-col items-center justify-center">
      <h1 className="text-2xl text-gray-600 font-bold mb-6">Sign Up</h1>
      
      <form onSubmit={onSubmit} className="w-full max-w-xs ">
        <div className="mb-4">
          <p className="text-[16px] text-gray-600 mb-8">Enter your email below to Sign up</p>
          {control ? (
            <EmailInput 
              name="email"
              control={control}
            />
          ) : (
            <input
              type="email"
              className="w-full bg-mantleLight p-2 rounded-md"
              placeholder="name@example.com"
            />
          )}
        </div>
        
        <Button 
          type="submit"
          buttonView={ButtonView.LARGE}
          className="w-full bg-mauveLight text-white py-2 rounded-md mb-4 hover:bg-gray-800 transition"
          disabled={loading}
        >
          {loading ? 'Загрузка...' : 'Sign up with email'}
        </Button>
        
        <div className="flex items-center mb-4">
          <div className="flex-grow border-t border-gray-300" />
          <span className="mx-4 text-sm text-gray-500">OR CONTINUE WITH</span>
          <div className="flex-grow border-t border-gray-300" />
        </div>
        
        <Button 
          buttonView={ButtonView.LARGE}
          className="w-full bg-mantleLight py-2 rounded-md flex items-center justify-center hover:bg-gray-50 transition"
          onClick={onGoogleAuth}
          disabled={loading}
        >
          <p className="text-gray-600">Google</p>
        </Button>
        
        <p className="text-[14px] text-gray-500 mt-6 text-center">
        By clicking continue, you agree to our <a href="#" className="underline">Terms of service</a> and <a href="#" className="underline">Privacy Policy</a>
        </p>
      </form>
    </div>      
  </div>
);