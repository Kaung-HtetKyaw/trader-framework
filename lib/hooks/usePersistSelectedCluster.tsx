import useLocalStorage from './useLocalStorage';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export const SELECTED_CLUSTER_LOCAL_STORAGE_KEY = 'selectedCluster';
export const SELECTED_CLUSTER_GROUP_LOCAL_STORAGE_KEY = 'selectedClusterGroup';

export type UsePersistSelectedClusterProps = {
  autoLoadSelectedCluster?: boolean;
};

export type PersistedSelectedCluster = {
  [key: string]: string;
};

const usePersistSelectedCluster = (props?: UsePersistSelectedClusterProps) => {
  const { autoLoadSelectedCluster = false } = props || {};
  const router = useRouter();
  const { data: session } = useSession();

  const [selectedClusters, setSelectedClusters] = useLocalStorage<PersistedSelectedCluster>(
    SELECTED_CLUSTER_LOCAL_STORAGE_KEY,
    {}
  );
  const [alreadySetSelectedCluster, setAlreadySetSelectedCluster] = useState(false);

  const getSelectedCluster = useCallback(() => {
    if (typeof window === 'undefined') return '';
    const persistedClusters = localStorage.getItem(SELECTED_CLUSTER_LOCAL_STORAGE_KEY);
    if (!persistedClusters) return '';
    try {
      const parsedClusters = JSON.parse(persistedClusters) as Record<string, string>;
      const key = `${session?.user?.id}-${window.location.origin}`;
      return parsedClusters[key] || '';
    } catch {
      return '';
    }
  }, [session?.user?.id]);

  const selectedClusterPersistKey = useMemo(
    () => `${session?.user?.id}-${typeof window !== 'undefined' ? window.location.origin : ''}`,
    [session?.user?.id]
  );

  const currentSelectedCluster = useMemo(
    () => selectedClusters[selectedClusterPersistKey] || '',
    [selectedClusters, selectedClusterPersistKey]
  );

  useEffect(() => {
    if (alreadySetSelectedCluster || !autoLoadSelectedCluster || !currentSelectedCluster) return;

    setAlreadySetSelectedCluster(true);
  }, [alreadySetSelectedCluster, currentSelectedCluster, autoLoadSelectedCluster, router]);

  const setSelectedCluster = useCallback(
    (clusterId: string) => {
      setSelectedClusters(prev => ({ ...prev, [selectedClusterPersistKey]: clusterId }));
    },
    [setSelectedClusters, selectedClusterPersistKey]
  );

  return {
    selectedCluster: currentSelectedCluster,
    setSelectedCluster,
    getSelectedCluster,
  };
};

export default usePersistSelectedCluster;
