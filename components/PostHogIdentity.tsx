'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { usePostHog } from '@posthog/react';

export default function PostHogIdentity() {
  const { data: session, status } = useSession();
  const posthog = usePostHog();

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id && session.user.email) {
      posthog.identify(session.user.id.toString(), {
        email: session.user.email,
      });
    }

    if (status === 'unauthenticated') {
      posthog.reset();
    }
  }, [status, session, posthog]);

  return null;
}
