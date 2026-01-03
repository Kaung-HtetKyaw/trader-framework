'use client';

import { useEnrichedClusterGroups } from '@/lib/hooks/useEnrichedClusterGroups';
import { ClusterGroupWithStats } from '@/types/cluster';
import BulkClusterSelectionToDestinationGroup from '@/components/modals/BulkMoveClustersToDestinationGroupModal';
import { EnrichedCluster } from '@/lib/hooks/useEnrichedClusters';

interface EmptyClusterGroupProps {
  clusters: EnrichedCluster[];
  destinationGroup: ClusterGroupWithStats;
}

export default function EmptyClusterGroup({ destinationGroup, clusters }: EmptyClusterGroupProps) {
  const { clusterGroups } = useEnrichedClusterGroups(clusters);

  return (
    <div className="w-full bg-text-100 rounded-md flex flex-col justify-center items-center gap-2 p-4">
      <div className="w-full flex flex-col justify-start items-center gap-1">
        <div className="text-center text-text-400 text-xs font-semibold leading-[15.6px]">
          No clusters in this group!
        </div>
        <div className="text-center text-text-400 text-[10px] font-normal leading-[13px]">
          Add clusters to a cluster group to view the detailed info of them.
        </div>
      </div>
      <BulkClusterSelectionToDestinationGroup destinationGroup={destinationGroup} groups={clusterGroups} />
    </div>
  );
}
