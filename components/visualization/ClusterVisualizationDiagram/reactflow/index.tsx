import { useGetClusterByIdQuery } from '@/store/api/clusterApi';
import { ReactFlowProvider } from '@xyflow/react';
import RFDependencyGraphDiagram from './RFDependencyGraphDiagram';
import { useRefresh } from '@/context/VisualizationRefreshContext';
import { useMemo, useEffect, memo, useCallback } from 'react';
import { K8sObjectTypeEnum, K8sObjectTypes } from '@/types/visualization/k8sObjects';
import VisualizationLoader from '../VisualizationLoader';
import { EntityNode, HealthStatus } from '@/types/visualization';
import { getVisualizationNodes } from '@/lib/visualization/nodes';
import { VisualizationLayoutTypes } from '@/types/visualization/react-flow';
import useSetSelectCluster from '@/lib/hooks/useSetSelectCluster';
import useGetDeferredVisualizationObjects from '@/lib/hooks/useGetDeferredVisualizationObjects';
import { changeLoading, getIsRepositioning, resetOnDemandLoading } from '@/signals/visualiation/misc';
import { VisualizationListFilterParams } from '@/types/visualization/list';
import useQueryParams from '@/lib/hooks/useQueryParams';
import { getFilteredClusterChildrenByParams } from '@/lib/hooks/useVisualizationFilters/helpers';

export type RFClusterVisualizationDiagramProps = {
  id: string;
  refreshKey?: number;
};

const listKeys: (keyof VisualizationListFilterParams)[] = ['namespace', 'clusterWideObject'];

const RFClusterVisualizationDiagram = ({ id, refreshKey }: RFClusterVisualizationDiagramProps) => {
  const { data: clusterData, isLoading: isClusterDataLoading } = useGetClusterByIdQuery({
    id: id as string,
    includeStats: false,
  });
  const { params } = useQueryParams<VisualizationListFilterParams>({
    listKeys,
  });

  useSetSelectCluster(clusterData?.name || '');

  const {
    data: clusterWideObject,
    refetch,
    isFetching,
    isLoading,
    isRefetching,
    loadNamespacedObjects,
    loadCWOObjects,
  } = useGetDeferredVisualizationObjects({ clusterID: id as string });

  const { setDisableRefresh, setIsRefreshing } = useRefresh();

  // Refetch when refreshKey changes
  useEffect(() => {
    if (refreshKey !== undefined && !isLoading && !isFetching) {
      refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey]);

  useEffect(() => {
    if (setDisableRefresh) {
      setDisableRefresh(isClusterDataLoading);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isClusterDataLoading]);

  useEffect(() => {
    if (setIsRefreshing) {
      setIsRefreshing(isFetching || isLoading);
    }

    return () => {
      setIsRefreshing(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetching, isFetching, isLoading]);

  // Reset zoom and loading states when the component is mounted and unmounted to clean up
  useEffect(() => {
    resetOnDemandLoading();
    return () => {
      resetOnDemandLoading();
    };
  }, []);

  const clusterWideData: EntityNode | undefined = useMemo(() => {
    if (!clusterData) return undefined;

    return {
      id: clusterData.id,
      name: clusterData.name,
      kind: K8sObjectTypes.Cluster,
      healthStatus: HealthStatus.Unknown,
      children: clusterWideObject,
      apiVersions: [],
      connections: [],
    };
  }, [clusterData, clusterWideObject]);

  const filteredClusterData: EntityNode | undefined = useMemo(() => {
    if (!clusterWideData) return undefined;

    return getFilteredClusterChildrenByParams(clusterWideData, params);
  }, [clusterWideData, params]);

  const nodes = useMemo(() => {
    if (!filteredClusterData) return [];

    return getVisualizationNodes({
      nodes: [filteredClusterData],
      layoutType: VisualizationLayoutTypes.hierarchy,
    });
  }, [filteredClusterData]);

  const edges = useMemo(() => {
    return nodes.map(el => el.data?.connections || []).flat();
  }, [nodes]);

  const isInitialDataLoading = useMemo(() => isClusterDataLoading || isLoading, [isClusterDataLoading, isLoading]);

  const onZoomToLoad = useCallback(
    (id: string, type: K8sObjectTypeEnum) => {
      if (type === K8sObjectTypes.Namespace) {
        return loadNamespacedObjects(id);
      }

      if (type === K8sObjectTypes.CWOGroup) {
        return loadCWOObjects(id as K8sObjectTypeEnum);
      }

      return Promise.resolve([]);
    },
    [loadNamespacedObjects, loadCWOObjects]
  );

  useEffect(() => {
    changeLoading(isLoading);
  }, [isLoading]);

  if (isInitialDataLoading) {
    return <VisualizationLoader isLoading={isInitialDataLoading} />;
  }

  return (
    <ReactFlowProvider>
      <RFDependencyGraphDiagram
        isLoading={isLoading || isRefetching || getIsRepositioning()}
        nodes={nodes}
        edges={edges}
        onZoomToLoad={onZoomToLoad}
      />
    </ReactFlowProvider>
  );
};

export default memo(RFClusterVisualizationDiagram);
