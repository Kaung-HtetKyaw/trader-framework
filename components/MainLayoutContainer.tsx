'use client';

import { SETTINGS_PATH } from '@/app/(root)/settings/urls';
import { DASHBOARD_PATH } from '@/app/(root)/urls';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

const MainLayoutContainer = ({ children }: { children: React.ReactNode | React.ReactNode[] }) => {
  const pathname = usePathname();

  const isSettingsPath = useMemo(() => {
    return pathname.includes(SETTINGS_PATH) || pathname.includes(DASHBOARD_PATH);
  }, [pathname]);

  return (
    <main
      className={cn(
        'flex w-full h-screen ',
        isSettingsPath ? 'overflow-x-auto overflow-y-hidden' : 'overflow-hidden'
      )}
    >
      {children}
    </main>
  );
};

export default MainLayoutContainer;
