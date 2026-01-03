'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import CreateGithubPATForm from './form';
import { BaseButton } from '@/components/ui/base-button';
import { useState } from 'react';
import { AddIcon } from '@/components/svgs/AddIcon';
import { KeyIcon } from '@/components/svgs/KeyIcon';

export type CreateGithubPATModalProps = {
  renderTrigger?: () => React.ReactNode;
};

const CreateGithubPATModal = ({ renderTrigger }: CreateGithubPATModalProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTitle className="sr-only">Add new PAT</DialogTitle>
      <DialogTrigger asChild>
        {renderTrigger ? (
          renderTrigger()
        ) : (
          <BaseButton size="small" className="px-2">
            <span className="text-white body-2">Create New</span>
            <AddIcon className="w-4 h-4 text-text-50" />
          </BaseButton>
        )}
      </DialogTrigger>

      <DialogContent className="bg-text-50 w-[640px] max-w-none p-8 rounded-xl gap-4">
        <DialogHeader>
          <DialogTitle className="font-semibold text-text-950 text-center flex flex-col gap-2 items-center title-1">
            <KeyIcon className="w-12 h-12 text-secondary-500 " />
            <span className="text-[1.375rem] font-bold">Add new PAT</span>
          </DialogTitle>
          <p className="text-center text-text-950 text-sm font-normal leading-[1.2]">
            Add a new Personal Access Token to connect to your Github account
          </p>
        </DialogHeader>
        <CreateGithubPATForm onClose={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};

export default CreateGithubPATModal;
