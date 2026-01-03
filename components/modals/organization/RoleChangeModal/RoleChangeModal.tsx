'use client';

import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import React, { useMemo } from 'react';
import { UserRoleEnum, UserRoles } from '@/types/user';
import { CustomToast } from '@/components/CustomToast';
import { notifyErrorFromResponse } from '@/lib/utils/error';
import { useUpdateUserRoleMutation } from '@/store/api/organizationApi';
import { UserWithIndex } from '@/components/menus/MemberActionMenu';
import ModalActionButton from '../../ModalActionButton';
import { OwnerIcon } from '@/components/svgs/OwnerIcon';
import { AdminIcon } from '@/components/svgs/AdminIcon';
import { UserIcon } from '@/components/svgs/UserIcon';
import LoadingSpinner from '@/components/LoadingSpinner';

type RoleChangeModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: UserRoleEnum | null;
  member: UserWithIndex;
  availableRoles: UserRoleEnum[];
};

const roleModalContent: Record<
  UserRoleEnum,
  { icon: React.ComponentType<{ className?: string; alt?: string }>; title: string; description: string }
> = {
  [UserRoles.owner]: {
    icon: OwnerIcon,
    title: 'Make org owner',
    description: 'Are you sure you want to make the current user to an “Org Owner”?',
  },
  [UserRoles.admin]: {
    icon: AdminIcon,
    title: 'Make org admin',
    description: 'Are you sure you want to make the current user to an “Org Admin”?',
  },
  [UserRoles.user]: {
    icon: UserIcon,
    title: 'Make org user',
    description: 'Are you sure you want to make the current user to an “Org User”?',
  },
};

const defaultContent = {
  icon: UserIcon,
  title: 'N/A',
  description: 'Are you sure you want to make the current user to an “N/A”?',
};

const RoleChangeModal: React.FC<RoleChangeModalProps> = ({ open, onOpenChange, role, member, availableRoles }) => {
  const [updateUserRole, { isLoading }] = useUpdateUserRoleMutation();
  const content = useMemo(() => (role ? roleModalContent[role] : defaultContent), [role]);
  const matchedRole = availableRoles.find(r => r === role);

  const handleConfirm = async () => {
    if (!matchedRole) {
      CustomToast({
        type: 'error',
        message: 'Unsupported role',
      });
      return;
    }

    const response = await updateUserRole({ userID: member.id, roleName: matchedRole });

    const { error, notify } = notifyErrorFromResponse(response);
    if (error) {
      return notify(error?.errorMessage || 'Something went wrong');
    }
    CustomToast({
      type: 'success',
      message: 'The role has been successfully changed!',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTitle className="sr-only">{content.title}</DialogTitle>
      <DialogTrigger className=" invisible opacity-0 hidden " asChild>
        <button>Open</button>
      </DialogTrigger>
      <DialogContent className="flex flex-col items-center gap-4 px-12 py-8 w-[420px]">
        <content.icon className="!w-12 !h-12 text-secondary-500" />
        <h2 className="text-text-950 font-semibold text-lg">{content.title}</h2>
        <p className="text-sm text-text-700 text-center">{content.description}</p>

        <div className="flex gap-3 mt-6 w-full">
          <ModalActionButton action="cancel" onClick={() => onOpenChange(false)} className="flex-1">
            Cancel
          </ModalActionButton>
          <ModalActionButton action="submit" onClick={handleConfirm} className="flex-1">
            {isLoading ? (
              <LoadingSpinner className="w-full gap-2">
                <p>Changing...</p>
              </LoadingSpinner>
            ) : (
              <span>Yes</span>
            )}
          </ModalActionButton>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RoleChangeModal;
