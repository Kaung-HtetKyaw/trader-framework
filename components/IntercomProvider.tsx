import config from '@/lib/config';
import { getUnixTimestamp } from '@/lib/utils';
import { useLazyGetIntercomJwtQuery } from '@/store/api/miscApi';
import Intercom from '@intercom/messenger-js-sdk';
import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useState } from 'react';
import { INTERCOM_CUSTOM_LAUNCHER_BUTTON_ID } from './Messenger/IntercomWidget';

export type IntercomProviderProps = {
  children: React.ReactNode;
};

const IntercomProvider = ({ children }: IntercomProviderProps) => {
  const { data } = useSession();
  const [userSnapshot, setUserSnapshot] = useState('');
  const [getIntercomJwt] = useLazyGetIntercomJwtQuery();

  const loadIntercom = useCallback(async () => {
    if (!data?.user) {
      console.warn('Failed to load Intercom: No user found');
      return;
    }

    if (!config.NEXT_PUBLIC_INTERCOM_APP_ID) {
      console.warn('Failed to load Intercom: No app ID found');
      return;
    }

    const currentUserSnapshot = JSON.stringify({
      user_id: data?.user?.id,
      name: `${data?.user?.firstName} ${data?.user?.lastName}`,
      email: data?.user?.email,
    });

    // If the user data has not changed, skip the intercom load
    if (currentUserSnapshot === userSnapshot) {
      return;
    }

    const { data: intercomJwtData } = await getIntercomJwt();

    if (!intercomJwtData?.token) {
      console.warn('Failed to load Intercom: No token found');
      return;
    }

    const payload = {
      intercom_user_jwt: intercomJwtData.token,
      app_id: config.NEXT_PUBLIC_INTERCOM_APP_ID,
      user_id: data.user.id,
      name: `${data.user.firstName} ${data.user.lastName}`,
      email: data.user.email,
      created_at: getUnixTimestamp(data.user.createdAt),
      session_duration: 86400000, // 1 day in milliseconds,
      alignment: 'left',
      custom_launcher_selector: `#${INTERCOM_CUSTOM_LAUNCHER_BUTTON_ID}`,
      hide_default_launcher: true,
    };

    Intercom(payload);

    // This is to have a reference snapshot to make sure that load intercom is called only once unless user data changes
    setUserSnapshot(
      JSON.stringify({
        user_id: data?.user?.id,
        name: `${data?.user?.firstName} ${data?.user?.lastName}`,
        email: data?.user?.email,
      })
    );
  }, [data?.user, getIntercomJwt, userSnapshot]);

  useEffect(() => {
    loadIntercom();
  }, [loadIntercom]);

  return children;
};

export default IntercomProvider;
