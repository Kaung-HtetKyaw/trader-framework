'use client';
import PasswordForm from './form';
import { useResetPasswordMutation } from '@/store/api/usersApi';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resetPasswordSchema } from '@/lib/validations';
import SettingsLayout from '@/components/Settings/SettingsLayout';
import SettingsActionBar from '@/components/Settings/SettingsActionBar';
import { useMemo } from 'react';
import usePasswordMatchValidation from '@/lib/hooks/usePasswordMatchValidation';
import { CustomToast } from '@/components/CustomToast';
import { notifyErrorFromResponse } from '@/lib/utils/error';

const PasswordFormWithActionBar = () => {
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const form = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
    mode: 'onBlur',
  });

  const passwordsMatch = usePasswordMatchValidation(form, {
    password: '',
    confirmPassword: '',
  });

  const handlePasswordSubmit = async (data: { password: string; confirmPassword: string }) => {
    try {
      const response = await resetPassword({ password: data.password });

      const { error, notify } = notifyErrorFromResponse(response);

      if (error) {
        notify('Password reset failed. Try again!');
        return { success: false, error: 'Password reset failed. Try again!' };
      }

      CustomToast({
        type: 'success',
        message: 'Your password has been reset successfully!',
      });

      return { success: !!response?.data?.success, message: response?.data?.message || '' };
    } catch {
      return { success: false, error: 'An unexpected error occurred.' };
    }
  };

  const isDisabled = useMemo(
    () => !(form.formState.isValid && form.formState.isDirty),
    [form.formState.isValid, form.formState.isDirty]
  );

  return (
    <SettingsLayout>
      <PasswordForm form={form} onSubmit={handlePasswordSubmit} passwordsMatch={!!passwordsMatch} />
      <SettingsActionBar
        isLoading={isLoading}
        disabled={isDisabled || isLoading}
        onSubmit={form.handleSubmit(handlePasswordSubmit)}
      />
    </SettingsLayout>
  );
};

export default PasswordFormWithActionBar;
