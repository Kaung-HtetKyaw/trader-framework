'use client';
import { BaseButton } from '@/components/ui/base-button';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import React, { useState } from 'react';
import EditClusterGroupForm, { EditClusterGroupFormData } from './form';
import { ClusterGroupWithStats } from '@/types/cluster';
import { cn, isDefaultClusterGroup } from '@/lib/utils';
import { notifyErrorFromResponse } from '@/lib/utils/error';
import { CustomToast } from '@/components/CustomToast';
import { useChangeClusterGroupNameMutation } from '@/store/api/clusterApi';
import { EditDataIcon } from '@/components/svgs/EditIcon';

type EditClusterGroupModalProps = {
  group: ClusterGroupWithStats;
};

const EditClusterGroupModal = ({ group }: EditClusterGroupModalProps) => {
  const [open, setOpen] = useState(false);

  const [changeClusterGroupName, { isLoading }] = useChangeClusterGroupNameMutation();

  const onSubmit = async (data: EditClusterGroupFormData, onError?: (error: string) => void) => {
    const response = await changeClusterGroupName({ clusterGroupID: group.id, name: data.name });

    const { error, notify } = notifyErrorFromResponse(response, onError);

    if (error) {
      return notify(
        error.errorCode === 'EKG40004' ? 'This name is already taken, please choose another one.' : error.errorMessage
      );
    }

    setOpen(false);
    CustomToast({
      type: 'success',
      message: 'The cluster group name has been successfully edited!',
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTitle className="sr-only">Edit Cluster Group</DialogTitle>
      <DialogTrigger disabled={isDefaultClusterGroup(group.name)} asChild>
        <BaseButton
          disabled={isDefaultClusterGroup(group.name)}
          className={cn('min-w-6 h-6 p-0', isDefaultClusterGroup(group.name) && 'opacity-50 cursor-not-allowed')}
          variant="text"
        >
          <EditDataIcon className="!w-6 !h-6 text-secondary-500" />
        </BaseButton>
      </DialogTrigger>
      <DialogContent
        className="w-[480px] max-w-none px-12 py-8 bg-white rounded-xl flex flex-col justify-center items-center gap-6"
        onOpenAutoFocus={e => e.preventDefault()} // prevent input auto-focus
      >
        <div className="flex flex-col justify-start items-center gap-2 w-full">
          <EditDataIcon className="!w-12 !h-12 text-secondary-500" />
          <div className="text-center text-text-950 text-lg font-medium leading-[21.6px]">Edit cluster group name</div>
        </div>
        <div className="flex flex-col justify-start items-start gap-4 w-full">
          <EditClusterGroupForm
            defaultValues={{ name: group.name }}
            isLoading={isLoading}
            onClose={() => setOpen(false)}
            onSubmit={onSubmit}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditClusterGroupModal;
