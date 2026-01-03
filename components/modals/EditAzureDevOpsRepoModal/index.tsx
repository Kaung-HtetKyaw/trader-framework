'use client';
import { BaseButton } from '@/components/ui/base-button';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { notifyErrorFromResponse } from '@/lib/utils/error';
import { CustomToast } from '@/components/CustomToast';
import { EditDataIcon } from '@/components/svgs/EditIcon';
import EditAzureDevOpsRepoForm, { EditAzureDevOpsRepoFormData } from './form';
import { useUpdateRepoMutation } from '@/store/api/gitOpsApi';

type EditAzureDevOpsRepoModalProps = {
  repositoryID: string;
  defaultValues: { name: string; description: string };
};

const EditAzureDevOpsRepoModal = ({ repositoryID, defaultValues }: EditAzureDevOpsRepoModalProps) => {
  const [open, setOpen] = useState(false);

  const [updateAzureDevOpsRepo, { isLoading }] = useUpdateRepoMutation();

  const onSubmit = async (data: EditAzureDevOpsRepoFormData, onError?: (error: string) => void) => {
    const response = await updateAzureDevOpsRepo({
      repositoryID: repositoryID,
      name: data.name,
      description: data.description,
    });

    const { error, notify } = notifyErrorFromResponse(response, onError);

    if (error) {
      notify(error.errorMessage);
      return CustomToast({
        type: 'error',
        message: error.errorMessage,
      });
    }

    setOpen(false);
    CustomToast({
      type: 'success',
      message: 'Repository has been successfully edited!',
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTitle className="sr-only">Edit Repository</DialogTitle>

      <DialogTrigger asChild>
        <BaseButton className={cn('min-w-5 h-5 p-0')} variant="text">
          <EditDataIcon className="!w-6 !h-6" />
        </BaseButton>
      </DialogTrigger>
      <DialogContent
        className="w-[580px] max-w-none px-12 py-8 bg-white rounded-xl flex flex-col justify-center items-center gap-6"
        onOpenAutoFocus={e => e.preventDefault()}
      >
        <div className="flex flex-col justify-start items-center gap-2 w-full">
          <EditDataIcon className="!w-12 !h-12 text-secondary-500" />
          <div className="text-center text-text-950 text-lg font-medium leading-[21.6px]">Edit Repository</div>
        </div>
        <div className="flex flex-col justify-start items-start gap-4 w-full">
          <EditAzureDevOpsRepoForm
            defaultValues={defaultValues}
            isLoading={isLoading}
            onClose={() => setOpen(false)}
            onSubmit={onSubmit}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditAzureDevOpsRepoModal;
