'use client';
import { BaseButton } from '@/components/ui/base-button';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import React, { useState } from 'react';
import EditClusterTokenForm, { EditClusterTokenFormData } from './form';
import { ClusterKey } from '@/types/cluster';
import { cn } from '@/lib/utils';
import { getDefaultErrorMessageByErrorCode, notifyErrorFromResponse } from '@/lib/utils/error';
import { CustomToast } from '@/components/CustomToast';
import { useUpdateClusterKeyMutation } from '@/store/api/clusterApi';
import { EditDataIcon } from '@/components/svgs/EditIcon';

type EditClusterTokenModalProps = {
  token: ClusterKey;
};

const EditClusterTokenModal = ({ token }: EditClusterTokenModalProps) => {
  const [open, setOpen] = useState(false);

  const [updateClusterKey, { isLoading }] = useUpdateClusterKeyMutation();

  const onSubmit = async (data: EditClusterTokenFormData, onError?: (error: string) => void) => {
    const response = await updateClusterKey({ tokenValue: token.value, name: data.name });

    const { error, notify } = notifyErrorFromResponse(response, onError);

    if (error) {
      return notify(error.errorMessage || getDefaultErrorMessageByErrorCode(error.errorCode));
    }

    setOpen(false);
    CustomToast({
      type: 'success',
      message: 'The key name has been successfully edited!',
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTitle className="sr-only">Edit Key</DialogTitle>

      <DialogTrigger asChild>
        <BaseButton className={cn('min-w-5 h-5 p-0')} variant="text">
          <EditDataIcon className="!w-6 !h-6" />
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
          <EditClusterTokenForm
            defaultValues={{ name: token.name }}
            keyValue={token.value}
            isLoading={isLoading}
            onClose={() => setOpen(false)}
            onSubmit={onSubmit}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditClusterTokenModal;
