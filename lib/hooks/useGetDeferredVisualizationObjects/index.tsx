import { EntityNode, HealthStatus, K8sContextObject } from '@/types/visualization';
import { K8sObjectTypeEnum, K8sObjectTypes } from '@/types/visualization/k8sObjects';
import { VisualizationLayoutTypeEnum, VisualizationLayoutTypes } from '@/types/visualization/react-flow';
import { useCallback, useMemo, useState } from 'react';
import {
  getClusterChildrenByKind,
  getNamespacedObjects,
} from '../useGetIncrementalClusterWideObjects/useSequentialK8sObjects/utils';
import useGetCWO from './useGetCWO';
import useGetNamespacedObjects from './useGetNamespacedObjects';
import { getAggregatedNamespaceHealthStatus } from '@/lib/visualization/nodes/utils';
import useQueryParams from '../useQueryParams';
import { VisualizationListFilterParams } from '@/types/visualization/list';
import useSyncDeferredDataOnIdle from './useSyncDeferredDataOnIdle';
import useGetMinimalCWO from './useGetMinimalCWO';

export type UseGetDeferredVisualizationObjectsProps = {
  clusterID: string;
  layoutType?: VisualizationLayoutTypeEnum;
};

const useGetDeferredVisualizationObjects = (props: UseGetDeferredVisualizationObjectsProps) => {
  const { clusterID, layoutType = VisualizationLayoutTypes.hierarchy } = props;

  const [isRefetching, setIsRefetching] = useState(false);

  const [cwoObjectMap, setDeferredtCwoObjectMap] = useSyncDeferredDataOnIdle({});
  const [namespacedObjectMap, setDeferredNamespacedObjectMap] = useSyncDeferredDataOnIdle({});

  const { params } = useQueryParams<VisualizationListFilterParams>({
    listKeys: ['kind'],
  });

  const {
    data: clusterWideObjects,
    isLoading: isInitialDataLoading,
    refetch: refetchClusterWideObjects,
    isFetching: isInitialDataFetching,
  } = useGetMinimalCWO({ clusterID });

  const addToDeferredCWOObjects = useCallback(
    (kind: K8sObjectTypeEnum, objects: K8sContextObject[]) => {
      setDeferredtCwoObjectMap(prev => {
        if (kind === K8sObjectTypes.Namespace) {
          return prev;
        }
        return { ...prev, [kind]: objects };
      });
    },
    [setDeferredtCwoObjectMap]
  );

  const addToDeferredNamespacedObjects = useCallback(
    (namespace: string, objects: K8sContextObject[]) => {
      setDeferredNamespacedObjectMap(prev => ({ ...prev, [namespace]: objects }));
    },
    [setDeferredNamespacedObjectMap]
  );

  const {
    load: loadCWOObjects,
    isLoading: isCWOObjectsLoading,
    isFetching: isCWOObjectsFetching,
  } = useGetCWO({ clusterID, onSuccess: addToDeferredCWOObjects });

  const {
    load: loadNamespacedObjects,
    isLoading: isNamespacedObjectsLoading,
    isFetching: isNamespacedObjectsFetching,
  } = useGetNamespacedObjects({ clusterID, onSuccess: addToDeferredNamespacedObjects });

  const namespaceIdMap = useMemo(() => {
    const map: Record<string, string> = {};

    clusterWideObjects.forEach(el => {
      map[el.name] = el.id;
    });

    return map;
  }, [clusterWideObjects]);

  const namespacedObjects = useMemo(() => {
    return Object.values(namespacedObjectMap)
      .flat()
      .filter(el => !!el);
  }, [namespacedObjectMap]);

  const objectKinds = useMemo(() => {
    const set = clusterWideObjects.reduce((acc, el) => {
      if (el.kind === K8sObjectTypes.Namespace) {
        return acc;
      }
      acc.add(el.kind);
      return acc;
    }, new Set<K8sObjectTypeEnum>());

    return Array.from(set);
  }, [clusterWideObjects]);

  const cwoGroups: EntityNode[] = useMemo(() => {
    return objectKinds.map((kind: K8sObjectTypeEnum) => {
      const isLoaded = typeof cwoObjectMap[kind] !== 'undefined';
      const children: EntityNode[] = clusterWideObjects
        .filter(el => el.kind === kind)
        .map(node => ({
          id: node.id,
          name: node.name,
          namespace: node.namespace,
          kind: node.kind,
          apiVersions: node.apiVersions,
          parent: kind,
          healthStatus: node.healthStatus,
          children: [],
        }));

      const allApiVersions = children.flatMap(el => el.apiVersions || []);
      const groupApiVersions = Array.from(new Set(allApiVersions));

      return {
        id: kind,
        name: kind,
        namespace: undefined,
        apiVersions: groupApiVersions,
        kind: isLoaded ? K8sObjectTypes.CWOGroup : K8sObjectTypes.PlaceHolderCWOGroup,
        healthStatus: HealthStatus.Unknown,
        placeholder: !isLoaded,
        children,
        connections: [],
      };
    });
  }, [objectKinds, clusterWideObjects, cwoObjectMap]);

  const hierarchicalNamespacedObjects: EntityNode[] = useMemo(() => {
    return getNamespacedObjects({
      objects: namespacedObjects,
      layoutType: layoutType,
      idMap: namespaceIdMap,
    });
  }, [namespacedObjects, namespaceIdMap, layoutType]);

  const hierarchicalClusterWideObjects: EntityNode[] = useMemo(() => {
    const filteredMinimalClusterWideObjects = clusterWideObjects
      .filter(el => {
        if (!params.kind) return true;
        return params.kind.includes(el.kind);
      })
      .map(el => ({
        ...el,
        children: [],
      }));

    const namespaces = filteredMinimalClusterWideObjects.filter(el => el.kind === K8sObjectTypes.Namespace);

    const namespaceGroups = namespaces.map(el => {
      const isPlaceholder = typeof namespacedObjectMap[el.name] === 'undefined';
      const children = getClusterChildrenByKind(
        hierarchicalNamespacedObjects.filter(ns => ns.parent === el.id),
        params.kind
      );

      const aggregatedHealthStatus = getAggregatedNamespaceHealthStatus(children);

      return {
        ...el,
        healthStatus: aggregatedHealthStatus,
        children,
        apiVersions: el.apiVersions,
        kind: isPlaceholder ? K8sObjectTypes.PlaceHolderNamespaceGroup : K8sObjectTypes.Namespace,
        placeholder: isPlaceholder,
        connections: [],
      };
    });

    const children = cwoGroups.concat(namespaceGroups);

    return children;
  }, [clusterWideObjects, hierarchicalNamespacedObjects, params.kind, namespacedObjectMap, cwoGroups]);

  const data = useMemo(() => {
    if (!clusterWideObjects) return [];

    return hierarchicalClusterWideObjects;
  }, [clusterWideObjects, hierarchicalClusterWideObjects]);

  const refetch = useCallback(() => {
    setIsRefetching(true);
    refetchClusterWideObjects()
      .then(async res => {
        if (res.data) {
          const namespaceNames = Object.keys(namespacedObjectMap);
          await Promise.all(namespaceNames.map(async namespace => await loadNamespacedObjects(namespace)));
        }
      })
      .finally(() => {
        setIsRefetching(false);
      });
  }, [refetchClusterWideObjects, loadNamespacedObjects, namespacedObjectMap]);

  const isLoading = useMemo(() => isInitialDataLoading, [isInitialDataLoading]);

  const isFetching = useMemo(() => {
    return (
      !isNamespacedObjectsLoading &&
      !isCWOObjectsLoading &&
      (isInitialDataFetching || isCWOObjectsFetching || isNamespacedObjectsFetching)
    );
  }, [
    isInitialDataFetching,
    isNamespacedObjectsFetching,
    isNamespacedObjectsLoading,
    isCWOObjectsLoading,
    isCWOObjectsFetching,
  ]);

  return {
    data,
    loadNamespacedObjects,
    loadCWOObjects,
    isLoading,
    refetch,
    isFetching,
    isRefetching,
  };
};

export default useGetDeferredVisualizationObjects;
