'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { DefaultValues, FieldValues, Path, SubmitHandler, useForm, UseFormReturn } from 'react-hook-form';
import { ZodType } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { FIELD_NAMES, FIELD_TYPES } from '@/constants';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { CustomToast } from '././CustomToast';
import usePasswordMatchValidation from '@/lib/hooks/usePasswordMatchValidation';
import { passwordNotMatchMessage } from '@/lib/validations';
import { BaseButton } from './ui/base-button';

interface Props<T extends FieldValues> {
  schema: ZodType<T>;
  defaultValues: T;
  onSubmit: (data: T) => Promise<{
    success: boolean;
    error?: string;
    redirectTo?: string;
    message?: string;
  }>;
  type: 'PERSONAL_INFO' | 'RESET_PASSWORD';
  isLoading: boolean;
}

const ProfileForm = <T extends FieldValues>({ type, schema, defaultValues, onSubmit, isLoading }: Props<T>) => {
  const isPersonalInfo = type === 'PERSONAL_INFO';
  const isResetPassword = type === 'RESET_PASSWORD';

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form: UseFormReturn<T> = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as DefaultValues<T>,
    mode: 'onBlur',
  });

  const passwordsMatch = usePasswordMatchValidation(form, defaultValues);

  const {
    formState: { isValid, isDirty },
  } = form;

  const handleSubmit: SubmitHandler<T> = async data => {
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
    <div className="bg-white w-[96%] px-5 py-6 rounded-lg mx-auto mt-4">
      <h1 className="text-text-950 font-medium text-lg mb-4">
        {' '}
        {isPersonalInfo ? 'Personal Information' : isResetPassword ? 'Reset password' : ''}{' '}
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="w-full" noValidate>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {Object.keys(defaultValues).map(field => (
              <FormField
                key={field}
                control={form.control}
                name={field as Path<T>}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="capitalize font-normal">
                      {field.name === 'password'
                        ? 'New Password'
                        : field.name === 'confirmPassword'
                          ? 'Confirm New Password'
                          : ''}
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          required
                          type={
                            field.name === 'password'
                              ? showPassword
                                ? 'text'
                                : 'password'
                              : field.name === 'confirmPassword'
                                ? showConfirmPassword
                                  ? 'text'
                                  : 'password'
                                : FIELD_TYPES[field.name as keyof typeof FIELD_TYPES]
                          }
                          placeholder={
                            field.name === 'password'
                              ? 'Enter new password'
                              : field.name === 'confirmPassword'
                                ? 'Enter new password again'
                                : `Enter your ${(
                                    FIELD_NAMES[field.name as keyof typeof FIELD_NAMES] || field.name
                                  ).toLowerCase()}`
                          }
                          {...field}
                          disabled={field.name === 'email'}
                          className={`form-input border ${
                            form.formState.errors[field.name]
                              ? 'border-red-500 focus:border-red-500 focus-visible:ring-0'
                              : 'border-text-200 focus-visible:ring-0'
                          }`}
                        />

                        {field.name === 'password' && (
                          <button
                            type="button"
                            className="absolute inset-y-0 right-3 flex items-center text-text-500"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                          </button>
                        )}
                        {field.name === 'confirmPassword' && (
                          <button
                            type="button"
                            className="absolute inset-y-0 right-3 flex items-center text-text-500"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                          </button>
                        )}
                      </div>
                    </FormControl>
                    <div className="min-h-[24px]">
                      {isResetPassword && ['password'].includes(field.name) && (
                        <FormMessage className="text-error-600" />
                      )}
                      {field.name === 'confirmPassword' && (
                        <FormMessage className="text-error-600 mt-1">
                          {passwordsMatch === false && passwordNotMatchMessage}
                        </FormMessage>
                      )}
                    </div>
                  </FormItem>
                )}
              />
            ))}
          </div>
          <div className="h-[45px] flex items-center">
            <BaseButton
              type="submit"
              className={`px-6 py-2 font-medium rounded-md transition ${
                isValid && isDirty
                  ? 'bg-secondary-500 text-white hover:bg-secondary-600 cursor-pointer font-normal'
                  : 'bg-text-50 text-text-400 cursor-not-allowed font-normal'
              }`}
              disabled={!(isValid && isDirty) || isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </BaseButton>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ProfileForm;
