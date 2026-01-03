import { K8S_OBJECT_FIELDS } from '@/app/(root)/visualization/VisualizationFilters';
import { changeCWOLoading } from '@/signals/visualiation/misc';
import { useLazyGetK8sObjectsQuery } from '@/store/api/clusterApi';
import { K8sContextObject } from '@/types/visualization';
import { K8sObjectTypeEnum } from '@/types/visualization/k8sObjects';
import { useSignals } from '@preact/signals-react/runtime';
import { useCallback } from 'react';

export type UseGetCWOProps = {
  clusterID: string;
  onSuccess: (kind: K8sObjectTypeEnum, data: K8sContextObject[]) => void;
};

export type LoadCWOObjectsFn = (kind: K8sObjectTypeEnum) => Promise<K8sContextObject[]>;

const useGetCWO = (props: UseGetCWOProps) => {
  useSignals();
  const { clusterID, onSuccess } = props;

  const [triggerGetNamespacedObjects, { isLoading, isFetching }] = useLazyGetK8sObjectsQuery();

  const loadCWOObjects: LoadCWOObjectsFn = useCallback(
    (kind: K8sObjectTypeEnum) => {
      changeCWOLoading(kind);
      return triggerGetNamespacedObjects({
        filter: {
          clusterID,
          kind,
        },
        fields: K8S_OBJECT_FIELDS,
      })
        .then(res => {
          onSuccess(kind, res.data?.items || []);
          return res.data?.items || [];
        })
        .finally(() => {
          changeCWOLoading(kind);
        });
    },
    [triggerGetNamespacedObjects, onSuccess, clusterID]
  );

  return {
    isLoading,
    isFetching,
    load: loadCWOObjects,
  };
};

export default useGetCWO;
