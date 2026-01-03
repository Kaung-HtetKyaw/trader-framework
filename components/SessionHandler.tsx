'use client';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { logoutAndRedirect } from '@/lib/authClient';

export default function SessionHandler() {
  const { data: session, status } = useSession();

  useEffect(() => {
    // Only check when session is fully loaded
    if (status === 'authenticated' && session?.error === 'InvalidSession') {
      logoutAndRedirect();
    }
  }, [session, status]);

  return null;
}
