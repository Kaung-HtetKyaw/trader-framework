import { K8S_OBJECT_FIELDS } from '@/app/(root)/visualization/VisualizationFilters';
import { changeNamespaceLoading } from '@/signals/visualiation/misc';
import { useLazyGetK8sObjectsQuery } from '@/store/api/clusterApi';
import { K8sContextObject } from '@/types/visualization';
import { useSignals } from '@preact/signals-react/runtime';
import { useCallback } from 'react';

export type UseGetNamespacedObjectsProps = {
  clusterID: string;
  onSuccess: (namespace: string, data: K8sContextObject[]) => void;
};

export type LoadNamespacedObjectsFn = (namespace: string) => Promise<K8sContextObject[]>;

const useGetNamespacedObjects = (props: UseGetNamespacedObjectsProps) => {
  useSignals();
  const { clusterID, onSuccess } = props;

  const [
    triggerGetNamespacedObjects,
    { isLoading: isNamespacedObjectsLoading, isFetching: isNamespacedObjectsFetching },
  ] = useLazyGetK8sObjectsQuery();

  const loadNamespacedObjects: LoadNamespacedObjectsFn = useCallback(
    (namespace: string) => {
      changeNamespaceLoading(namespace);
      return triggerGetNamespacedObjects({
        filter: {
          clusterID,
          namespace,
        },
        fields: K8S_OBJECT_FIELDS,
      })
        .then(res => {
          onSuccess(namespace, res.data?.items || []);
          return res.data?.items || [];
        })
        .finally(() => {
          changeNamespaceLoading(namespace);
        });
    },
    [triggerGetNamespacedObjects, onSuccess, clusterID]
  );

  return {
    isLoading: isNamespacedObjectsLoading,
    isFetching: isNamespacedObjectsFetching,
    load: loadNamespacedObjects,
  };
};

export default useGetNamespacedObjects;
