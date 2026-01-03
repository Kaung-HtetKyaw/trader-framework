'use client';

import InviteUserModal from '@/components/modals/organization/InviteUserModal';
import OrganizationMemberTable from '@/components/tables/OrganizationMemberTable';
import { BaseButton } from '@/components/ui/base-button';
import EditOrganization from './EditOrganization';
import { InviteUserIcon } from '@/components/svgs/InviteUserIcon';

const UserRolePage = () => {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-row items-center justify-between">
        <h1 className="body-1 font-bold">User Role</h1>
        <InviteUserModal
          renderTrigger={() => (
            <BaseButton size="small" className="w-fit flex flex-row items-center gap-1">
              <span className="text-white body-2 ">Invite User</span>
              <InviteUserIcon className="!w-4 !h-4 text-text-50" />
            </BaseButton>
          )}
        />
      </div>
      <div className="flex flex-row items-center justify-between">
        <EditOrganization />
      </div>
      <OrganizationMemberTable />
    </div>
  );
};

export default UserRolePage;
