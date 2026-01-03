'use client';

import { BaseButton } from '@/components/ui/base-button';
import React from 'react';
import CreateNewGroupModal from '@/components/modals/CreateNewGroup';
import { AddIcon } from '@/components/svgs/AddIcon';

const ClusterNewGroup = () => {
  return (
    <div className="w-full bg-white rounded-lg shadow-sm mt-4 p-1 sm:p-2 flex gap-2 min-h-[128px] justify-center items-center relative">
      <div
        className="absolute inset-2 pointer-events-none rounded-lg border-2"
        style={{
          borderImage: `repeating-linear-gradient(
            45deg, #d1d5db 0 6px,
            transparent 6px 10px
          )`,
          borderImageSlice: 1,
        }}
      ></div>

      <CreateNewGroupModal
        renderTrigger={() => (
          <BaseButton variant="contained" color="secondary" size="medium">
            Create New Group
            <AddIcon className="w-4 h-4 ml-2" />
          </BaseButton>
        )}
      />
    </div>
  );
};

export default ClusterNewGroup;
