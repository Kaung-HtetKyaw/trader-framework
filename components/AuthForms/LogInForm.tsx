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
import { signInSchema } from '@/lib/validations';
import { KubegradeIconDark } from '@/components/svgs/KubegradeIconDark';
import { LogInPayload } from '@/types/auth';
import { signInWithCredentials } from '@/lib/authClient';
import useQueryParams from '@/lib/hooks/useQueryParams';
import { Eye, EyeOff } from 'lucide-react';
import AuthFormButton from './AuthFormButton';
import { ErrorCodes } from '@/lib/utils/error';

export type LogInFormProps = {
  onSuccess: () => void;
  defaultValues: LogInPayload;
  onSubmit: (data: LogInPayload) => Promise<AuthResponse>;
};

const LogInForm = (props: LogInFormProps) => {
  const { onSuccess, defaultValues } = props;
  const router = useRouter();
  const { params } = useQueryParams<{
    redirect: string;
    email: string;
  }>();

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<AuthResponse | null>(null);

  const form = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues,
    mode: 'onBlur',
    reValidateMode: 'onBlur',
  });

  const onSubmit = useCallback(
    async (data: LogInPayload) => {
      setIsLoading(true);
      const response = await signInWithCredentials(data);

      if (response.success) {
        setIsLoading(false);
        // not awaiting here intentionally to avoid blocking the UI
        onSuccess();
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
    [params, onSuccess]
  );

  const handleSubmit = useCallback(
    async (data: LogInPayload) => {
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
      <h1 className="text-text-950 font-semibold text-2xl text-center">Log in to Kubegrade</h1>
      <p className="text-center text-text-950 text-sm font-normal">
        <span>
          New to Kubegrade?{' '}
          <Link href="/sign-up" className="font-semibold text-secondary-500">
            Sign up for free
          </Link>
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

          <div className="flex items-center justify-end w-full">
            <Link href="/forgot-password" className="text-sm font-medium text-essence-500 hover:underline">
              Forgot Password?
            </Link>
          </div>

          <AuthFormButton disabled={!form.formState.isValid} isLoading={isLoading} className="w-full">
            {isLoading ? 'Logging in...' : 'Log In'}
          </AuthFormButton>

          {(serverError?.errorCode === ErrorCodes.EKG40101 || serverError?.errorCode === ErrorCodes.EKG40100) && (
            <InfoCard
              type={INFO_TYPE.error}
              title={'Unsuccessful login attempt'}
              content={'Please verify your credentials and try again, or reset your password.'}
            />
          )}

          {serverError?.errorCode === ErrorCodes.EKG40108 && (
            <InfoCard
              type={INFO_TYPE.error}
              title={'Account Not Verfied'}
              content={
                'Your account is not yet verified. Please check your email for a validation link and verify your account before logging in.'
              }
            />
          )}

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

export default LogInForm;
