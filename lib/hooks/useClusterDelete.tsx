import { useDeleteClusterMutation, useGetClusterByIdQuery } from '@/store/api/clusterApi';
import { setClusters, setSelectedClusterName } from '@/store/slices/clusterSlice';
import { RootState } from '@/store/store';
import { useDispatch, useSelector } from 'react-redux';
import { notifyErrorFromResponse } from '../utils/error';
import { CustomToast } from '@/components/CustomToast';

export type UseClusterDeleteProps = {
  clusterID: string;
  onSuccess?: () => void;
};

const useClusterDelete = (props: UseClusterDeleteProps) => {
  const { clusterID, onSuccess } = props;
  const { data, isLoading: isLoadingCluster } = useGetClusterByIdQuery({ id: clusterID, includeStats: false });
  const [deleteCluster, { isLoading }] = useDeleteClusterMutation();
  const dispatch = useDispatch();
  const allClusters = useSelector((state: RootState) => state.cluster.allClusters);
  const selectedCluster = useSelector((state: RootState) => state.cluster.selectedClusterName);

  const onDelete = async () => {
    if (isLoadingCluster || !data) {
      return;
    }

    deleteCluster({ clusterID })
      .then(response => {
        const newClusters = allClusters.filter(cluster => cluster.id !== clusterID);
        dispatch(setClusters(newClusters));
        if (selectedCluster === data.name) {
          dispatch(setSelectedClusterName(''));
        }

        const { error, notify } = notifyErrorFromResponse(response);

        if (error) {
          return notify(error.errorMessage);
        }

        CustomToast({
          type: 'success',
          message: 'The cluster has successfully been removed!',
        });

        if (onSuccess) {
          onSuccess();
        }
      })
      .catch(res => {
        const { error, notify } = notifyErrorFromResponse(res);
        if (error) {
          return notify(error.errorMessage);
        }
      });
  };

  return [onDelete, { isLoading }] as [() => Promise<void>, { isLoading: boolean }];
};

export default useClusterDelete;
