'use client';

import CustomEllipsis from '@/components/CustomEllipsis';
import { ColumnDef } from '@tanstack/react-table';
import DeleteAzureDevOpsPATModal from '@/components/modals/DeleteAzureDevOpsPATModal';
import Can from '@/lib/authorization/casl/Can';
import EditAzureDevOpsPATModal from '@/components/modals/EditAzureDevOpsPATModal';
import { PersonalAccessToken } from '@/types/gitOps';
import { INDEX_COL_SIZE } from '@/components/SimpleTable';

export type AzureDevOpsPATWithIndex = PersonalAccessToken & {
  index: number;
};

export const getColumns: (repositories: string[]) => ColumnDef<AzureDevOpsPATWithIndex>[] = repositories => [
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
    id: 'value',
    header: 'Personal Access Token (PAT)',
    maxSize: 300,
    cell: ({ row }) => {
      return (
        <div className="flex flex-row gap-1">
          <CustomEllipsis className="body-2 text-text-950 font-semibold" text={row.original.value} maxLength={20} />
        </div>
      );
    },
  },
  {
    id: 'owner',
    header: 'Organization',
    cell: ({ row }) => {
      return (
        <div className="flex flex-row gap-1">
          <CustomEllipsis className="body-2 text-text-950 font-semibold" text={row.original.owner} maxLength={20} />
        </div>
      );
    },
  },
  {
    id: 'action',
    header: 'Actions',
    maxSize: 200,
    cell: ({ row }) => {
      return (
        <div className="flex flex-row gap-4">
          <Can do="update" on="personal_access_tokens">
            <EditAzureDevOpsPATModal tokenID={row.original.id} owner={row.original.owner} />
          </Can>
          <Can do="delete" on="personal_access_tokens">
            <DeleteAzureDevOpsPATModal tokenID={row.original.id} repositoryIDs={repositories} />
          </Can>
        </div>
      );
    },
  },
];
