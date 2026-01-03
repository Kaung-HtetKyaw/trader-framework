'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import InfoCard from '@/components/InfoCard';
import { INFO_TYPE } from '@/constants';
import { MailIcon } from '@/components/svgs/MailIcon';
import { ForgotPasswordModalIcon } from '@/components/svgs/ForgotPasswordModalIcon';

const VerificationPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const source = searchParams.get('source');

  return (
    <div className="flex flex-col gap-4 items-center justify-center w-full max-w-md ">
      <div className="flex justify-center mb-1">
        {source === 'signup' ? (
          <MailIcon className="!w-12 !h-12 text-secondary-500" />
        ) : (
          <ForgotPasswordModalIcon className="!w-12 !h-12 text-secondary-500" />
        )}
      </div>
      <h1 className="text-text-950 font-semibold text-2xl text-center">
        {source === 'signup' ? 'Please verify your email' : 'Forgot your password?'}
      </h1>
      {source === 'signup' && (
        <p className="text-text-950 px-2 text-center font-normal   ">
          We&apos;ve sent a verification email to <span className="font-semibold">{email || 'your email'}</span>. Please
          check your inbox and click on the link within 24 hours to activate your account.
        </p>
      )}
      {source === 'forgot-password' && (
        <InfoCard
          type={INFO_TYPE.success}
          title={'Password reset link sent!'}
          content={"We've sent a password reset link to the email address you provided. Please check your inbox!"}
        />
      )}
      {source === 'signup' && (
        <button
          onClick={() => router.push('/log-in')}
          className="mt-4 bg-secondary-500 text-text-50 py-2 px-4 rounded-lg w-full"
        >
          Continue
        </button>
      )}
    </div>
  );
};

export default VerificationPage;
