'use client';
import React from 'react';
import DashboardSkeleton from '../DashboardSkeleton';
import ClusterNewGroup from '../ClusterNewGroup';
import useFeatureFlag from '@/lib/hooks/useFeatureFlag';
import ClusterGroupContainer from '../ClusterGroupContainer';
import { useEnrichedClusterGroups } from '@/lib/hooks/useEnrichedClusterGroups';
import Can from '@/lib/authorization/casl/Can';
import usePoolEnrichedClusterList from '@/lib/hooks/usePoolEnrichedClusterList';

const ClusterGroupList = () => {
  const { isFeatureEnabled } = useFeatureFlag();
  const { clusters, initialLoadComplete } = usePoolEnrichedClusterList({ setInStore: true });
  const { clusterGroups } = useEnrichedClusterGroups(clusters);

  if (!initialLoadComplete) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="flex justify-center px-4 flex-col gap-2 w-full pb-6">
      {clusterGroups.map((clusterGroupData, index: number) => (
        <ClusterGroupContainer clusters={clusters} key={index} clusterGroupData={clusterGroupData} />
      ))}

      {isFeatureEnabled('dashboard.createNewGroup') && (
        <Can do="create" on="cluster_groups">
          <ClusterNewGroup />
        </Can>
      )}
    </div>
  );
};

export default ClusterGroupList;
