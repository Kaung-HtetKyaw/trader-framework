import { useGetK8sObjectsQuery } from '@/store/api/clusterApi';
import { EntityNode } from '@/types/visualization';
import { K8sObjectTypes } from '@/types/visualization/k8sObjects';
import { useMemo } from 'react';
import { K8S_OBJECT_FIELDS } from '@/app/(root)/visualization/VisualizationFilters';
import { getAggregatedNamespaceHealthStatus } from '../visualization/nodes/utils';
import { getContainerID } from '../utils/objects';

export type UseGetCompleteClusterWideObjects = {
  clusterID: string;
};

const useGetCompleteClusterWideObjects = (props: UseGetCompleteClusterWideObjects) => {
  const { clusterID } = props;

  const {
    data,
    isLoading: isK8sObjectsLoading,
    refetch: refetchK8sObjects,
    isFetching: isK8sObjectsFetching,
  } = useGetK8sObjectsQuery({
    filter: {
      clusterID,
    },
    fields: K8S_OBJECT_FIELDS,
  });

  const objectsData = useMemo(() => data?.items || [], [data]);

  const clusterWideObjects = useMemo(() => {
    return objectsData?.filter(el => !el.namespace) || [];
  }, [objectsData]);

  const namespacedObjects = useMemo(() => {
    return objectsData?.filter(el => !!el.namespace) || [];
  }, [objectsData]);

  const namespaceIdMap = useMemo(() => {
    const map: Record<string, string> = {};

    clusterWideObjects.forEach(el => {
      if (el.kind === 'Namespace') {
        map[el.name] = el.id;
      }
    });

    return map;
  }, [clusterWideObjects]);

  const nonGroupNamespacedObjects = useMemo(
    () =>
      namespacedObjects
        .filter(el => el.kind !== K8sObjectTypes.Pod)
        .map(el => {
          return {
            id: el.id,
            name: el.name,
            kind: el.kind,
            parent: el.namespace ? namespaceIdMap[el.namespace] : undefined,
            healthStatus: el.healthStatus,
            apiVersions: el.apiVersion ? [el.apiVersion] : [],
            children: [],
          };
        }),
    [namespacedObjects, namespaceIdMap]
  );

  const groupNamespacedObjects = useMemo(
    () =>
      namespacedObjects
        .filter(el => el.kind === K8sObjectTypes.Pod)
        .map(el => {
          return {
            id: el.id,
            name: el.name,
            kind: el.kind,
            parent: el.namespace ? namespaceIdMap[el.namespace] : undefined,
            healthStatus: el.healthStatus,
            apiVersions: el.apiVersion ? [el.apiVersion] : [],
            children:
              el?.spec?.containers?.map(container => ({
                id: getContainerID(el.id, container.name),
                name: container.name,
                kind: K8sObjectTypes.Container,
                parent: el.id,
                healthStatus: el.healthStatus,
                apiVersions: el.apiVersion ? [el.apiVersion] : [],
                children: [],
              })) || [],
          };
        }),
    [namespacedObjects, namespaceIdMap]
  );

  const hierarchicalNamespacedObjects: EntityNode[] = useMemo(() => {
    return [...nonGroupNamespacedObjects, ...groupNamespacedObjects];
  }, [nonGroupNamespacedObjects, groupNamespacedObjects]);

  const hierarchicalClusterWideObjects: EntityNode[] = useMemo(() => {
    const unsortedClusterWideObjects = clusterWideObjects.map(el => {
      const isNamespace = el.kind === K8sObjectTypes.Namespace;

      return {
        ...el,
        apiVersions: el.apiVersion ? [el.apiVersion] : [],
        healthStatus: isNamespace
          ? getAggregatedNamespaceHealthStatus(hierarchicalNamespacedObjects.filter(ns => ns.parent === el.id))
          : el.healthStatus,
        children: isNamespace ? hierarchicalNamespacedObjects.filter(ns => ns.parent === el.id) : [],
      };
    });

    const nonNamespaceObjects = unsortedClusterWideObjects.filter(el => el.kind !== K8sObjectTypes.Namespace);
    const namespaceObjects = unsortedClusterWideObjects
      .filter(el => el.kind === K8sObjectTypes.Namespace)
      .sort((a, b) => a.children.length - b.children.length);

    return [...nonNamespaceObjects, ...namespaceObjects];
  }, [clusterWideObjects, hierarchicalNamespacedObjects]);

  return {
    data: hierarchicalClusterWideObjects,
    isLoading: isK8sObjectsLoading,
    refetch: refetchK8sObjects,
    isFetching: isK8sObjectsFetching,
  };
};

export default useGetCompleteClusterWideObjects;
