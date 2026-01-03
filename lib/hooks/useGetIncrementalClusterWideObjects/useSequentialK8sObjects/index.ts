import { useGetK8sObjectsQuery, useLazyGetK8sObjectsQuery } from '@/store/api/clusterApi';
import { EntityNode, K8sContextObject } from '@/types/visualization';
import { K8sObjectTypes } from '@/types/visualization/k8sObjects';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { getClusterChildrenByKind, getNamespacedObjects, getAggregatedNamespaceHealthStatus } from './utils';
import { VisualizationLayoutTypeEnum, VisualizationLayoutTypes } from '@/types/visualization/react-flow';
import useQueryParams from '../../useQueryParams';
import { VisualizationListFilterParams } from '@/types/visualization/list';
import { changeLoading } from '@/signals/visualiation/misc';
import { K8S_OBJECT_FIELDS } from '@/app/(root)/visualization/VisualizationFilters';

export type UseGetIncrementalClusterWideObjects = {
  clusterID: string;
  layoutType?: VisualizationLayoutTypeEnum;
};

const useGetIncrementalClusterWideObjects = (props: UseGetIncrementalClusterWideObjects) => {
  const { clusterID, layoutType = VisualizationLayoutTypes.hierarchy } = props;

  const { params } = useQueryParams<VisualizationListFilterParams>({
    listKeys: ['kind'],
  });

  const cwoFilters = useMemo(() => {
    if (params.allClusterWideObjects || !!params.excludedClusterWideObject || !!params.clusterWideObject) {
      return {};
    }

    return {
      kind: K8sObjectTypes.Namespace,
    };
  }, [params.clusterWideObject, params.excludedClusterWideObject, params.allClusterWideObjects]);

  const [namespacedObjectMap, setNamespacedObjectMap] = useState<Record<string, K8sContextObject[]>>({});
  const [isSequentialLoadFinished, setSequentialLoadFinished] = useState(false);
  const { data: clusterWideK8sObjectsData, isLoading: isClusterWideK8sObjectsLoading } = useGetK8sObjectsQuery({
    filter: {
      clusterID,
      namespaced: false,
      ...cwoFilters,
    },
    fields: K8S_OBJECT_FIELDS,
  });

  const [triggerGetK8sObjects, { isLoading: isGetK8sObjectsLoading }] = useLazyGetK8sObjectsQuery();

  const clusterWideK8sObjects = useMemo(() => clusterWideK8sObjectsData?.items || [], [clusterWideK8sObjectsData]);

  const individualClusterWideObjects = useMemo(() => {
    return clusterWideK8sObjects?.filter(k8sObject => k8sObject.kind !== K8sObjectTypes.Namespace) || [];
  }, [clusterWideK8sObjects]);

  // all namespaces regardless of the children are fetched or not
  const allGroupClusterWideObjects = useMemo(() => {
    return clusterWideK8sObjects?.filter(k8sObject => k8sObject.kind === K8sObjectTypes.Namespace) || [];
  }, [clusterWideK8sObjects]);

  // all namespaces that have children fetched
  const groupClusterWideObjects = useMemo(() => {
    return (
      clusterWideK8sObjects?.filter(
        k8sObject => k8sObject.kind === K8sObjectTypes.Namespace && !!namespacedObjectMap[k8sObject.name]
      ) || []
    );
  }, [clusterWideK8sObjects, namespacedObjectMap]);

  const clusterWideObjects = useMemo(() => {
    return [...individualClusterWideObjects, ...groupClusterWideObjects];
  }, [individualClusterWideObjects, groupClusterWideObjects]);

  const namespaceIdMap = useMemo(() => {
    const map: Record<string, string> = {};

    allGroupClusterWideObjects.forEach(el => {
      map[el.name] = el.id;
    });

    return map;
  }, [allGroupClusterWideObjects]);

  const addToNamespacedObjectMap = useCallback((namespace: string, objects: K8sContextObject[]) => {
    setNamespacedObjectMap(prev => ({ ...prev, [namespace]: objects }));
  }, []);

  const loadNamespacedObjects = useCallback(
    async (namespace: string) => {
      try {
        const { data: result } = await triggerGetK8sObjects({
          filter: {
            clusterID,
            namespace,
          },
          fields: K8S_OBJECT_FIELDS,
        });

        if (!result) return;

        addToNamespacedObjectMap(namespace, result?.items || []);
      } catch {
        console.log(`Error fetching children of ${namespace}`);
      }
    },
    [clusterID, triggerGetK8sObjects, addToNamespacedObjectMap]
  );

  const getNamespaceChildren = useCallback(async () => {
    await Promise.all(allGroupClusterWideObjects.map(async namespace => await loadNamespacedObjects(namespace.name)));
  }, [allGroupClusterWideObjects, loadNamespacedObjects]);

  const namespacedObjects = useMemo(() => {
    return Object.values(namespacedObjectMap).flat();
  }, [namespacedObjectMap]);

  const hierarchicalNamespacedObjects: EntityNode[] = useMemo(() => {
    return getNamespacedObjects({
      objects: namespacedObjects,
      layoutType: layoutType,
      idMap: namespaceIdMap,
    });
  }, [namespacedObjects, namespaceIdMap, layoutType]);

  const hierarchicalClusterWideObjects: EntityNode[] = useMemo(() => {
    const filteredClusterWideObjects = clusterWideObjects.filter(el => {
      if (!params.kind) return true;
      return params.kind.includes(el.kind);
    });

    const unsortedClusterWideObjects = filteredClusterWideObjects.map(el => {
      const isNamespace = el.kind === K8sObjectTypes.Namespace;

      const namespacedChildren = getClusterChildrenByKind(
        hierarchicalNamespacedObjects.filter(ns => ns.parent === el.id),
        params.kind
      );

      const aggregatedHealthStatus = isNamespace
        ? getAggregatedNamespaceHealthStatus(namespacedChildren)
        : el.healthStatus;

      return {
        ...el,
        apiVersions: el.apiVersion ? [el.apiVersion] : [],
        healthStatus: aggregatedHealthStatus,
        children: isNamespace ? namespacedChildren : [],
        connections: [],
      };
    });

    const nonNamespaceObjects = unsortedClusterWideObjects.filter(el => el.kind !== K8sObjectTypes.Namespace);
    const namespaceObjects = unsortedClusterWideObjects
      .filter(el => el.kind === K8sObjectTypes.Namespace)
      .sort((a, b) => a.children.length - b.children.length);
    const children = nonNamespaceObjects.concat(namespaceObjects);

    return children;
  }, [clusterWideObjects, hierarchicalNamespacedObjects, params.kind]);

  const isLoading = useMemo(
    () => isClusterWideK8sObjectsLoading || !isSequentialLoadFinished,
    [isClusterWideK8sObjectsLoading, isSequentialLoadFinished]
  );

  useEffect(() => {
    if (isClusterWideK8sObjectsLoading || isLoading) {
      changeLoading(true);
    } else {
      changeLoading(false);
    }
  }, [isClusterWideK8sObjectsLoading, isLoading]);

  // start fetching children of namespaces on mount
  useEffect(() => {
    if (!clusterWideK8sObjects) return;

    getNamespaceChildren().then(() => {
      setSequentialLoadFinished(true);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clusterWideK8sObjects]);

  return {
    data: hierarchicalClusterWideObjects,
    isClusterWideK8sObjectsLoading,
    isSequentialK8sObjectsLoading: isLoading || isGetK8sObjectsLoading,
    isSequentialLoadFinished,
  };
};

export default useGetIncrementalClusterWideObjects;
