import { useMemo } from 'react';
import { Cluster, ClusterGroupWithStats } from '@/types/cluster';
import { mapClustersToFrontendGroups } from '../utils';
import { useGetClusterGroupsQuery } from '@/store/api/clusterApi';

export const useEnrichedClusterGroups = (clustersFromQuery: Cluster[] = []) => {
  const { data: groups, isLoading: loadingGroups } = useGetClusterGroupsQuery();

  const enrichedGroups: ClusterGroupWithStats[] = useMemo(() => {
    if (!clustersFromQuery || !groups) return [];
    return mapClustersToFrontendGroups(groups, clustersFromQuery);
  }, [clustersFromQuery, groups]);

  return {
    clusterGroups: enrichedGroups,
    loading: loadingGroups,
  };
};
