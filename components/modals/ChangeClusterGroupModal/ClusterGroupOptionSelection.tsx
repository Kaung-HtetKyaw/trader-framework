import ClusterGroupOption from './ClusterGroupOption';
import { useCallback } from 'react';
import { Cluster } from '@/types/cluster';
import { BaseButton } from '@/components/ui/base-button';
import useStateFromProps from '@/lib/hooks/useStateFromProps';
import { CustomToast } from '@/components/CustomToast';
import { useEnrichedClusterGroups } from '@/lib/hooks/useEnrichedClusterGroups';
import { notifyErrorFromResponse } from '@/lib/utils/error';
import { useChangeClusterGroupMutation } from '@/store/api/clusterApi';
import { useGetClustersQuery } from '@/store/api/clusterApi';
import { cn } from '@/lib/utils';

type ClusterGroupOptionSelectionProps = {
  cluster: Cluster;
  onOpenChange: (open: boolean) => void;
};

const ClusterGroupOptionSelection = ({ cluster, onOpenChange }: ClusterGroupOptionSelectionProps) => {
  const { data: clustersData } = useGetClustersQuery({});

  const { clusterGroups: clusterGroups } = useEnrichedClusterGroups(clustersData || []);

  const [changeClusterGroup, { isLoading: isChangingClusterGroup }] = useChangeClusterGroupMutation();

  const [selectedValue, setSelectedValue] = useStateFromProps(cluster.clusterGroupID);

  const onSubmit = useCallback(async () => {
    if (isChangingClusterGroup) {
      return;
    }

    const response = await changeClusterGroup([{ clusterID: cluster.id, clusterGroupID: selectedValue }]);

    const { error, notify } = notifyErrorFromResponse(response);

    if (error) {
      return notify(error.errorMessage);
    }

    CustomToast({
      message: 'The cluster has been successfully assigned!',
      type: 'success',
    });
  }, [cluster.id, selectedValue, changeClusterGroup]);

  return (
    <div className="flex flex-col gap-6">
      <div className="scroll-container p-4 border-thin h-[200px] overflow-y-auto  border-x-[8px] border-white bg-white border-text-text-200 rounded-sm">
        <ClusterGroupOption
          selectedGroup={selectedValue}
          clusterGroups={clusterGroups}
          currentClusterGroupID={cluster.clusterGroupID}
          onChange={value => setSelectedValue(value)}
        />
      </div>
      <div className="flex flex-row w-full gap-3 items-center justify-end">
        <BaseButton
          size="medium"
          className="px-2 bg-text-300 hover:bg-text-400 text-white w-[7.5rem]"
          onClick={() => onOpenChange(false)}
        >
          <span className="text-white body-1">Cancel</span>
        </BaseButton>

        <BaseButton
          size="medium"
          className={cn('px-2 text-white min-w-[7.5rem]', isChangingClusterGroup && 'opacity-75 cursor-not-allowed')}
          onClick={onSubmit}
        >
          <span className="text-white body-1">{isChangingClusterGroup ? 'Saving changes...' : 'Save Changes'}</span>
        </BaseButton>
      </div>
    </div>
  );
};

export default ClusterGroupOptionSelection;
