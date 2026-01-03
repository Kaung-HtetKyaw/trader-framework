'use client';

import LoadingContainer from '@/components/LoadingContainer';
import PersonalInformationFormWithActionBar from '@/components/Settings/PersonalInformationForm';
import { useGetUserInfoQuery } from '@/store/api/usersApi';

const ProfilePage = () => {
  const { data: user, isLoading } = useGetUserInfoQuery();

  return (
    <LoadingContainer className="w-full h-full" isLoading={isLoading}>
      <PersonalInformationFormWithActionBar user={user} />
    </LoadingContainer>
  );
};

export default ProfilePage;
