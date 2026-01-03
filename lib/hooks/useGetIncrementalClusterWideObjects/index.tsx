import { useMemo } from 'react';
import useGetCompleteClusterWideObjects from './useGetCompleteK8sObjects';
import useGetSequentialK8sObjects from './useSequentialK8sObjects';
import { VisualizationLayoutTypeEnum, VisualizationLayoutTypes } from '@/types/visualization/react-flow';

export type UseGetIncrementalClusterWideObjectsProps = {
  clusterID: string;
  layoutType?: VisualizationLayoutTypeEnum;
};

const useGetIncrementalClusterWideObjects = (props: UseGetIncrementalClusterWideObjectsProps) => {
  const { clusterID, layoutType = VisualizationLayoutTypes.hierarchy } = props;

  const {
    data: completeK8sObjects,
    refetch: refetchCompleteK8sObjects,
    isFetching: isCompleteK8sObjectsFetching,
  } = useGetCompleteClusterWideObjects({
    clusterID,
    skipOnRender: true,
    layoutType,
  });

  const {
    data: sequentialK8sObjects,
    isClusterWideK8sObjectsLoading,
    isSequentialK8sObjectsLoading,
    isSequentialLoadFinished,
  } = useGetSequentialK8sObjects({
    clusterID,
    layoutType,
  });

  const data = useMemo(() => {
    if (completeK8sObjects) return completeK8sObjects;

    return sequentialK8sObjects;
  }, [sequentialK8sObjects, completeK8sObjects]);

  return {
    isClusterWideObjectsLoading: isClusterWideK8sObjectsLoading,
    isSequentialObjectsLoading: isSequentialK8sObjectsLoading,
    isFetching: isCompleteK8sObjectsFetching,
    refetch: refetchCompleteK8sObjects,
    data,
    isSequentialLoadFinished,
  };
};

export default useGetIncrementalClusterWideObjects;
