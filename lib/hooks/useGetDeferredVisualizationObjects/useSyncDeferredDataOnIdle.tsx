import { getIsInteractionIdle } from '@/signals/visualiation/misc';
import { K8sContextObject } from '@/types/visualization';
import { useSignals } from '@preact/signals-react/runtime';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

export type UseSyncDeferredDataOnIdleProps = {
  initialData: ObjectDataMap;
};

export type ObjectDataMap = Record<string, K8sContextObject[] | undefined>;

const useSyncDeferredDataOnIdle = (initialData: ObjectDataMap) => {
  useSignals();
  const [deferredData, setDeferredData] = useState<ObjectDataMap>(initialData);
  const [data, setData] = useState<ObjectDataMap>(initialData);

  const isIdle = getIsInteractionIdle();

  useEffect(() => {
    if (isIdle) {
      const namespaces = Object.keys(deferredData);

      namespaces.forEach(namespace => {
        if (deferredData[namespace]) {
          setData(prev => ({ ...prev, [namespace]: deferredData[namespace] }));
          setDeferredData(prev => ({ ...prev, [namespace]: undefined }));
        }
      });
    }
  }, [deferredData, isIdle]);

  return [data, setDeferredData] as [ObjectDataMap, Dispatch<SetStateAction<ObjectDataMap>>];
};

export default useSyncDeferredDataOnIdle;
