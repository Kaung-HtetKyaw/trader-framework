'use client';

import { resetPassword } from '@/lib/authClient';
import { ResetPasswordFormData } from '@/lib/validations';
import React, { useEffect } from 'react';
import { notFound } from 'next/navigation';
import ResetPasswordForm from '@/components/AuthForms/ResetPasswordForm';

interface Props {
  token: string | null;
}

const defaultValues: ResetPasswordFormData = {
  password: '',
  confirmPassword: '',
};

const Page = ({ token }: Props) => {
  useEffect(() => {
    if (!token) {
      notFound();
    }
  }, [token]);

  const handleResetPassword = (data: ResetPasswordFormData) => {
    return resetPassword({
      password: data.password,
      forgotPasswordToken: token!,
    });
  };

  return <ResetPasswordForm defaultValues={defaultValues} onSubmit={handleResetPassword} />;
};

export default Page;
