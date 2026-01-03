'use client';

import { BaseButton } from '@/components/ui/base-button';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { getDefaultErrorMessageByErrorCode, notifyErrorFromResponse } from '@/lib/utils/error';
import { ClusterKey } from '@/types/cluster';
import { useState } from 'react';
import { CustomToast } from '@/components/CustomToast';
import { useDeleteClusterKeyMutation } from '@/store/api/clusterApi';
import ModalActionButton from '../ModalActionButton';
import { DeleteDataIcon } from '@/components/svgs/DeleteDataIcon';

export type DeleteClusterTokenModalProps = {
  token: ClusterKey;
};

const DeleteClusterTokenModal = ({ token }: DeleteClusterTokenModalProps) => {
  const [open, setOpen] = useState(false);

  const [deleteClusterKey, { isLoading: isDeleting }] = useDeleteClusterKeyMutation();

  const onDelete = async () => {
    const response = await deleteClusterKey({ tokenValue: token.value });

    const { error, notify } = notifyErrorFromResponse(response);

    if (error) {
      return notify(error.errorMessage || getDefaultErrorMessageByErrorCode(error.errorCode));
    }

    CustomToast({
      type: 'success',
      message: 'The key has been updated successfully!',
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTitle className="sr-only">Delete Key</DialogTitle>

      <DialogTrigger asChild>
        <BaseButton className="min-w-6 h-6 p-0" variant="text">
          <DeleteDataIcon className="!w-6 !h-6 text-red-600" />
        </BaseButton>
      </DialogTrigger>

      <DialogContent className="w-[420px] max-w-none px-12 py-8 bg-white rounded-xl flex flex-col justify-center items-center gap-6">
        <div className="w-full flex flex-col items-center gap-4">
          <div className="flex flex-col items-center gap-2">
            <DeleteDataIcon className="!w-12 !h-12 text-red-600" />
            <div className="text-center text-text-950 text-lg font-medium leading-[21.6px]">Delete key</div>
          </div>

          <div className="w-full text-center text-sm leading-[16.8px] text-text-950">
            Are you sure you want to delete the key <span className="font-semibold">“{token.name}”</span> from your key
            list? Once deleted, the key cannot be restored.
          </div>
        </div>
        <div className="flex justify-center items-center gap-4 pt-2">
          <ModalActionButton action="cancel" onClick={() => setOpen(false)}>
            Cancel
          </ModalActionButton>

          <ModalActionButton
            action="submit"
            color="error"
            onClick={() => {
              onDelete();
            }}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </ModalActionButton>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteClusterTokenModal;
