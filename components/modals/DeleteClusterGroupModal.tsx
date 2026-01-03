'use client';

import { Dialog, DialogContent, DialogTitle, DialogTrigger, DialogPortal } from '@/components/ui/dialog';
import { notifyErrorFromResponse } from '@/lib/utils/error';
import { ClusterGroupWithStats } from '@/types/cluster';
import { useState } from 'react';
import { CustomToast } from '../CustomToast';
import { cn, isDefaultClusterGroup, truncateString } from '@/lib/utils';
import { useDeleteClusterGroupMutation } from '@/store/api/clusterApi';
import ModalActionButton from './ModalActionButton';
import { DeleteDataIcon } from '@/components/svgs/DeleteDataIcon';

export type DeleteClusterGroupModalProps = {
  group: ClusterGroupWithStats;
  renderTrigger?: () => React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

const DeleteClusterGroupModal = ({
  group,
  renderTrigger,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: DeleteClusterGroupModalProps) => {
  // Controlled vs uncontrolled
  const isControlled = controlledOpen !== undefined && controlledOnOpenChange !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const open = isControlled ? controlledOpen! : uncontrolledOpen;
  const setOpen = isControlled ? controlledOnOpenChange! : setUncontrolledOpen;

  const [deleteClusterGroup, { isLoading: isDeleting }] = useDeleteClusterGroupMutation();

  const onDelete = async () => {
    if (isDeleting) {
      return;
    }

    const response = await deleteClusterGroup({ clusterGroupID: group.id });

    const { error, notify } = notifyErrorFromResponse(response);

    if (error) {
      return notify(error.errorMessage);
    }

    CustomToast({
      type: 'success',
      message: 'The cluster group has been deleted successfully!',
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTitle className="sr-only">Delete Cluster Group</DialogTitle>
      {renderTrigger && (
        <DialogTrigger asChild disabled={isDefaultClusterGroup(group.name)}>
          {renderTrigger()}
        </DialogTrigger>
      )}

      <DialogPortal>
        <DialogContent className="w-[420px] max-w-none px-12 py-8 bg-white rounded-xl flex flex-col justify-center items-center gap-6">
          <div className="w-full flex flex-col items-center gap-4">
            <div className="flex flex-col items-center gap-2">
              <DeleteDataIcon className="!w-12 !h-12 text-error-500" />

              <div className="text-center text-text-950 text-lg font-medium leading-[21.6px]">Delete cluster group</div>
            </div>

            <div className="w-full text-center text-sm leading-[16.8px] text-text-950">
              Are you sure you want to delete the group{' '}
              <span className="font-semibold">“{truncateString(group.name, 30)}”</span>? All the clusters inside the
              group will be automatically moved to <span className="font-semibold">“Default”</span> group.
            </div>
          </div>
          <div className="flex justify-center items-center gap-4 pt-2">
            <ModalActionButton action="cancel" onClick={() => setOpen(false)}>
              Cancel
            </ModalActionButton>

            <ModalActionButton
              action="submit"
              onClick={() => {
                onDelete();
              }}
              color="error"
              className={cn(isDeleting && 'opacity-75 cursor-not-allowed')}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </ModalActionButton>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};

export default DeleteClusterGroupModal;
