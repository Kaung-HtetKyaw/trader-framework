'use client';

import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { BaseButton } from '@/components/ui/base-button';
import InviteUserForm from './InviteUserForm';
import { useMemo, useState } from 'react';
import { capitalize } from 'lodash/fp';
import { InviteUserIcon } from '@/components/svgs/InviteUserIcon';
import useGetRolesHierarchy from '@/lib/hooks/useGetRolesHierarchy';
import { UserRoleEnum } from '@/types/user';
import { useSession } from 'next-auth/react';
export type InviteUserModalProps = {
  renderTrigger?: () => React.ReactNode;
};

const InviteUserModal = ({ renderTrigger }: InviteUserModalProps) => {
  const [open, setOpen] = useState(false);

  const { data, isLoading, isHigherRole } = useGetRolesHierarchy();
  const { data: session } = useSession();

  const roles = useMemo(() => data?.map(el => el.name) || [], [data]);

  const currentRole = useMemo(() => session?.user?.role as UserRoleEnum, [session?.user?.role]);

  const roleOptions = useMemo(() => {
    return (
      roles
        ?.filter(role => isHigherRole(currentRole, role, true))
        ?.map(role => ({
          label: capitalize(role),
          value: role,
        })) || []
    );
  }, [roles, isHigherRole, currentRole]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTitle className="sr-only">Invite User</DialogTitle>
      <DialogTrigger asChild>
        {renderTrigger ? (
          renderTrigger()
        ) : (
          <BaseButton size="small" className="px-2">
            <span className="text-white body-2">Invite User</span>
            <InviteUserIcon className="!w-4 !h-4 text-text-50" />
          </BaseButton>
        )}
      </DialogTrigger>

      <DialogContent className="bg-white w-[540px] max-w-none py-8 px-12 rounded-xl flex flex-col justify-center items-center gap-2">
        <div className="flex flex-col justify-start items-center gap-2 w-full">
          <InviteUserIcon className="!w-12 !h-12 text-secondary-500" />
          <div className="text-center text-text-950 text-lg font-medium leading-[21.6px]">
            Invite user to organization
          </div>
        </div>
        <div className="flex flex-col justify-start items-start w-full">
          {!!roleOptions.length && (
            <InviteUserForm
              roles={data || []}
              roleOptions={roleOptions || []}
              isLoading={isLoading}
              onClose={() => setOpen(false)}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InviteUserModal;
