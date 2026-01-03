'use client';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { passwordNotMatchMessage, ResetPasswordFormData } from '@/lib/validations';
import { CustomToast } from '@/components/CustomToast';
import { UseFormReturn } from 'react-hook-form';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export type PasswordFormProps = {
  form: UseFormReturn<
    ResetPasswordFormData,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any,
    undefined
  >;
  onSubmit: (data: ResetPasswordFormData) => Promise<{
    success: boolean;
    error?: string;
    redirectTo?: string;
    message?: string;
  }>;
  passwordsMatch: boolean;
};

const PasswordForm = ({ form, onSubmit, passwordsMatch }: PasswordFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (data: ResetPasswordFormData) => {
    const result = await onSubmit(data);
    if (result.success) {
      CustomToast({
        type: 'success',
        message: result?.message || 'Changes saved successfully',
      });

      // reset the form to the default values
      form.reset(form.getValues());
    } else {
      CustomToast({ type: 'error', message: 'Uh oh, something went wrong' });
    }
  };

  return (
    <div className="bg-white rounded-lg w-full md:w-[26.25rem]">
      <h1 className="text-text-950 font-medium text-lg mb-4">Personal Information</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="w-full">
          <div className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="capitalize font-normal">New Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        required
                        type={showPassword ? 'text' : 'password'}
                        placeholder={'Enter new password'}
                        {...field}
                        className={`form-input border ${
                          form.formState.errors[field.name]
                            ? 'border-red-500 focus:border-red-500 focus-visible:ring-0'
                            : 'border-text-200 focus-visible:ring-0'
                        }`}
                      />

                      <button
                        type="button"
                        className="absolute inset-y-0 right-3 flex items-center text-text-500"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-error-600" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="capitalize font-normal">Confirm New Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        required
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder={'Enter new password again'}
                        {...field}
                        className={`form-input border ${
                          form.formState.errors[field.name]
                            ? 'border-red-500 focus:border-red-500 focus-visible:ring-0'
                            : 'border-text-200 focus-visible:ring-0'
                        }`}
                      />

                      <button
                        type="button"
                        className="absolute inset-y-0 right-3 flex items-center text-text-500"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-error-600 mt-1">
                    {!!form.getValues('confirmPassword') && passwordsMatch === false && passwordNotMatchMessage}
                  </FormMessage>
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>
    </div>
  );
};

export default PasswordForm;
