'use client';
import { BaseButton } from '@/components/ui/base-button';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import React, { useState } from 'react';
import EditGithubPATForm, { EditGithubPATFormData } from './form';
import { cn } from '@/lib/utils';
import { getDefaultErrorMessageByErrorCode, notifyErrorFromResponse } from '@/lib/utils/error';
import { CustomToast } from '@/components/CustomToast';
import { EditDataIcon } from '@/components/svgs/EditIcon';
import { useUpdateGithubPATMutation } from '@/store/api/gitOpsApi';

type EditGithubPATModalProps = {
  tokenID: string;
  previousToken?: string;
};

const EditGithubPATModal = ({ tokenID, previousToken }: EditGithubPATModalProps) => {
  const [open, setOpen] = useState(false);

  const [updateAccessCredential, { isLoading }] = useUpdateGithubPATMutation();

  const onSubmit = async (data: EditGithubPATFormData, onError?: (error: string) => void) => {
    const response = await updateAccessCredential({
      personalAccessTokenID: tokenID,
      value: data.token,
    });

    const { error, notify } = notifyErrorFromResponse(response, onError);

    if (error) {
      CustomToast({
        type: 'error',
        message: error.errorMessage || getDefaultErrorMessageByErrorCode(error.errorCode),
      });
      return notify(error.errorMessage || getDefaultErrorMessageByErrorCode(error.errorCode));
    }

    setOpen(false);
    CustomToast({
      type: 'success',
      message: 'Personal Access Token has been successfully edited!',
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTitle className="sr-only">Edit Token</DialogTitle>

      <DialogTrigger asChild>
        <BaseButton className={cn('min-w-5 h-5 p-0')} variant="text">
          <EditDataIcon className="!w-6 !h-6" />
        </BaseButton>
      </DialogTrigger>
      <DialogContent
        className="w-[480px] md:w-[600px] max-w-none px-12 py-8 bg-white rounded-xl flex flex-col justify-center items-center gap-6"
        onOpenAutoFocus={e => e.preventDefault()} // prevent input auto-focus
      >
        <div className="flex flex-col justify-start items-center gap-2 w-full">
          <EditDataIcon className="!w-12 !h-12 text-secondary-500" />
          <div className="text-center text-text-950 text-[22px] font-medium leading-[21.6px]">Edit PAT</div>

          <p className="text-center text-text-500 body-1 font-normal leading-[1.2] mt-4">
            Update your existing Personal Access Token to maintain your Github integration.
          </p>
        </div>
        <div className="flex flex-col justify-start items-start gap-4 w-full">
          <EditGithubPATForm
            defaultValues={{ token: '' }}
            previousToken={previousToken}
            isLoading={isLoading}
            onClose={() => setOpen(false)}
            onSubmit={onSubmit}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditGithubPATModal;
