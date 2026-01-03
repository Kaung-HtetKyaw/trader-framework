'use client';

import { useRouter } from 'next/navigation';
import { MailIcon } from '@/components/svgs/MailIcon';

const VerificationPage = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-4 items-center justify-center w-full max-w-md ">
      <div className="flex justify-center mb-1">
        <MailIcon className="!w-12 !h-12 text-success-500" />
      </div>
      <h1 className="text-text-950 font-semibold text-2xl text-center">Success!</h1>
      <p className="text-text-950 px-2 text-center font-normal   ">Your password has been successfully reset!</p>
      <button
        onClick={() => router.push('/log-in')}
        className="mt-4 bg-secondary-500 text-text-50 py-2 px-4 rounded-lg w-full"
      >
        Go to Log In
      </button>
    </div>
  );
};

export default VerificationPage;
