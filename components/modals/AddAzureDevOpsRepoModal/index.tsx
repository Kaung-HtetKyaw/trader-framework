'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { BaseButton } from '@/components/ui/base-button';
import { useState } from 'react';
import { AddIcon } from '@/components/svgs/AddIcon';
import { KeyIcon } from '@/components/svgs/KeyIcon';
import AddAzureDevOpsRepoForm from './form';
import { PersonalAccessToken } from '@/types/gitOps';

export type AddAzureDevOpsRepoModalProps = {
  credential: PersonalAccessToken | null | undefined;
  renderTrigger?: () => React.ReactNode;
};

const AddAzureDevOpsRepoModal = (props: AddAzureDevOpsRepoModalProps) => {
  const { renderTrigger, credential } = props;
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTitle className="sr-only">Add new Azure DevOps Repo</DialogTitle>
      <DialogTrigger asChild>
        {renderTrigger ? (
          renderTrigger()
        ) : (
          <BaseButton size="small" className="px-2 h-7">
            <span className="text-white body-2">Create New</span>
            <AddIcon className="w-4 h-4 text-text-50" />
          </BaseButton>
        )}
      </DialogTrigger>

      <DialogContent className="bg-text-50 w-[640px] max-w-none p-8 rounded-xl gap-4">
        <DialogHeader>
          <DialogTitle className="font-semibold text-text-950 text-center flex flex-col gap-2 items-center title-1">
            <KeyIcon className="w-12 h-12 text-secondary-500 " />
            <span className="text-[1.375rem] font-bold">Add new repository name</span>
          </DialogTitle>
        </DialogHeader>
        <AddAzureDevOpsRepoForm credential={credential} onClose={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};

export default AddAzureDevOpsRepoModal;
