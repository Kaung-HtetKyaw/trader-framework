'use client';

import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { BaseButton } from '@/components/ui/base-button';
import { DeleteInviteIcon } from '@/components/svgs/DeleteInviteIcon';

type DeleteInviteModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  email: string;
  onDelete: () => void;
};

const DeleteInviteModal: React.FC<DeleteInviteModalProps> = ({ open, onOpenChange, email, onDelete }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTitle className="sr-only w-0">Remove User</DialogTitle>

      <DialogTrigger className="invisible sr-only opacity-0 w-0" asChild>
        <button>Open</button>
      </DialogTrigger>

      <DialogContent className="w-[420px] max-w-none px-12 py-8 bg-white rounded-xl flex flex-col justify-center items-center gap-6">
        <div className="w-full flex flex-col items-center gap-4">
          <div className="flex flex-col items-center gap-2">
            <DeleteInviteIcon className="w-12 h-12 text-error-500" />
            <div className="text-center text-text-950 text-lg font-medium leading-[21.6px]">Delete invite</div>
          </div>

          <div className="w-full text-center text-sm leading-[16.8px] text-text-950">
            Are you sure you want to delete the invitation for <span className="font-semibold">“{email}”</span> ? This
            action cannot be undone.
          </div>
        </div>

        <div className="w-full flex gap-3">
          <BaseButton
            onClick={() => onOpenChange(false)}
            variant="contained"
            color="cancel"
            size="medium"
            className="flex-1"
          >
            Cancel
          </BaseButton>

          <BaseButton
            onClick={() => {
              onDelete();
            }}
            variant="contained"
            color="error"
            size="medium"
            className="flex-1"
          >
            Delete
          </BaseButton>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteInviteModal;
