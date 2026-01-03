'use client';
import LogInForm from '@/components/AuthForms/LogInForm';
import { signInWithCredentials } from '@/lib/authClient';
import config from '@/lib/config';
import useQueryParams from '@/lib/hooks/useQueryParams';
import { useLazyGetUserInfoQuery } from '@/store/api/usersApi';
import { LogInPayload } from '@/types/auth';
import { ReoIdentifyPayload } from '@/types/global';

const page = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { params } = useQueryParams<{
    redirect: string;
    email: string;
  }>();

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [getUserInfo] = useLazyGetUserInfoQuery();

  const onSubmit = async (data: LogInPayload) => {
    const response = await signInWithCredentials(data);

    if (response.success) {
      // not awaiting here intentionally to avoid blocking the UI
      onSubmitSuccess();
      if (params.redirect) {
        return {
          ...response,
          redirectTo: `${params.redirect}?email=${params.email}`,
        };
      }
    }

    return response;
  };

  const onSubmitSuccess = () => {
    if (!config.NEXT_PUBLIC_REO_ENABLE || typeof window === 'undefined') {
      return;
    }

    return getUserInfo().then(res => {
      if (!res.data || !window?.Reo) {
        return;
      }

      const { email, firstName, lastName } = res.data;
      const payload: ReoIdentifyPayload = {
        username: firstName || lastName ? `${firstName} ${lastName}` : email,
        email,
        type: 'email',
        firstName,
        lastName,
      };

      window.Reo.identify(payload);
    });
  };

  return <LogInForm onSuccess={onSubmitSuccess} defaultValues={{ email: '', password: '' }} onSubmit={onSubmit} />;
};

export default page;
