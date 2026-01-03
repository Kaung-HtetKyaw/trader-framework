import { useGetK8sObjectsQuery } from '@/store/api/clusterApi';
import { EntityNode } from '@/types/visualization';
import { K8sObjectTypes } from '@/types/visualization/k8sObjects';
import { VisualizationLayoutTypeEnum } from '@/types/visualization/react-flow';
import { useCallback, useEffect, useMemo } from 'react';
import { changeLoading } from '@/signals/visualiation/misc';
import { ListObjectSelectionField } from '@/types/visualization/list';

export type UseGetMinimalCWOProps = {
  clusterID: string;
  skipOnRender?: boolean;
  layoutType?: VisualizationLayoutTypeEnum;
};

const FIELDS: ListObjectSelectionField[] = [
  'id',
  'namespace',
  'name',
  'kind',
  'healthStatus',
  'clusterID',
  'apiVersion',
];

const useGetMinimalCWO = (props: UseGetMinimalCWOProps) => {
  const { clusterID } = props;

  const {
    data: clusterWideK8sObjectsData,
    isLoading,
    refetch: refetchClusterWideK8sObjects,
    isFetching,
  } = useGetK8sObjectsQuery({
    filter: {
      clusterID,
      namespaced: false,
    },
    fields: FIELDS,
  });

  const refetchCWO = useCallback(() => {
    return refetchClusterWideK8sObjects();
  }, [refetchClusterWideK8sObjects]);

  const clusterWideObjects = useMemo(() => {
    return clusterWideK8sObjectsData?.items || [];
  }, [clusterWideK8sObjectsData]);

  const hierarchicalClusterWideObjects: EntityNode[] = useMemo(() => {
    const unsortedClusterWideObjects: EntityNode[] = clusterWideObjects.map(el => {
      return {
        ...el,
        apiVersions: el?.apiVersion ? [el.apiVersion] : [],
        children: [],
      };
    });

    const nonNamespaceObjects = unsortedClusterWideObjects.filter(el => el.kind !== K8sObjectTypes.Namespace);
    const namespaceObjects = unsortedClusterWideObjects.filter(el => el.kind === K8sObjectTypes.Namespace);

    return [...nonNamespaceObjects, ...namespaceObjects];
  }, [clusterWideObjects]);

  const data = useMemo(() => {
    if (!clusterWideObjects) return [];

    return hierarchicalClusterWideObjects;
  }, [hierarchicalClusterWideObjects, clusterWideObjects]);

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
    refetch: refetchCWO,
    isFetching,
  };
};

export default useGetMinimalCWO;
