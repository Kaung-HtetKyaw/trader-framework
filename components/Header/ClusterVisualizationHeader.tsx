import { cn, getTimeAgo } from '@/lib/utils';
import Divider from '../Divider';
import { RefreshIcon } from '../svgs/RefreshIcon';
import { RefreshingIcon } from '../svgs/RefreshingIcon';
import { BaseButton } from '../ui/base-button';
import { usePathname } from 'next/navigation';
import { useRefresh } from '@/context/VisualizationRefreshContext';
import { useCallback, useEffect, useState } from 'react';
import { misc } from '@/signals/visualiation/misc';
import HeaderWrapper from './HeaderWrapper';
import { useSignals } from '@preact/signals-react/runtime';
import { useGetOrganizationQuery } from '@/store/api/organizationApi';

const ClusterVisualizationHeader = () => {
  useSignals();
  const { data: organization } = useGetOrganizationQuery();
  const pathname = usePathname();
  const { triggerRefresh, isRefreshing, disableRefresh } = useRefresh();
  const [lastRefreshTimestamp, setLastRefreshTimestamp] = useState<number | null>(null);
  const [showLastRefresh, setShowLastRefresh] = useState(false);

  const handleRefresh = useCallback(() => {
    triggerRefresh();
    setLastRefreshTimestamp(Date.now());
  }, [triggerRefresh]);

  useEffect(() => {
    setLastRefreshTimestamp(null);
    setShowLastRefresh(false);
  }, [pathname]);

  useEffect(() => {
    if (!isRefreshing && lastRefreshTimestamp) {
      setShowLastRefresh(true);
    } else if (isRefreshing) {
      setShowLastRefresh(false);
    }
  }, [isRefreshing, lastRefreshTimestamp]);

  return (
    <HeaderWrapper className="px-4">
      <section className="bg-white flex flex-row items-center justify-center gap-3">
        <p className="text-primary-950 font-[500] text-[18px]">{organization?.name || 'Org Name'}</p>
        <Divider type="vertical" className="h-6 mx-4" />
        <BaseButton
          type="button"
          aria-label="Refresh visualization"
          disabled={pathname === '/visualization' || disableRefresh || misc.value.isLoading}
          className={cn(
            'flex items-center gap-2 rounded-lg border border-secondary-500 bg-white ml-4',
            !(pathname === '/visualization') && 'hover:bg-secondary-100',
            pathname === '/visualization' || disableRefresh
              ? 'border-none cursor-not-allowed'
              : 'border border-secondary-500'
          )}
          style={{ minWidth: 40, minHeight: 30, padding: 0 }}
          onClick={handleRefresh}
        >
          {isRefreshing ? (
            <RefreshingIcon
              className={cn(
                'w-6 h-6 min-w-6 min-h-6 animate-spin',
                pathname === '/visualization' ? 'text-text-500' : 'text-secondary-500'
              )}
            />
          ) : (
            <RefreshIcon
              className={cn(
                'w-6 h-6 min-w-6 min-h-6',
                pathname === '/visualization' || disableRefresh ? 'text-text-500' : 'text-secondary-500'
              )}
            />
          )}
        </BaseButton>
        {pathname !== '/visualization' &&
          (isRefreshing && lastRefreshTimestamp ? (
            <span className="text-text-950 text-[14px] ml-2">Refreshing</span>
          ) : (
            lastRefreshTimestamp &&
            showLastRefresh && (
              <span className="text-text-950 text-[14px] ml-2">Last refresh {getTimeAgo(lastRefreshTimestamp)}</span>
            )
          ))}
      </section>
    </HeaderWrapper>
  );
};

export default ClusterVisualizationHeader;
