'use client';

import { Cluster } from '@/types/cluster';
import ClusterGroupDetailsList from './ClusterGroupDetailsList';

interface ClusterDetailsListProps {
  clusters: Cluster[];
  isFetching: boolean;
  fetchNextPage: () => void;
}

const ClusterDetailsList = ({ clusters, isFetching, fetchNextPage }: ClusterDetailsListProps) => {
  return (
    <div className="flex flex-col w-full">
      <ClusterGroupDetailsList clusters={clusters} isFetching={isFetching} fetchNextPage={fetchNextPage} />
    </div>
  );
};

export default ClusterDetailsList;
