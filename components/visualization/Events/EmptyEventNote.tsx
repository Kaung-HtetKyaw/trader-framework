'use client';

import { SearchFilterIcon } from "@/components/svgs/SearchFilterIcon";
import { BaseButton } from "@/components/ui/base-button";


interface EmptyEventNoteProps {
  onClearFilter?: () => void;
}

const EmptyEventNote = ({ onClearFilter }: EmptyEventNoteProps) => {
  return (
    <div className="flex min-h-[360px] w-full items-center justify-center px-6">
      <div className="flex flex-col items-center text-center justify-center gap-6">
       <SearchFilterIcon className="w-12 h-12 text-text-300"/>

        <div className="flex flex-col items-center text-center justify-center gap-1">
        <h2 className="text-md font-medium text-text-400">No events available</h2>
        <p className="text-sm text-text-400">
          No recent events match your filters.
        </p>
        </div>

        <BaseButton
          size="medium"
          variant="outlined"
          className="pointer-events-auto shadow px-3 text-sm bg-white text-secondary-500 hover:bg-secondary-50"
          onClick={onClearFilter}
        >
          Clear filter
        </BaseButton>
      </div>
    </div>
  );
};

export default EmptyEventNote;
