import ProfilePersonalInformationForm from './form';
import { useLazyGetUserInfoQuery, useUpdateUserInfoMutation } from '@/store/api/usersApi';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { personalInfoSchema } from '@/lib/validations';
import { CustomToast } from '@/components/CustomToast';
import SettingsLayout from '@/components/Settings/SettingsLayout';
import SettingsActionBar from '@/components/Settings/SettingsActionBar';
import { useMemo } from 'react';
import { User } from '@/types/user';
import { notifyErrorFromResponse } from '@/lib/utils/error';

export type PersonalInformationFormWithActionBarProps = {
  user: User | undefined;
};

const PersonalInformationFormWithActionBar = ({ user }: PersonalInformationFormWithActionBarProps) => {
  const [updateUserInfo, { isLoading }] = useUpdateUserInfoMutation();
  const [triggerGetUserInfo] = useLazyGetUserInfoQuery();

  const form = useForm({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
    },
    mode: 'onBlur',
  });

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

      CustomToast({
        type: 'success',
        message: 'The user info has been updated successfully!',
      });

      return { success: !!response?.data?.success, message: response?.data?.message || '' };
    } catch (error) {
      console.error(error);
      return { success: false, error: 'An unexpected error occurred.' };
    }
  };

  const isDisabled = useMemo(() => !(form.formState.isValid && form.formState.isDirty), [form.formState]);

  if (!user) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <p className="text-text-400 body-2 capitalize">User not found</p>
      </div>
    );
  }

  return (
    <SettingsLayout>
      <ProfilePersonalInformationForm form={form} onSubmit={handlePersonalInfoSubmit} />
      <SettingsActionBar
        isLoading={isLoading}
        disabled={isDisabled || isLoading}
        onSubmit={form.handleSubmit(handlePersonalInfoSubmit)}
      />
    </SettingsLayout>
  );
};

export default PersonalInformationFormWithActionBar;
