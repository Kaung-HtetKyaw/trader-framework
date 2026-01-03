'use client';

import { BaseButton } from '@/components/ui/base-button';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { getDefaultErrorMessageByErrorCode, notifyErrorFromResponse } from '@/lib/utils/error';
import { useState } from 'react';
import { CustomToast } from '@/components/CustomToast';
import ModalActionButton from '../ModalActionButton';
import { DeleteDataIcon } from '@/components/svgs/DeleteDataIcon';
import { useDeleteRepoMutation } from '@/store/api/gitOpsApi';
import LoadingSpinner from '@/components/LoadingSpinner';

export type DeleteAzureDevOpsRepoModalProps = {
  repositoryID: string;
};

const DeleteAzureDevOpsRepoModal = ({ repositoryID }: DeleteAzureDevOpsRepoModalProps) => {
  const [open, setOpen] = useState(false);

  const [deleteAzureDevOpsRepo, { isLoading: isDeleting }] = useDeleteRepoMutation();

  const onDelete = async () => {
    const response = await deleteAzureDevOpsRepo({ repositoryID });

    const { error, notify } = notifyErrorFromResponse(response);

    if (error) {
      return notify(error.errorMessage || getDefaultErrorMessageByErrorCode(error.errorCode));
    }

    CustomToast({
      type: 'success',
      message: 'Repository has been deleted successfully!',
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTitle className="sr-only">Delete Repository</DialogTitle>

      <DialogTrigger asChild>
        <BaseButton className="min-w-6 h-6 p-0" variant="text">
          <DeleteDataIcon className="!w-6 !h-6 text-red-600" />
        </BaseButton>
      </DialogTrigger>

      <DialogContent className="w-[420px] max-w-none px-12 py-8 bg-white rounded-xl flex flex-col justify-center items-center gap-6">
        <div className="w-full flex flex-col items-center gap-4">
          <div className="flex flex-col items-center gap-2">
            <DeleteDataIcon className="!w-12 !h-12 text-red-600" />
            <div className="text-center text-text-950 text-lg font-bold leading-[21.6px]">Delete repository name</div>
          </div>

          <div className="w-full text-center text-sm leading-[16.8px] text-text-950">
            Are you sure you want to delete the repository name? Once deleted, the name cannot be restored.
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
            {isDeleting ? (
              <LoadingSpinner className="w-full gap-2">
                <p>Deleting...</p>
              </LoadingSpinner>
            ) : (
              <span>Delete</span>
            )}
          </ModalActionButton>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteAzureDevOpsRepoModal;
