'use client';

import ProfileForm from '@/components/ProfileForm';
import { personalInfoSchema, resetPasswordSchema } from '@/lib/validations';
import React from 'react';
import { useLazyGetUserInfoQuery, useResetPasswordMutation, useUpdateUserInfoMutation } from '@/store/api/usersApi';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useSession } from 'next-auth/react';
import { notifyErrorFromResponse } from '@/lib/utils/error';

const ResetPasswordPage = () => {
  const [resetPassword] = useResetPasswordMutation();
  const [updateUserInfo, { isLoading }] = useUpdateUserInfoMutation();
  const [triggerGetUserInfo] = useLazyGetUserInfoQuery();

  const { data: session } = useSession();

  const handlePersonalInfoSubmit = async (data: { firstName: string; lastName: string }) => {
    try {
      const response = await updateUserInfo({
        firstName: data.firstName,
        lastName: data.lastName,
      });

      const { error, notify } = notifyErrorFromResponse(response);

      if (error) {
        notify('Personal info update failed. Try again!');
        return { success: false, error: 'Personal info update failed. Try again!' };
      }

      await triggerGetUserInfo().unwrap();

      return { success: !!response?.data?.success, message: response?.data?.message || '' };
    } catch {
      return { success: false, error: 'An unexpected error occurred.' };
    }
  };

  const handleResetPassword = async (data: { password: string; confirmPassword: string }) => {
    try {
      const response = await resetPassword({ password: data.password });

      const { error, notify } = notifyErrorFromResponse(response);

      if (error) {
        notify('Password reset failed. Try again!');
        return { success: false, error: 'Password reset failed. Try again!' };
      }
      return { success: !!response?.data?.success, message: response?.data?.message || '' };
    } catch {
      return { success: false, error: 'An unexpected error occurred.' };
    }
  };

  return (
    <div className="flex flex-1 flex-col justify-start">
      <div className="bg-white w-[96%] px-5 py-6 rounded-lg mx-auto mt-4">
        <h2 className="font-semibold text-primary-950 text-2xl">Profile</h2>
      </div>

      {session?.user?.id ? (
        <ProfileForm
          isLoading={isLoading}
          type="PERSONAL_INFO"
          schema={personalInfoSchema}
          defaultValues={{
            firstName: session?.user?.firstName || '',
            lastName: session?.user?.lastName || '',
            email: session?.user?.email || '',
          }}
          onSubmit={handlePersonalInfoSubmit}
        />
      ) : (
        <LoadingSpinner />
      )}

      <ProfileForm
        type="RESET_PASSWORD"
        schema={resetPasswordSchema}
        defaultValues={{
          password: '',
          confirmPassword: '',
        }}
        onSubmit={handleResetPassword}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ResetPasswordPage;
