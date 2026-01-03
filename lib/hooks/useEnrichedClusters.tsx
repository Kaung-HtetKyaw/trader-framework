import { useMemo } from 'react';
import { Cluster } from '@/types/cluster';
import { useGetClusterByIdQuery, useGetClusterGroupsQuery } from '@/store/api/clusterApi';
import { useGetClustersWithStatsInfiniteQuery } from '@/store/api/clusterApi';

export type EnrichedCluster = Cluster & {
  group: string;
};

export const useEnrichedClusterList = (options?: { pollingInterval?: number; skip?: boolean }) => {
  const { data: clusterGroupData = [] } = useGetClusterGroupsQuery();
  const { data, isLoading, isFetching } = useGetClustersWithStatsInfiniteQuery(
    {},
    {
      pollingInterval: options?.pollingInterval ?? 0,
      skip: options?.skip ?? false,
    }
  );

  const clusters = useMemo(() => data?.pages?.flat().filter(Boolean) ?? [], [data]);

  const enrichedClusters: EnrichedCluster[] = useMemo(() => {
    const groupMap = new Map(clusterGroupData.map(g => [g.id, g.name]));

    return clusters.map(cluster => ({
      ...cluster,
      group: groupMap.get(cluster.clusterGroupID) ?? 'Unknown',
    }));
  }, [clusters, clusterGroupData]);

  return {
    clusters: enrichedClusters,
    raw: clusters,
    isLoading,
    isFetching,
    data,
  };
};

export const useEnrichedCluster = (id: string, options?: { pollingInterval?: number; skip?: boolean }) => {
  const {
    data: clusterGroupData = [],
    isLoading: isLoadingClusterGroups,
    isFetching: isFetchingClusterGroups,
  } = useGetClusterGroupsQuery();

  const {
    data: clusterData,
    isLoading: isLoadingCluster,
    isFetching: isFetchingCluster,
  } = useGetClusterByIdQuery(
    { id, includeStats: true },
    {
      pollingInterval: options?.pollingInterval ?? 0,
      skip: options?.skip ?? false,
    }
  );

  const group = useMemo(() => {
    const clusterGroup = clusterGroupData.find(g => g.id === clusterData?.clusterGroupID);
    return clusterGroup?.name ?? 'Unknown';
  }, [clusterGroupData, clusterData]);

  const cluster: Cluster | undefined = useMemo(() => {
    if (!clusterData) return undefined;

    return { ...clusterData, group };
  }, [clusterData, group]);

  return {
    cluster,
    raw: clusterData,
    isLoading: isLoadingClusterGroups || isLoadingCluster,
    isFetching: isFetchingClusterGroups || isFetchingCluster,
  };
};
