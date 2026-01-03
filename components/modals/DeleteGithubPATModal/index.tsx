'use client';

import { BaseButton } from '@/components/ui/base-button';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { getDefaultErrorMessageByErrorCode, notifyErrorFromResponse } from '@/lib/utils/error';
import { useCallback, useMemo, useState } from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';
import { CustomToast } from '@/components/CustomToast';
import ModalActionButton from '../ModalActionButton';
import { DeleteDataIcon } from '@/components/svgs/DeleteDataIcon';
import { useDeletePATMutation, useDeleteRepoMutation } from '@/store/api/gitOpsApi';

export type DeleteGithubPATModalProps = {
  tokenID: string;
  repositoryIDs: string[];
};

const DeleteGithubPATModal = ({ tokenID, repositoryIDs }: DeleteGithubPATModalProps) => {
  const [open, setOpen] = useState(false);

  const [deleteGithubPAT, { isLoading: isDeletingPAT }] = useDeletePATMutation();
  const [deleteRepositories, { isLoading: isDeletingRepositories }] = useDeleteRepoMutation();

  const isDeleting = useMemo(() => isDeletingPAT || isDeletingRepositories, [isDeletingPAT, isDeletingRepositories]);

  const deleteRepository = useCallback(
    async (repositoryID: string) => {
      const response = await deleteRepositories({ repositoryID });
      const { error, notify } = notifyErrorFromResponse(response);
      if (error) {
        return notify(error.errorMessage || getDefaultErrorMessageByErrorCode(error.errorCode));
      }
    },
    [deleteRepositories]
  );

  const deleteRelatedRepositories = useCallback(async () => {
    return Promise.all(repositoryIDs.map(deleteRepository));
  }, [repositoryIDs, deleteRepository]);

  const onDelete = async () => {
    try {
      await deleteRelatedRepositories();
      const response = await deleteGithubPAT({ personalAccessTokenID: tokenID });

      const { error, notify } = notifyErrorFromResponse(response);

      if (error) {
        return notify(error.errorMessage || getDefaultErrorMessageByErrorCode(error.errorCode));
      }

      CustomToast({
        type: 'success',
        message: 'Personal Access Token has been deleted successfully!',
      });
      setOpen(false);
    } catch {
      CustomToast({
        type: 'error',
        message: 'Failed to delete Personal Access Token',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTitle className="sr-only">Delete Token</DialogTitle>

      <DialogTrigger asChild>
        <BaseButton className="min-w-6 h-6 p-0" variant="text">
          <DeleteDataIcon className="!w-6 !h-6 text-red-600" />
        </BaseButton>
      </DialogTrigger>

      <DialogContent className="w-[420px] max-w-none px-12 py-8 bg-white rounded-xl flex flex-col justify-center items-center gap-6">
        <div className="w-full flex flex-col items-center gap-4">
          <div className="flex flex-col items-center gap-2">
            <DeleteDataIcon className="!w-12 !h-12 text-red-600" />
            <div className="text-center text-text-950 text-lg font-medium leading-[21.6px]">Delete PAT</div>
          </div>

          <div className="w-full text-center text-sm leading-[16.8px] text-text-950">
            Are you sure you want to delete the Personal Access Token and disconnect GitHub? Once deleted, the token
            cannot be restored.
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

export default DeleteGithubPATModal;
