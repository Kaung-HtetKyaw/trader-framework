'use client';
import { logoutAndRedirect } from '@/lib/authClient';
import { useSession } from 'next-auth/react';
import { useEffect, useRef, useCallback } from 'react';

const INACTIVITY_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes
const CHECK_INTERVAL_MS = 30 * 1000; // Check every 30 seconds
const STORAGE_KEY = '_lastActivity';
export const LOGOUT_KEY = '_autoLogout';

export default function AutoLogoutProvider({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const timer = useRef<NodeJS.Timeout | null>(null);

  const updateLastActivity = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, Date.now().toString());
  }, []);

  const checkInactivity = useCallback(() => {
    const last = parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10);
    if (status === 'authenticated' && Date.now() - last > INACTIVITY_TIMEOUT_MS) {
      localStorage.setItem(LOGOUT_KEY, Date.now().toString());
      logoutAndRedirect();
    }
  }, [status]);

  useEffect(() => {
    if (status !== 'authenticated') return;

    const events = ['mousemove', 'mousedown', 'keypress', 'scroll', 'focus'];
    events.forEach(event => window.addEventListener(event, updateLastActivity));

    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) checkInactivity();
      if (e.key === LOGOUT_KEY && e.newValue) logoutAndRedirect();
    };
    window.addEventListener('storage', onStorage);

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') checkInactivity();
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    updateLastActivity();
    checkInactivity();

    timer.current = setInterval(checkInactivity, CHECK_INTERVAL_MS);

    return () => {
      events.forEach(event => window.removeEventListener(event, updateLastActivity));
      window.removeEventListener('storage', onStorage);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      if (timer.current) clearInterval(timer.current);
    };
  }, [status, updateLastActivity, checkInactivity]);

  return <>{children}</>;
}
