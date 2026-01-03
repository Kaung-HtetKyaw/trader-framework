'use client';

import React, { useMemo, useState } from 'react';
import { User, UserRoleEnum, UserRoles } from '@/types/user';
import RoleChangeModal from '../modals/organization/RoleChangeModal/RoleChangeModal';
import DeleteUserModal from '../modals/organization/DeleteUserModal';
import BaseActionMenu, { ActionMenuItem } from './BaseActionMenu';
import { useDeleteUserMutation } from '@/store/api/organizationApi';
import { CustomToast } from '../CustomToast';
import { notifyErrorFromResponse } from '@/lib/utils/error';
import { useSession } from 'next-auth/react';
import { logoutAndRedirect } from '@/lib/authClient';
import { OwnerIcon } from '@/components/svgs/OwnerIcon';
import { UserIcon } from '@/components/svgs/UserIcon';
import { AdminIcon } from '@/components/svgs/AdminIcon';
import { DeleteDataIcon } from '@/components/svgs/DeleteDataIcon';
import { useAbility } from '@/lib/authorization/casl/AbilityProvider';
import { OrganizationMemberWithIndex } from '../tables/OrganizationMemberTable/columns';

export type UserWithIndex = User & { index: number };

type MemberActionMenuProps = {
  users: OrganizationMemberWithIndex[];
  member: UserWithIndex;
  roleData: UserRoleEnum[];
  isHigherRole: (currentRole: UserRoleEnum, targetRole: UserRoleEnum) => boolean;
  className?: string;
};

const MemberActionMenu: React.FC<MemberActionMenuProps> = ({ users, member, roleData, isHigherRole, className }) => {
  const { data: session } = useSession();
  const ability = useAbility();
  const [openRole, setOpenRole] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRoleEnum | null>(null);

  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const handleRoleClick = (role: UserRoleEnum) => {
    setSelectedRole(role);
    setOpenRole(true);
  };

  const isLastOwner = useMemo(() => {
    return users.filter(user => user.role === UserRoles.owner).length === 1;
  }, [users]);

  const isValidOwnerDowngrade = useMemo(() => {
    return isLastOwner && member.role === UserRoles.owner;
  }, [isLastOwner, member.role]);

  const shouldAllowDeletion = useMemo(() => {
    if (isLastOwner && member.role === UserRoles.owner) {
      return false;
    }

    return true;
  }, [member, isLastOwner]);

  const items: ActionMenuItem[] = useMemo(
    () => [
      ...(member.role !== UserRoles.owner && ability.can('make-org-owner', 'roles')
        ? [
            {
              label: 'Make Org Owner',
              icon: OwnerIcon,
              onSelect: () => handleRoleClick(UserRoles.owner),
            },
          ]
        : []),
      ...(member.role !== UserRoles.admin && ability.can('make-org-admin', 'roles') && !isValidOwnerDowngrade
        ? [
            {
              label: 'Make Org Admin',
              icon: AdminIcon,
              onSelect: () => handleRoleClick(UserRoles.admin),
            },
          ]
        : []),
      ...(member.role !== UserRoles.user && ability.can('make-org-user', 'roles') && !isValidOwnerDowngrade
        ? [
            {
              label: 'Make Org User',
              icon: UserIcon,
              onSelect: () => handleRoleClick(UserRoles.user),
            },
          ]
        : []),
      ...(shouldAllowDeletion
        ? [
            {
              label: 'Delete User',
              icon: DeleteDataIcon,
              onSelect: () => setOpenDelete(true),
            },
          ]
        : []),
    ],
    [member, ability, isValidOwnerDowngrade, shouldAllowDeletion]
  );

  const isDisabled = useMemo(() => {
    return items.length === 0 || isHigherRole(member.role as UserRoleEnum, session?.user?.role as UserRoleEnum);
  }, [isHigherRole, session?.user?.role, member.role, items]);

  const handleDelete = async () => {
    const response = await deleteUser({ userID: member.id });

    const { error, notify } = notifyErrorFromResponse(response);
    if (error) {
      return notify(error?.errorMessage || 'Something went wrong');
    }

    setOpenDelete(false);

    if (session?.user?.email === member.email) {
      logoutAndRedirect();
      return;
    }

    CustomToast({
      type: 'success',
      message: 'The user has been deleted successfully!',
    });
  };

  return (
    <>
      <BaseActionMenu items={items} className={className} disabled={isDisabled} />

      <RoleChangeModal
        open={openRole}
        onOpenChange={setOpenRole}
        role={selectedRole}
        member={member}
        availableRoles={roleData}
      />

      <DeleteUserModal
        isLoading={isDeleting}
        open={openDelete}
        onOpenChange={setOpenDelete}
        userName={member.email}
        onDelete={handleDelete}
      />
    </>
  );
};

export default MemberActionMenu;
