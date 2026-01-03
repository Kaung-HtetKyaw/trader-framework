'use client';
import React from 'react';
import EditOrganizationNameForm from './form';
import { CustomToast } from '@/components/CustomToast';
import { useGetOrganizationQuery, useUpdateOrganizationMutation } from '@/store/api/organizationApi';
import { notifyErrorFromResponse } from '@/lib/utils/error';

const EditOrganization = () => {
  const { data: organizationInfo } = useGetOrganizationQuery();
  const [updateOrganization, { isLoading }] = useUpdateOrganizationMutation();

  const onSubmit = async (data: { name: string }) => {
    const response = await updateOrganization({ name: data.name });

    const { error, notify } = notifyErrorFromResponse(response);
    if (error) {
      return notify(error?.errorMessage || 'Something went wrong');
    }
    CustomToast({
      type: 'success',
      message: 'The organization name has been successfully edited!',
    });
  };

  if (!organizationInfo) return null;

  return (
    <EditOrganizationNameForm
      defaultValues={{ name: organizationInfo.name }}
      isLoading={isLoading}
      onSubmit={onSubmit}
    />
  );
};

export default EditOrganization;
