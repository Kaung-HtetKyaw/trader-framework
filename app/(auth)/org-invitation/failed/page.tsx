'use client';

import { useRouter } from 'next/navigation';
import { SIGNUP_PATH } from '../../urls';
import { InviteUserFailIcon } from '@/components/svgs/InviteUserFailIcon';

const OrgInvitationFailed = () => {
  const router = useRouter();
  return (
    <div className="flex flex-col gap-4 items-center justify-center w-full max-w-md ">
      <div className="flex justify-center mb-1">
        <InviteUserFailIcon className="w-12 h-12 text-secondary-500" />
      </div>
      <h1 className="text-text-950 font-semibold text-2xl text-center">Invitation unsuccessful!</h1>
      <p className="text-text-950 px-2 text-center font-normal">
        There was an issue with your invitation. Please contact your organization owner or admin who invited you and try
        again. Please contact customer support if the issue cannot be resolved.
      </p>
      <button
        onClick={() => router.push(SIGNUP_PATH)}
        className="mt-4 bg-secondary-500 text-text-50 py-2 px-4 rounded-lg w-full"
      >
        Go to Sign Up
      </button>
    </div>
  );
};

export default OrgInvitationFailed;
