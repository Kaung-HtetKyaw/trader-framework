import { useEffect, useRef, useState } from 'react';
import { useEnrichedClusterList } from './useEnrichedClusters';
import { useDispatch } from 'react-redux';
import { setClusters } from '@/store/slices/clusterSlice';

export type UsePoolEnrichedClusterListProps = {
  setInStore?: boolean;
  enablePolling?: boolean;
};

const usePoolEnrichedClusterList = (props?: UsePoolEnrichedClusterListProps) => {
  const { setInStore, enablePolling } = props || { setInStore: false, enablePolling: false };
  const [shouldPoll, setShouldPoll] = useState(true);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const dispatch = useDispatch();
  const { clusters, data, isLoading } = useEnrichedClusterList({
    ...(enablePolling && shouldPoll ? { pollingInterval: 5000 } : {}),
    skip: false,
  });
  const prevClusterIds = useRef<string>('');

  useEffect(() => {
    if (!data) return;
    setInitialLoadComplete(true);

    if (clusters.length > 0) {
      setShouldPoll(false);
    }
  }, [clusters, data]);

  useEffect(() => {
    // If the cluster ids have not changed, do not update the store
    // This is to prevent infinite cascade re-renders
    const currentClusterIds = clusters.map(cluster => cluster.id).join(',');

    if (currentClusterIds === prevClusterIds.current) return;

    if (setInStore && clusters.length > 0) {
      dispatch(setClusters(clusters || []));
      prevClusterIds.current = currentClusterIds;
    }
  }, [clusters, setInStore, dispatch]);

  return { clusters, data, isLoading, initialLoadComplete };
};

export default usePoolEnrichedClusterList;
