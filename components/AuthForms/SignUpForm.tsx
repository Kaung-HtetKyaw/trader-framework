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
import { passwordNotMatchMessage, signUpSchema } from '@/lib/validations';
import { KubegradeIconDark } from '@/components/svgs/KubegradeIconDark';
import { signUpWithCredentials } from '@/lib/authClient';
import useQueryParams from '@/lib/hooks/useQueryParams';
import { Eye, EyeOff } from 'lucide-react';
import AuthFormButton from './AuthFormButton';
import { ErrorCodes } from '@/lib/utils/error';
import { SignUpFormPayload } from '@/app/(auth)/sign-up/page';
import usePasswordMatchValidation from '@/lib/hooks/usePasswordMatchValidation';
import { Checkbox } from '../ui/checkbox';

export type SignUpFormProps = {
  defaultValues: SignUpFormPayload;
  onSubmit: (data: SignUpFormPayload) => Promise<AuthResponse>;
};

const SignUpForm = (props: SignUpFormProps) => {
  const { defaultValues } = props;
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
    resolver: zodResolver(signUpSchema),
    defaultValues,
    mode: 'onBlur',
    reValidateMode: 'onBlur',
  });

  const passwordsMatch = usePasswordMatchValidation(form, defaultValues);

  const onSubmit = useCallback(
    async (data: SignUpFormPayload) => {
      setIsLoading(true);
      const response = await signUpWithCredentials(data);

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
    async (data: SignUpFormPayload) => {
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

          <FormField
            control={form.control}
            name={'agreeToTerms'}
            render={({ field }) => (
              <FormItem className="flex flex-col w-full items-center  space-y-1">
                <div className="flex items-center space-x-2">
                  <FormControl>
                    <Checkbox
                      id="agreeToTerms"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="w-5 h-5 border border-text-200 rounded-md  data-[state=checked]:bg-primary-950 data-[state=checked]:text-text-50"
                    />
                  </FormControl>
                  <label htmlFor="agreeToTerms" className="items-senter justify-center text-sm text-gray-950">
                    Agree to our{' '}
                    <Link href="/terms" className="text-secondary-500 font-semibold">
                      Terms
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="text-secondary-500 font-semibold">
                      Privacy Policy
                    </Link>
                  </label>
                </div>
                {form.formState.errors.agreeToTerms?.message && (
                  <FormMessage className="text-error-600 mt-1">
                    {form.formState.errors.agreeToTerms?.message.toString()}
                  </FormMessage>
                )}
              </FormItem>
            )}
          />

          <AuthFormButton disabled={!form.formState.isValid} isLoading={isLoading} className="w-full">
            {isLoading ? 'Signing up...' : 'Sign Up'}
          </AuthFormButton>

          {serverError?.errorCode === ErrorCodes.EKG40001 && (
            <InfoCard
              type={INFO_TYPE.error}
              title={'Email address already registered'}
              content={
                'It looks like the email address you entered is already registered. Please log in using your existing account with this email or try another email address to sign up.'
              }
            />
          )}

          {serverError?.errorCode === ErrorCodes.EKG50000 && (
            <InfoCard
              type={INFO_TYPE.error}
              title={'Something went wrong'}
              content={'Encountered a technical error while trying to sign up. Please try again later.'}
            />
          )}
        </form>
      </Form>

      <p className="text-center text-sm font-normal text-text-400">
        Already have an account? {'     '}
        <Link href="/log-in" className="text-secondary-500 font-semibold">
          {' '}
          Log in
        </Link>
      </p>
    </div>
  );
};

export default SignUpForm;
