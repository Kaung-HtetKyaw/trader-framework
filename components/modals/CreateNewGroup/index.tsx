'use client';

import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import CreateNewGroupForm from './form';
import { BaseButton } from '@/components/ui/base-button';
import { useState } from 'react';
import { AddIcon } from '@/components/svgs/AddIcon';

export type CreateNewGroupModalProps = {
  renderTrigger?: () => React.ReactNode;
};

const CreateNewGroupModal = ({ renderTrigger }: CreateNewGroupModalProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTitle className="sr-only">Create New Group</DialogTitle>
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

      <DialogContent className="bg-text-50 w-[540px] max-w-none p-5 rounded-xl">
        <CreateNewGroupForm onClose={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};

export default CreateNewGroupModal;
