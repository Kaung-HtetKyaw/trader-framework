'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { BaseButton } from '@/components/ui/base-button';
import { useState } from 'react';
import DatabaseIcon from '@/components/svgs/DatabaseIcon';
import DescriptionGenerator from './DescriptionGenerator';

export type PromptBuilderModalProps = {
  onSubmit: (instruction: string) => void;
};

const PromptBuilderModal = (props: PromptBuilderModalProps) => {
  const { onSubmit } = props;
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTitle className="sr-only">Add new PAT</DialogTitle>
      <DialogTrigger asChild>
        <BaseButton variant="outlined" className="rounded-lg">
          Build Prompt
        </BaseButton>
      </DialogTrigger>

      <DialogContent className="bg-white w-[640px] lg:w-[720px] xl:w-[800px] max-w-none p-8 rounded-xl flex flex-col gap-6">
        <DialogHeader className="flex flex-col gap-[14px]">
          <DialogTitle className="font-semibold text-text-950 text-center flex flex-col gap-2 items-center title-1">
            <DatabaseIcon className="w-12 h-12 text-secondary-500 " />
            <span className="text-[1.375rem] font-bold">Build Prompt</span>
          </DialogTitle>
          <p className="text-center text-text-500 body-1 font-normal leading-[1.2]">
            Define or select suggested prompts for this agent.
          </p>
        </DialogHeader>

        <DescriptionGenerator onSubmit={onSubmit} onClose={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};

export default PromptBuilderModal;
