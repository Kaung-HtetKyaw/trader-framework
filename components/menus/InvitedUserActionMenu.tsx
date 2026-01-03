'use client';

import React, { useState } from 'react';
import BaseActionMenu, { ActionMenuItem } from './BaseActionMenu';
import DeleteInviteModal from '../modals/organization/DeleteUserInviteModal';
import { notifyErrorFromResponse } from '@/lib/utils/error';
import { CustomToast } from '../CustomToast';
import { useDeleteInviteUserMutation } from '@/store/api/organizationApi';
import { DeleteDataIcon } from '@/components/svgs/DeleteDataIcon';

type InvitedUserActionMenuProps = {
  email: string;
  className?: string;
};

const InvitedUserActionMenu: React.FC<InvitedUserActionMenuProps> = ({ email, className }) => {
  const [openDelete, setOpenDelete] = useState(false);

  const items: ActionMenuItem[] = [
    {
      label: 'Delete Invite',
      icon: DeleteDataIcon,
      onSelect: () => setOpenDelete(true),
    },
  ];

  const [deleteInviteUser] = useDeleteInviteUserMutation();
  const handleDeleteUserInvite = async () => {
    const response = await deleteInviteUser({ email });

    const { error, notify } = notifyErrorFromResponse(response);

    if (error) {
      return notify(error?.errorMessage || 'Something went wrong');
    }

    setOpenDelete(false);

    CustomToast({
      type: 'success',
      message: 'The invitation has been deleted successfully!',
    });
  };

  return (
    <>
      <BaseActionMenu items={items} className={className} />

      <DeleteInviteModal
        open={openDelete}
        onOpenChange={setOpenDelete}
        email={email}
        onDelete={handleDeleteUserInvite}
      />
    </>
  );
};

export default InvitedUserActionMenu;
