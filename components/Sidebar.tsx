'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { SidebarLink, getSidebarLinks } from '@/constants';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from './ui/button';
import AlertCarousel from './AlertCarousel';
import { usePostHog } from '@posthog/react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import { useAbility } from '@/lib/authorization/casl/AbilityProvider';
import { AlertIcon } from './svgs/AlertIcon';
import { ChevronDoubleLeftIcon } from '@/components/svgs/ChevronDoubleLeft';
import { ChevronDoubleRightIcon } from '@/components/svgs/ChevronDoubleRight';
import { KubegradeIconLight } from '@/components/svgs/KubegradeIconLight';
import { useSignals } from '@preact/signals-react/runtime';
import usePersistSelectedCluster from '@/lib/hooks/usePersistSelectedCluster';
import { getPersistedFilters } from '@/lib/hooks/usePersistVisualizationFilters';
import Messenger, { MessengerTypes } from './Messenger';
import { useEventListener } from '@/lib/hooks/useEventListener';
import {
  setIsSidebarCollapsed,
  getIsSidebarCollapsed,
  setShowAlertCarousel,
  getShowAlertCarousel,
  toggleIsSidebarCollapsed,
  toggleShowAlertCarousel,
} from '@/signals/global/misc';

const routableBaseRoutes = ['/dashboard', '/clusters', '/agents', '/settings'];
const SIDEBAR_LOCK_BREAKPOINT = 1279;
const routableDetailsRoutes = ['/visualization'];

export const SIDEBAR_ID = 'sidebar';
export const SIDEBAR_COLLAPSED_WIDTH = 80;
export const SIDEBAR_EXPANDED_WIDTH = 270;

const Sidebar = () => {
  useSignals();
  const posthog = usePostHog();
  const pathname = usePathname();
  const ability = useAbility();
  const [clickedLink, setClickedLink] = useState<string | null>(null);
  const [shouldLockSidebar, setShouldLockSidebar] = useState(false);
  const { getSelectedCluster } = usePersistSelectedCluster();
  useEventListener('resize', () => {
    const shouldLock = window.innerWidth <= SIDEBAR_LOCK_BREAKPOINT;
    setShouldLockSidebar(shouldLock);
    if (shouldLock) {
      setIsSidebarCollapsed(true);
    }
  });
  const alerts = useSelector((state: RootState) => state.alerts.alerts);
  const unreadAlerts = alerts.filter(a => !a.isRead);
  const alertCount = unreadAlerts.length;
  const selectedCluster = getSelectedCluster();
  const persistedFilters = getPersistedFilters(selectedCluster || '');

  const onClickLink = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, link: SidebarLink) => {
      const isRoutableBaseRoute = routableBaseRoutes.includes(link.route);
      const isRoutableDetailsRoute = routableDetailsRoutes.find(el => link.route.includes(el));
      const isRoutable = isRoutableBaseRoute || isRoutableDetailsRoute;

      posthog?.capture('sidebar_link_clicked', {
        label: link.text,
        route: link.route,
      });

      if (!isRoutable) {
        e.preventDefault();
      } else {
        setClickedLink(link.route);
      }
    },
    [posthog]
  );

  useEffect(() => {
    setClickedLink(null);
  }, [pathname]);

  return (
    <TooltipProvider delayDuration={100}>
      <aside
        id={SIDEBAR_ID}
        style={{ width: getIsSidebarCollapsed() ? `${SIDEBAR_COLLAPSED_WIDTH}px` : `${SIDEBAR_EXPANDED_WIDTH}px` }}
        className={cn(
          'sidebar z-10 transition-[width] duration-300 ease-in-out overflow-x-hidden bg-primary-950 flex flex-col shrink-0 '
        )}
      >
        <Link href="/">
          <div
            className={cn('sidebar-logo group', getIsSidebarCollapsed() ? 'px-4 justify-center' : 'px-7 justify-start')}
          >
            <KubegradeIconLight className="!w-10 !h-10" />

            {!getIsSidebarCollapsed() && <h1>Kubegrade</h1>}
          </div>
        </Link>

        <div className="border-b border-primary-50/10" />

        <nav className={cn('sidebar-link-container')}>
          {getSidebarLinks(ability, selectedCluster, persistedFilters).map(link => {
            const isSelected = clickedLink
              ? clickedLink === link.route
              : (link.route !== '/dashboard' && pathname.includes(link.route) && link.route.length > 1) ||
                pathname === link.route;

            const linkContent = (
              <div
                className={cn(
                  'flex items-center w-full h-full rounded-lg transition-all duration-300 ease-in-out text-text-50 group',
                  getIsSidebarCollapsed() ? 'px-0 justify-center' : 'px-4 justify-start',
                  isSelected ? 'text-text-50 bg-primary-500' : 'hover:bg-primary-900 hover:text-secondary-400'
                )}
              >
                <div className={cn('relative w-5 h-5 shrink-0 flex items-center justify-center')}>
                  <link.img
                    className={cn(
                      'w-5 h-5 transition-colors duration-300',
                      isSelected ? 'text-text-50' : 'text-text-50 group-hover:text-secondary-400'
                    )}
                  />
                </div>

                <div
                  className={cn(
                    'overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out ',
                    getIsSidebarCollapsed() ? 'max-w-0 opacity-0 ml-0' : 'max-w-[160px] opacity-100 ml-3'
                  )}
                >
                  {link.text}
                </div>
              </div>
            );

            return (
              <Link
                prefetch={false}
                href={link.route}
                key={link.route}
                className={cn('h-12 w-full px-4 cursor-pointer')}
                onClick={(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => onClickLink(e, link)}
              >
                {getIsSidebarCollapsed() ? (
                  <Tooltip>
                    <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                    <TooltipContent
                      side="right"
                      sideOffset={18}
                      className="text-xs font-medium bg-white text-secondary-400 rounded-md shadow-md px-3 py-2"
                    >
                      {link.text}
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  linkContent
                )}
              </Link>
            );
          })}
        </nav>

        <section
          className={cn(
            'mt-auto flex flex-col gap-2 transition-all duration-300 ease-in-out rounded-lg',
            getIsSidebarCollapsed() ? 'px-2' : 'px-4'
          )}
        >
          {getShowAlertCarousel() && unreadAlerts.length > 0 && (
            <div
              className={cn(
                'transition-all duration-300 ease-in-out',
                getIsSidebarCollapsed()
                  ? 'fixed bottom-2 left-[85px] w-[240px] px-0 transition-all duration-300 ease-in-out'
                  : 'absolute bottom-[60px] left-0 right-0 w-full flex justify-center'
              )}
            >
              <div className="max-w-[240px] w-full min-w-[240px]">
                <AlertCarousel onClose={() => setShowAlertCarousel(false)} />
              </div>
            </div>
          )}
          <section
            className={cn(
              'sidebar-bottom w-full flex gap-3 transition-all duration-300 ease-in-out',
              getIsSidebarCollapsed() ? 'flex-col' : 'flex-row'
            )}
          >
            <Messenger type={MessengerTypes.intercom} isCollapsed={getIsSidebarCollapsed()} />
            <Button
              variant="ghost"
              className={cn(
                'sidebar-button border-sm w-full flex h-9 gap-[6px] justify-center items-center transition-all duration-300 ease-in-out',
                getIsSidebarCollapsed() ? 'px-2' : 'px-0'
              )}
              onClick={toggleShowAlertCarousel}
            >
              <AlertIcon className="w-5 h-5 text-text-50" />

              {alertCount > 0 && (
                <span className=" bg-essence-500 text-primary-950 text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {alertCount}
                </span>
              )}
            </Button>

            <Button
              variant="ghost"
              className={cn(
                'sidebar-button w-full h-9 px-0  justify-center items-center  ',
                getIsSidebarCollapsed() && 'px-2'
              )}
              onClick={toggleIsSidebarCollapsed}
              disabled={shouldLockSidebar}
            >
              {getIsSidebarCollapsed() ? (
                <ChevronDoubleRightIcon className="w-4 h-4 text-text-50" />
              ) : (
                <ChevronDoubleLeftIcon className="w-4 h-4 text-text-50" />
              )}
            </Button>
          </section>
        </section>
      </aside>
    </TooltipProvider>
  );
};

export default Sidebar;
