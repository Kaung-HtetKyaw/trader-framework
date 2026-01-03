'use client';

import { BaseButton } from '@/components/ui/base-button';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ClusterGroupWithStats } from '@/types/cluster';
import { useState, useMemo } from 'react';
import BulkClusterSelectionToDestinationGroup from './BulkClusterSelectionToDestinationGroup';
import { notifyErrorFromResponse } from '@/lib/utils/error';
import { CustomToast } from '@/components/CustomToast';
import { useChangeClusterGroupMutation, useGetClustersQuery } from '@/store/api/clusterApi';
import { BulkMoveClustersIcon } from '@/components/svgs/BulkMoveClustersIcon';
import { cn, truncateString } from '@/lib/utils';
import { ConnectClusterIcon } from '@/components/svgs/ConnectClusterIcon';

export type BulkMoveClustersToDestinationGroupModalProps = {
  groups?: ClusterGroupWithStats[];
  destinationGroup: ClusterGroupWithStats;
};

const BulkMoveClustersToDestinationGroupModal = ({
  groups,
  destinationGroup,
}: BulkMoveClustersToDestinationGroupModalProps) => {
  const [open, setOpen] = useState(false);
  const [selectedSourceGroupId, setSelectedSourceGroupId] = useState<string | null>(null);

  // Use all groups except the destination as source options
  const sourceGroups = (groups || []).filter(g => g.id !== destinationGroup.id);
  // Find the selected source group object
  const selectedSourceGroup = sourceGroups.find(g => g.id === selectedSourceGroupId) || sourceGroups[0];
  // Fetch clusters for the selected source group only
  const { data: clusters, isLoading: isLoadingClusters } = useGetClustersQuery(
    selectedSourceGroup ? { clusterGroupID: selectedSourceGroup.id } : {},
    { skip: !open || !selectedSourceGroup }
  );
  const filteredClusters = useMemo(() => clusters || [], [clusters]);

  const [moveClustersIntoGroup, { isLoading: isMovingClustersIntoGroup }] = useChangeClusterGroupMutation();

  const onSubmit = async (clusterIDs: string[]) => {
    const payload = clusterIDs.map(el => ({ clusterGroupID: destinationGroup.id, clusterID: el }));
    const response = await moveClustersIntoGroup(payload);

    const { error, notify } = notifyErrorFromResponse(response);

    if (error) {
      return notify(error.errorMessage);
    }

    setOpen(false);
    CustomToast({
      type: 'success',
      message: `${clusterIDs.length} cluster${clusterIDs.length > 1 ? 's' : ''} have been moved into "${truncateString(
        destinationGroup?.name || '',
        30
      )}" group!`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTitle className="sr-only">Move Clusters To Group</DialogTitle>

      <DialogTrigger asChild>
        <BaseButton
          className={cn(`h-7 p-3 flex flex-row justify-center items-center bg-secondary-500 text-white rounded-lg `)}
        >
          <span>Add Cluster</span>
          <ConnectClusterIcon className="w-4 h-4 ml-2 text-text-50" />
        </BaseButton>
      </DialogTrigger>

      <DialogContent className="max-w-[632px]  px-12 py-8 bg-white rounded-xl flex flex-col justify-center items-center gap-6">
        <div className="w-full flex flex-col items-center gap-2">
          <div className="flex flex-col items-center gap-2">
            <BulkMoveClustersIcon className="!w-12 !h-12 text-essence-500" />

            <div className="text-center text-text-950 text-lg font-medium leading-[21.6px]">
              Moving clusters into group
            </div>
          </div>

          <div className="w-full text-center text-sm leading-[16.8px] text-text-950">
            Select cluster to move to another cluster group.
          </div>
        </div>

        <BulkClusterSelectionToDestinationGroup
          group={destinationGroup}
          clusters={filteredClusters}
          clusterGroups={sourceGroups}
          isLoading={isLoadingClusters}
          onMove={onSubmit}
          onCancel={() => setOpen(false)}
          isSubmitting={isMovingClustersIntoGroup}
          selectedSourceGroupId={selectedSourceGroup?.id}
          onSelectSourceGroup={setSelectedSourceGroupId}
        />
      </DialogContent>
    </Dialog>
  );
};

export default BulkMoveClustersToDestinationGroupModal;
