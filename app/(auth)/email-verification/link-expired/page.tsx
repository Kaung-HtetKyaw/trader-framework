'use client';

import { handleVerifyUserResendLink } from '@/lib/authClient';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { AuthResponse } from '@/types';
import InfoCard from '@/components/InfoCard';
import { INFO_TYPE } from '@/constants';

import { useRouter } from 'next/navigation';
import { ExpiryLinkIcon } from '@/components/svgs/ExpiryLinkIcon';

const LinkExpiredPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') ?? '';

  const [loading, setLoading] = useState(false);
  const [serverResponse, setServerResponse] = useState<AuthResponse | null>(null);

  const handleResendLinkButton = async () => {
    if (!email) {
      return;
    }
    setLoading(true);
    const result = await handleVerifyUserResendLink(email);
    setServerResponse(result);
    if (result.success && result.redirectTo) {
      router.push(result.redirectTo);
    } else {
      setServerResponse(result);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-4 items-center justify-center w-full max-w-md ">
      <div className="flex justify-center mb-1">
         <ExpiryLinkIcon className="!w-12 !h-12 text-secondary-500" />
      </div>
      <h1 className="text-text-950 font-semibold text-2xl text-center">Link expired!</h1>
      <p className="text-text-950 px-2 text-center font-normal   ">
        Oops! It looks like your user validation link has expired. Please request a new link to validate the user.
      </p>

      {serverResponse?.success && (
        <InfoCard
          type={INFO_TYPE.success}
          title={'User Validation link sent!'}
          content={["We've sent you a new verification link.", 'Please check your email.']}
        />
      )}
      <button
        onClick={handleResendLinkButton}
        disabled={loading}
        className="mt-4 bg-secondary-500 text-text-50 py-2 px-4 rounded-lg w-full"
      >
        {loading ? 'Resending...' : 'Resend Reset Link'}
      </button>
    </div>
  );
};

export default LinkExpiredPage;
