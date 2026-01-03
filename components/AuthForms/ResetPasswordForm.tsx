'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { INFO_TYPE } from '@/constants';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import InfoCard from '@/components/InfoCard';
import { AuthResponse } from '@/types/index';
import { passwordNotMatchMessage, ResetPasswordFormData, resetPasswordSchema } from '@/lib/validations';
import { KubegradeIconDark } from '@/components/svgs/KubegradeIconDark';
import useQueryParams from '@/lib/hooks/useQueryParams';
import { Eye, EyeOff } from 'lucide-react';
import AuthFormButton from './AuthFormButton';
import { ErrorCodes } from '@/lib/utils/error';
import usePasswordMatchValidation from '@/lib/hooks/usePasswordMatchValidation';

export type ResetPasswordFormProps = {
  defaultValues: ResetPasswordFormData;
  onSubmit: (data: ResetPasswordFormData) => Promise<AuthResponse>;
};

const ResetPasswordForm = (props: ResetPasswordFormProps) => {
  const { defaultValues, onSubmit: onSubmitProps } = props;
  const router = useRouter();
  const { params } = useQueryParams<{
    redirect: string;
    email: string;
  }>();

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState<AuthResponse | null>(null);

  const form = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues,
    mode: 'onBlur',
    reValidateMode: 'onBlur',
  });

  const passwordsMatch = usePasswordMatchValidation(form, defaultValues);

  const onSubmit = useCallback(
    async (data: ResetPasswordFormData) => {
      setIsLoading(true);
      const response = await onSubmitProps(data);

      if (response.success) {
        setIsLoading(false);
        // not awaiting here intentionally to avoid blocking the UI
        if (params.redirect) {
          return {
            ...response,
            redirectTo: `${params.redirect}?email=${params.email}`,
          };
        }
      }

      setIsLoading(false);
      return response;
    },
    [params, onSubmitProps]
  );

  const handleSubmit = useCallback(
    async (data: ResetPasswordFormData) => {
      const result = await onSubmit(data);

      if (result.success) {
        if (result.redirectTo) {
          router.push(result.redirectTo);
        } else {
          router.push('/');
        }
      } else {
        setServerError(result);
      }
    },
    [onSubmit, router]
  );

  return (
    <div className="flex flex-col gap-4 items-center justify-center w-96 min-w-96 max-w-md ">
      <div className="flex justify-center">
        <KubegradeIconDark className="!w-12 !h-12" />
      </div>
      <h1 className="text-text-950 font-semibold text-2xl text-center">Get started for free</h1>
      <p className="text-center text-text-950 text-sm font-normal">
        <span className="text-sm">Sign up and start monitoring your clusters for free</span>
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="w-full space-y-6" noValidate>
          <FormField
            key="password"
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="capitalize">Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      required
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Password"
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
                <FormMessage className="text-error-600 mt-1" />
              </FormItem>
            )}
          />

          <FormField
            key="confirmPassword"
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="capitalize">Confirm Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      required
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Enter password again"
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
                {['password', 'email'].includes(field.name) && <FormMessage className="text-error-600 mt-1" />}

                {field.name === 'confirmPassword' && (
                  <FormMessage className="text-error-600 mt-1">
                    {passwordsMatch === false && passwordNotMatchMessage}
                  </FormMessage>
                )}
              </FormItem>
            )}
          />

          {form.formState.errors.password && (
            <InfoCard
              type={INFO_TYPE.info}
              title={'Password requirements'}
              content={{
                text: 'Minimum 8 characters including',
                children: [
                  { text: '1 uppercase letter' },
                  { text: '1 lowercase letter' },
                  { text: '1 special character' },
                  { text: '1 number' },
                ],
              }}
            />
          )}

          <AuthFormButton disabled={!form.formState.isValid} isLoading={isLoading} className="w-full">
            {isLoading ? 'Resetting password...' : 'Reset Password'}
          </AuthFormButton>

          {serverError?.errorCode === ErrorCodes.EKG40106 ||
            (serverError?.errorCode === ErrorCodes.EKG40107 && (
              <InfoCard
                type={INFO_TYPE.error}
                title={'Invalid reset password token'}
                content={
                  'The reset password token is invalid or has expired. Please request a new reset password link.'
                }
              />
            ))}

          {serverError?.errorCode === ErrorCodes.EKG50000 && (
            <InfoCard
              type={INFO_TYPE.error}
              title={'Something went wrong'}
              content={'Encountered a technical error while trying to sign up. Please try again later.'}
            />
          )}
        </form>
      </Form>
    </div>
  );
};

export default ResetPasswordForm;
