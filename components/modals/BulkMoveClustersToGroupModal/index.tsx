'use client';

import { BaseButton } from '@/components/ui/base-button';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ClusterGroupWithStats } from '@/types/cluster';
import { useState } from 'react';
import BulkClusterSelectionToGroup from './BulkClusterSelectionToGroup';
import { notifyErrorFromResponse } from '@/lib/utils/error';
import { CustomToast } from '@/components/CustomToast';
import { useChangeClusterGroupMutation, useGetClusterGroupsQuery, useGetClustersQuery } from '@/store/api/clusterApi';
import { BulkMoveClustersIcon } from '@/components/svgs/BulkMoveClustersIcon';
import { truncateString } from '@/lib/utils';

export type BulkMoveClustersToGroupModalProps = {
  group: ClusterGroupWithStats;
};

const BulkMoveClustersToGroupModal = ({ group }: BulkMoveClustersToGroupModalProps) => {
  const [open, setOpen] = useState(false);

  const { data: clusters, isLoading: isLoadingClusters } = useGetClustersQuery(
    { clusterGroupID: group.id },
    {
      skip: !open,
    }
  );

  const { data: clusterGroups } = useGetClusterGroupsQuery(undefined, {
    skip: !open,
  });

  const [moveClustersIntoGroup, { isLoading: isMovingClustersIntoGroup }] = useChangeClusterGroupMutation();

  const onSubmit = async (clusterGroupID: string, clusterIDs: string[]) => {
    const payload = clusterIDs.map(el => ({ clusterGroupID, clusterID: el }));
    const response = await moveClustersIntoGroup(payload);

    const { error, notify } = notifyErrorFromResponse(response);

    if (error) {
      return notify(error.errorMessage);
    }

    const clusterGroup = clusterGroups?.find(el => el.id === clusterGroupID);

    setOpen(false);
    CustomToast({
      type: 'success',
      message: `${clusterIDs.length} cluster${clusterIDs.length > 1 ? 's' : ''} have been moved into "${truncateString(
        clusterGroup?.name || '',
        30
      )}" group!`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTitle className="sr-only">Move Clusters to Group</DialogTitle>

      <DialogTrigger asChild>
        <BaseButton className="min-w-6 h-6 p-0" variant="text">
          <BulkMoveClustersIcon className="!w-6 !h-6 text-essence-500" />
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

        <BulkClusterSelectionToGroup
          group={group}
          clusters={clusters || []}
          clusterGroups={clusterGroups || []}
          isLoading={isLoadingClusters}
          onMove={onSubmit}
          onCancel={() => setOpen(false)}
          isSubmitting={isMovingClustersIntoGroup}
        />
      </DialogContent>
    </Dialog>
  );
};

export default BulkMoveClustersToGroupModal;
