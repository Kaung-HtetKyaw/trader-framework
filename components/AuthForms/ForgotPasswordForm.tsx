'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { INFO_TYPE } from '@/constants';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import InfoCard from '@/components/InfoCard';
import { AuthResponse } from '@/types/index';
import { forgotPasswordSchema } from '@/lib/validations';
import { ForgotPasswordPayload } from '@/types/auth';
import { forgotPasswordRequest } from '@/lib/authClient';
import useQueryParams from '@/lib/hooks/useQueryParams';
import AuthFormButton from './AuthFormButton';
import { ErrorCodes } from '@/lib/utils/error';
import { ForgotPasswordModalIcon } from '../svgs/ForgotPasswordModalIcon';
import { BaseButton } from '../ui/base-button';

export type ForgotPasswordFormProps = {
  defaultValues: ForgotPasswordPayload;
};

const ForgotPasswordForm = (props: ForgotPasswordFormProps) => {
  const { defaultValues } = props;
  const router = useRouter();
  const { params } = useQueryParams<{
    redirect: string;
    email: string;
  }>();

  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<AuthResponse | null>(null);

  const form = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues,
    mode: 'onBlur',
    reValidateMode: 'onBlur',
  });

  const onSubmit = useCallback(
    async (data: ForgotPasswordPayload) => {
      setIsLoading(true);
      const response = await forgotPasswordRequest(data);

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
    [params]
  );

  const handleSubmit = useCallback(
    async (data: ForgotPasswordPayload) => {
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
        <ForgotPasswordModalIcon className="!w-12 !h-12 text-secondary-500" />
      </div>
      <h1 className="text-text-950 font-semibold text-2xl text-center">Forgot your password?</h1>
      <p className="text-center text-text-950 text-sm font-normal">
        <span className="text-sm inline-block mx-12">
          {' '}
          Please provide your email address to receive a password reset link.
        </span>
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="w-full space-y-6" noValidate>
          <FormField
            key="email"
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="capitalize">Email</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      required
                      type="email"
                      placeholder="Enter your email address"
                      {...field}
                      className={`form-input border ${
                        form.formState.errors[field.name]
                          ? 'border-red-500 focus:border-red-500 focus-visible:ring-0'
                          : 'border-text-200 focus-visible:ring-0'
                      }`}
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-error-600 mt-1" />
              </FormItem>
            )}
          />

          <AuthFormButton disabled={!form.formState.isValid} isLoading={isLoading} className="w-full">
            {isLoading ? 'Sending reset link...' : 'Send Reset Link'}
          </AuthFormButton>

          <BaseButton
            type="button"
            className="inline-flex h-9 w-full items-center justify-center
                    rounded-md px-6 py-2 font-normal text-base bg-secondary-50 text-secondary-500
                    border border-secondary-500 hover:text-white"
            onClick={() => router.push('/log-in')}
          >
            Cancel
          </BaseButton>

          {serverError?.errorCode === ErrorCodes.EKG50000 && (
            <InfoCard
              type={INFO_TYPE.error}
              title={'Something went wrong'}
              content={'Encountered a technical error while trying to login in. Please try again later.'}
            />
          )}
        </form>
      </Form>

      <p className="text-center text-sm font-normal text-text-400 px-[30px]">
        By clicking continue, you agree to Kubegrade&apos;s{' '}
        <Link href="https://kubegrade.com/terms-of-use/" className="text-secondary-500 font-semibold">
          Terms
        </Link>{' '}
        and{' '}
        <Link href="https://kubegrade.com/privacy-policy/" className="text-secondary-500 font-semibold">
          Privacy Policy
        </Link>
      </p>
    </div>
  );
};

export default ForgotPasswordForm;
