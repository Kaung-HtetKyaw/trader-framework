'use client';
import React, { useEffect, useState } from 'react';
import ClusterEmptyGroup from './ClusterEmptyGroup';
import ClusterGroupInfo from './ClusterGroupInfo';
import ClusterGroupGrid from '../ClusterGroupCard/ClusterGroupGrid';
import { ClusterGroupWithStats } from '@/types/cluster';
import ClusterGroupActionMenu from '@/components/menus/ClusterGroupActionMenu';
import { EnrichedCluster } from '@/lib/hooks/useEnrichedClusters';

interface ClusterGroupContainerProps {
  clusters: EnrichedCluster[];
  clusterGroupData: ClusterGroupWithStats;
}
const ClusterGroupContainer = ({ clusterGroupData, clusters }: ClusterGroupContainerProps) => {
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    if (clusterGroupData) {
      setIsInitialLoad(false);
    }
  }, [clusterGroupData]);

  return (
    <div className="relative w-full gap-5 bg-white rounded-lg shadow-sm mt-4 p-4 sm:p-6 flex min-h-[128px]">
      <div className="flex flex-col lg:flex-row gap-5 w-full">
        <section className="w-full xl:w-[50%] min-h-[96px]">
          <ClusterGroupInfo clusterGroupData={clusterGroupData} />
        </section>
        <section className="w-full xl:w-[50%] min-h-[96px]">
          {isInitialLoad ? null : clusterGroupData.total === 0 ? (
            <ClusterEmptyGroup clusters={clusters} destinationGroup={clusterGroupData} />
          ) : (
            <ClusterGroupGrid clusterGroupData={clusterGroupData} />
          )}
        </section>
      </div>

      <div>
        <ClusterGroupActionMenu clusterGroupData={clusterGroupData} className="w-50" />
      </div>
    </div>
  );
};

export default ClusterGroupContainer;
