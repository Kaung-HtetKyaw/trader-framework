'use client';

import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { LOGIN_PATH } from '../../urls';
import useQueryParams from '@/lib/hooks/useQueryParams';
import { MailIcon } from '@/components/svgs/MailIcon';

const OrgInvitationDifferentAccountPage = () => {
  const router = useRouter();
  const { params } = useQueryParams<{ email: string; organizationID: string }>();

  const onGoToLogin = async () => {
    await signOut({ redirect: false });

    return router.push(
      `${LOGIN_PATH}?redirect=/api/org-invite&email=${params.email}&organizationID=${params.organizationID}`
    );
  };

  return (
    <div className="flex flex-col gap-4 items-center justify-center w-full max-w-md ">
      <div className="flex justify-center mb-1">
        <MailIcon className="!w-12 !h-12 text-success-500" />
      </div>
      <h1 className="text-text-950 font-semibold text-2xl text-center">Different account!</h1>
      <p className="text-text-950 px-2 text-center font-normal">
        You are logged in with a different account. Please change account to accept the invitation.
      </p>
      <button onClick={() => onGoToLogin()} className="mt-4 bg-secondary-500 text-text-50 py-2 px-4 rounded-lg w-full">
        Change account
      </button>
    </div>
  );
};

export default OrgInvitationDifferentAccountPage;
