'use client';
import { BaseButton } from '@/components/ui/base-button';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Cluster } from '@/types/cluster';
import { useState } from 'react';
import EditClusterGroupModalForm from './ChangeClusterGroupModalForm';
import CreateNewGroupForm from '../CreateNewGroup/form';
import { EditClusterIcon } from '@/components/svgs/EditCluster';

export type ChangeClusterGroupModalProps = {
  cluster: Cluster;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export type EditClusterGroupModalType = 'change' | 'create';

const ChangeClusterGroupModal = ({ cluster, open, onOpenChange }: ChangeClusterGroupModalProps) => {
  const [editClusterGroupModalType, setEditClusterGroupModalType] = useState<EditClusterGroupModalType>('change');

  const handleOpenChange = (open: boolean) => {
    if (open) {
      setEditClusterGroupModalType('change');
    }
    onOpenChange(open);
  };
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTitle>
        <DialogTrigger asChild>
          <BaseButton
            size="small"
            className="px-2 pr-4 py-1 h-auto bg-text-400 hover:bg-text-500  "
            onClick={() => handleOpenChange(true)}
          >
            <EditClusterIcon className="!w-5 !h-5 text-text-50" />
            <span className="text-white body-3">Edit</span>
          </BaseButton>
        </DialogTrigger>
      </DialogTitle>

      <DialogContent className="bg-white w-[80vw] md:w-[43vw] xl:w-[51vw] xl:max-w-[900px] max-w-full p-8 px-10">
        {editClusterGroupModalType === 'change' && (
          <EditClusterGroupModalForm
            cluster={cluster}
            onOpenChange={handleOpenChange}
            onCreateNewGroup={() => setEditClusterGroupModalType('create')}
          />
        )}
        {editClusterGroupModalType === 'create' && (
          <CreateNewGroupForm onClose={() => setEditClusterGroupModalType('change')} />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ChangeClusterGroupModal;
