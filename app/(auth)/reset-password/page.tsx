'use client';

import ResetPasswordForm from './reset-password-form';
import { useSearchParams } from 'next/navigation';

const page = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  if (!token) return;

  return <ResetPasswordForm token={token} />;
};

export default page;
