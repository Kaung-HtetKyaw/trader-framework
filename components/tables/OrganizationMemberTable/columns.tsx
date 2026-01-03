'use client';
import { ColumnDef } from '@tanstack/react-table';
import { capitalize } from 'lodash';
import MemberActionMenu from '@/components/menus/MemberActionMenu';
import { CombinedUser, UserRoleEnum, UserRoles } from '@/types/user';
import InvitedUserActionMenu from '@/components/menus/InvitedUserActionMenu';
import TableContentTooltip from '@/components/TableContentTooltip';
import TableContentTooltipText from '@/components/TableContentTooltipText';
import { INDEX_COL_SIZE } from '@/components/SimpleTable';

export type OrganizationMemberWithIndex = CombinedUser & { index: number };

export const getColumns = (
  users: OrganizationMemberWithIndex[],
  roleData: UserRoleEnum[],
  isHigherRole: (currentRole: UserRoleEnum, targetRole: UserRoleEnum) => boolean
): ColumnDef<OrganizationMemberWithIndex>[] => [
  {
    id: 'index',
    maxSize: INDEX_COL_SIZE,
    header: '#',
    cell: ({ row, column }) => (
      <p
        style={{
          width: `${column.getSize()}px`,
        }}
      >
        {row.original.index}
      </p>
    ),
  },
  {
    id: 'name',
    header: 'Name',
    minSize: 100,
    cell: ({ row, table }) => {
      const member = row.original;
      const fullName =
        'firstName' in member && 'lastName' in member && (member.firstName.trim() || member.lastName.trim())
          ? `${capitalize(member.firstName || '')} ${capitalize(member.lastName || '')}`.trim()
          : '-';
      return (
        <div className="flex flex-col row items-start">
          <TableContentTooltip table={table} row={row} label={fullName}>
            <TableContentTooltipText>{fullName}</TableContentTooltipText>
          </TableContentTooltip>
        </div>
      );
    },
  },
  {
    id: 'email',
    header: 'Email',
    minSize: 200,
    cell: ({ row, table }) => {
      return (
        <div className="flex flex-col row items-start truncate">
          <TableContentTooltip table={table} row={row} label={row.original.email}>
            <TableContentTooltipText>{row.original.email}</TableContentTooltipText>
          </TableContentTooltip>
        </div>
      );
    },
  },
  {
    id: 'role',
    header: 'Role',
    minSize: 100,
    cell: ({ row, table }) => {
      const role = row.original.role;

      const formatRole =
        role === UserRoles.owner || role === UserRoles.admin ? `Org ${capitalize(role)}` : capitalize(role);

      return (
        <div className="flex flex-col row items-start">
          <TableContentTooltip table={table} row={row} label={formatRole}>
            <TableContentTooltipText>{formatRole}</TableContentTooltipText>
          </TableContentTooltip>
        </div>
      );
    },
  },
  {
    id: 'status',
    header: 'Status',
    minSize: 100,
    cell: ({ row, table }) => {
      const member = row.original;
      // Treat as 'Active' if it's a real user (regardless of verified status), otherwise 'Invited'
      const status = 'id' in member ? 'Active' : 'Invited';
      return (
        <div className="flex flex-col row items-start">
          <TableContentTooltip table={table} row={row} label={status}>
            <TableContentTooltipText>{status}</TableContentTooltipText>
          </TableContentTooltip>
        </div>
      );
    },
  },
  {
    id: 'action',
    header: 'Actions',
    cell: ({ row }) => {
      const member = row.original;

      return (
        <div className="flex flex-row items-center ">
          {'id' in member ? (
            <MemberActionMenu
              users={users}
              member={member}
              roleData={roleData}
              isHigherRole={isHigherRole}
              className="w-50"
            />
          ) : (
            <InvitedUserActionMenu email={member.email} className="w-50" />
          )}
        </div>
      );
    },
  },
];
