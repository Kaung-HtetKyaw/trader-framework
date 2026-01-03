import { CLUSTER_STATUSES } from '@/lib/config';
import { Cluster } from '@/types/cluster';
import { Separator } from '@radix-ui/react-separator';
import React, { useMemo } from 'react';
import { useGetOrganizationQuery } from '@/store/api/organizationApi';

interface HeaderStatsProps {
  clusters: Cluster[];
}
const HeaderStats = ({ clusters }: HeaderStatsProps) => {
  const { data: organization } = useGetOrganizationQuery();
  const total = useMemo(() => clusters?.length, [clusters]);
  const unhealthy = useMemo(
    () => clusters?.filter(c => c.stats?.status === CLUSTER_STATUSES.UNHEALTHY).length,
    [clusters]
  );
  const atRisk = useMemo(() => clusters?.filter(c => c.stats?.status === CLUSTER_STATUSES.AT_RISK).length, [clusters]);

  if (!clusters || clusters.length === 0) return null;
  return (
    <div className="flex flex-row  md:gap-2 justify-center items-center text-sm">
      <h1 className="flex text-sm md:text-lg font-medium text-primary-950 text-nowrap">
        {organization?.name || 'Org Name'}
      </h1>
      <Separator orientation="vertical" className="block h-4 mx-6 w-px bg-text-200" />

      <div className="flex lg:hidden flex-row">
        <div className="flex text-xs md:text-sm items-center text-nowrap gap-2 md:gap-2">
          <span className="text-secondary-500 font-bold">Total Clusters:</span>
          <span>{total}</span>
        </div>
        <Separator orientation="vertical" className="block mx-6 h-4 w-px bg-text-200" />
      </div>

      <div className="flex lg:hidden flex-row">
        <div className="flex text-xs md:text-sm text-nowrap items-center gap-2 md:gap-2">
          <span className="text-secondary-500 font-bold ">At Risk:</span>
          <span>{atRisk}</span>
        </div>
        <Separator orientation="vertical" className="block mx-6 h-4 w-px bg-text-200" />
      </div>

      <div className="flex lg:hidden text-xs md:text-sm text-nowrap items-center gap-2 md:gap-2">
        <span className="text-secondary-500 font-bold">Unhealthy:</span>
        <span>{unhealthy}</span>
      </div>

      <div className="hidden lg:flex flex-wrap items-center gap-2 md:gap-4 font-semibold text-text-950">
        <div className="flex items-center gap-2 md:gap-2">
          <span className="text-secondary-500">Total Clusters:</span>
          <span>{total}</span>
        </div>
        <Separator orientation="vertical" className="hidden sm:block h-4 w-px bg-text-200" />

        <div className="flex items-center gap-2 md:gap-2">
          <span className="text-secondary-500">At Risk:</span>
          <span>{atRisk}</span>
        </div>
        <Separator orientation="vertical" className="hidden sm:block h-4 w-px bg-text-200" />
        <div className="flex items-center gap-2 md:gap-2">
          <span className="text-secondary-500">Unhealthy:</span>
          <span>{unhealthy}</span>
        </div>
      </div>
    </div>
  );
};

export default HeaderStats;
