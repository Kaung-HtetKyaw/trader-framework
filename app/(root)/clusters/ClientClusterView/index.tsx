'use client';
import React, { useMemo } from 'react';
import ConnectCluster from '../ConnectCluster';
import ClusterDetailsList from '../ClusterDetailsList';
import usePoolEnrichedClusterList from '@/lib/hooks/usePoolEnrichedClusterList';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import LoadingContainer from '@/components/LoadingContainer';

const ClientClusterView = () => {
  const { clusters: latestClusters, isLoading } = usePoolEnrichedClusterList({
    setInStore: true,
    enablePolling: false,
  });
  const allClusters = useSelector((state: RootState) => state.cluster.allClusters);
  const clusters = useMemo(
    () => (latestClusters.length > 0 ? latestClusters : allClusters),
    [allClusters, latestClusters]
  );
  const hasClusterData = useMemo(() => clusters.length > 0, [clusters]);

  if (isLoading) {
    return (
      <LoadingContainer isLoading={isLoading}>
        <div></div>
      </LoadingContainer>
    );
  }

  if (!hasClusterData) {
    return (
      <div className="flex-1 flex items-center justify-center h-full">
        <ConnectCluster />
      </div>
    );
  }

  return (
    <>
      <ClusterDetailsList clusters={clusters} isFetching={false} fetchNextPage={() => {}} />
    </>
  );
};

export default ClientClusterView;
