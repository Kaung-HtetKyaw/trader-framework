import { setSelectedClusterName } from '@/store/slices/clusterSlice';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

const useSetSelectCluster = (name: string) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setSelectedClusterName(name || ''));
    return () => {
      dispatch(setSelectedClusterName(''));
    };
  }, [name, dispatch]);
};

export default useSetSelectCluster;
