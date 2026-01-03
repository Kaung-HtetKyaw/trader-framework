'use client';

import * as Dialog from '@radix-ui/react-dialog';

interface PanelHeaderProps {
  title?: string;
}

const PanelHeader = ({ title = 'Assistant' }: PanelHeaderProps) => {

  return (
    <div className="flex items-center justify-between h-16 px-4 py-3 bg-white">
      <Dialog.Title asChild>
        <span className="text-lg font-medium text-text-950">{title}</span>
      </Dialog.Title>
    </div>
  );
};

export default PanelHeader;
