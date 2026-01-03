'use client';

import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import ModalActionButton from '../../ModalActionButton';
import { DeleteUserIcon } from '@/components/svgs/DeleteUserIcon';
import LoadingSpinner from '@/components/LoadingSpinner';

export type DeleteUserModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userName: string;
  isLoading: boolean;
  onDelete: () => void;
};

const DeleteUserModal = ({ open, onOpenChange, userName, onDelete, isLoading }: DeleteUserModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTitle className="sr-only w-0">Remove User</DialogTitle>

      <DialogTrigger className="invisible opacity-0 w-0" asChild>
        <button>Open</button>
      </DialogTrigger>

      <DialogContent className="w-[420px] max-w-none px-12 py-8 bg-white rounded-xl flex flex-col justify-center items-center gap-6">
        <div className="w-full flex flex-col items-center gap-4">
          <div className="flex flex-col items-center gap-2">
            <DeleteUserIcon className="w-12 h-12 text-error-500" />
            <div className="text-center text-text-950 text-lg font-medium leading-[21.6px]">Delete User</div>
          </div>

          <div className="w-full text-center text-sm leading-[16.8px] text-text-950">
            Are you sure you want to remove <span className="font-semibold">“{userName}”</span> from this organization?
            This action cannot be undone and the user will lose all access immediately.
          </div>
        </div>

        <div className="w-full flex gap-3">
          <ModalActionButton action="cancel" onClick={() => onOpenChange(false)} className="flex-1">
            Cancel
          </ModalActionButton>

          <ModalActionButton
            action="submit"
            onClick={() => {
              onDelete();
              onOpenChange(false);
            }}
            color="error"
            className="flex-1"
          >
            {isLoading ? (
              <LoadingSpinner className="w-full gap-2">
                <p>Deleting...</p>
              </LoadingSpinner>
            ) : (
              <span>Delete</span>
            )}
          </ModalActionButton>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteUserModal;
