import { useLazyGetK8sObjectsQuery } from '@/store/api/clusterApi';
import { EntityNode, K8sContextObject } from '@/types/visualization';
import { K8sObjectTypes } from '@/types/visualization/k8sObjects';
import { VisualizationLayoutTypeEnum, VisualizationLayoutTypes } from '@/types/visualization/react-flow';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { getNamespacedObjects, getAggregatedNamespaceHealthStatus } from './useSequentialK8sObjects/utils';
import { K8S_OBJECT_FIELDS } from '@/app/(root)/visualization/VisualizationFilters';
import { changeLoading } from '@/signals/visualiation/misc';

export type UseGetCompleteClusterWideObjects = {
  clusterID: string;
  skipOnRender?: boolean;
  layoutType?: VisualizationLayoutTypeEnum;
};

const useGetCompleteClusterWideObjects = (props: UseGetCompleteClusterWideObjects) => {
  const { clusterID, skipOnRender, layoutType = VisualizationLayoutTypes.hierarchy } = props;
  const [k8sObjects, setK8sObjects] = useState<K8sContextObject[] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const [triggerGetK8sObjects] = useLazyGetK8sObjectsQuery();

  const loadK8sObjects = useCallback(() => {
    setIsLoading(true);

    triggerGetK8sObjects({
      filter: {
        clusterID,
      },
      fields: K8S_OBJECT_FIELDS,
    })
      .then(({ data }) => {
        if (!data) return;
        setK8sObjects(data?.items || []);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, [clusterID, triggerGetK8sObjects]);

  const fetchK8sObjects = useCallback(() => {
    setIsFetching(true);

    triggerGetK8sObjects({
      filter: {
        clusterID,
      },
      fields: K8S_OBJECT_FIELDS,
    })
      .then(({ data }) => {
        if (!data) return;
        setK8sObjects(data?.items || []);
        setIsFetching(false);
      })
      .catch(() => {
        setIsFetching(false);
      });
  }, [clusterID, triggerGetK8sObjects]);

  useEffect(() => {
    if (!k8sObjects || skipOnRender) return;
    loadK8sObjects();
  }, [clusterID, k8sObjects, loadK8sObjects, skipOnRender]);

  const clusterWideObjects = useMemo(() => {
    return k8sObjects?.filter(el => !el.namespace) || [];
  }, [k8sObjects]);

  const namespacedObjects = useMemo(() => {
    return k8sObjects?.filter(el => !!el.namespace) || [];
  }, [k8sObjects]);

  const namespaceIdMap = useMemo(() => {
    const map: Record<string, string> = {};

    clusterWideObjects.forEach(el => {
      if (el.kind === 'Namespace') {
        map[el.name] = el.id;
      }
    });

    return map;
  }, [clusterWideObjects]);

  const hierarchicalNamespacedObjects: EntityNode[] = useMemo(() => {
    return getNamespacedObjects({
      objects: namespacedObjects,
      layoutType: layoutType,
      idMap: namespaceIdMap,
    });
  }, [namespacedObjects, namespaceIdMap, layoutType]);

  const hierarchicalClusterWideObjects: EntityNode[] = useMemo(() => {
    const unsortedClusterWideObjects = clusterWideObjects.map(el => {
      const isNamespace = el.kind === K8sObjectTypes.Namespace;
      const namespacedChildren = isNamespace ? hierarchicalNamespacedObjects.filter(ns => ns.parent === el.id) : [];

      return {
        ...el,
        apiVersions: el.apiVersion ? [el.apiVersion] : [],
        children: namespacedChildren,
        healthStatus: isNamespace ? getAggregatedNamespaceHealthStatus(namespacedChildren) : el.healthStatus,
      };
    });

    const nonNamespaceObjects = unsortedClusterWideObjects.filter(el => el.kind !== K8sObjectTypes.Namespace);
    const namespaceObjects = unsortedClusterWideObjects
      .filter(el => el.kind === K8sObjectTypes.Namespace)
      .sort((a, b) => a.children.length - b.children.length);

    return [...nonNamespaceObjects, ...namespaceObjects];
  }, [clusterWideObjects, hierarchicalNamespacedObjects]);

  const refetch = () => {
    fetchK8sObjects();
  };

  const data = useMemo(() => {
    if (!k8sObjects) return undefined;

    return hierarchicalClusterWideObjects;
  }, [hierarchicalClusterWideObjects, k8sObjects]);

  useEffect(() => {
    if (isFetching || isLoading) {
      changeLoading(true);
    } else {
      changeLoading(false);
    }
  }, [isFetching, isLoading]);

  return {
    data,
    isLoading,
    refetch,
    isFetching,
  };
};

export default useGetCompleteClusterWideObjects;
