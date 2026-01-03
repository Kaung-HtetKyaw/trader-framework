'use client';
import { ExpiryLinkIcon } from '@/components/svgs/ExpiryLinkIcon';
import { BaseButton } from '@/components/ui/base-button';
import Link from 'next/link';
import { LOGIN_PATH } from '../../urls';

const LinkExpiredPage = () => {
  return (
    <div className="flex flex-col gap-4 items-center justify-center w-full max-w-md ">
      <div className="flex justify-center mb-1">
        <ExpiryLinkIcon className="!w-12 !h-12 text-secondary-500" />
      </div>
      <h1 className="text-text-950 font-semibold text-2xl text-center">Invalid or Expired Link!</h1>
      <p className="text-text-950 px-2 text-center font-normal   ">
        Oops! It looks like your user validation link has expired or the link has already been used.
      </p>

      <Link className="w-full" href={LOGIN_PATH}>
        <BaseButton className="mt-4 h-10 !text-[16px] bg-secondary-500 text-text-50 py-2 px-4 rounded-lg w-full flex justify-center items-center">
          Go to Log In
        </BaseButton>
      </Link>
    </div>
  );
};

export default LinkExpiredPage;
