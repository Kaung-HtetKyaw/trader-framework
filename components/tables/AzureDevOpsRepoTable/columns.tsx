'use client';

import CustomEllipsis from '@/components/CustomEllipsis';
import { ColumnDef } from '@tanstack/react-table';
import Can from '@/lib/authorization/casl/Can';
import DeleteAzureDevOpsRepoModal from '@/components/modals/DeleteAzureDevOpsRepoModal';
import EditAzureDevOpsRepoModal from '@/components/modals/EditAzureDevOpsRepoModal';
import { Repository } from '@/types/gitOps';
import { INDEX_COL_SIZE } from '@/components/SimpleTable';

export type AzureDevOpsRepoWithIndex = Repository & {
  index: number;
};

export const columns: ColumnDef<AzureDevOpsRepoWithIndex>[] = [
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
    header: 'Repository Name',
    maxSize: 300,
    cell: ({ row }) => {
      return (
        <div className="flex flex-row gap-1">
          <CustomEllipsis
            className="body-2 text-text-950 font-semibold break-all"
            text={row.original.name}
            maxLength={60}
          />
        </div>
      );
    },
  },
  {
    id: 'description',
    header: 'Description',
    cell: ({ row }) => {
      return (
        <div className="flex flex-row gap-1">
          <div style={{ width: '500px' }} className="min-w-0">
            <CustomEllipsis
              className="body-2 text-text-950 font-semibold break-all"
              text={row.original.description}
              maxLength={250}
            />
          </div>
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
          <Can do="update" on="repositories">
            <EditAzureDevOpsRepoModal
              repositoryID={row.original.id}
              defaultValues={{ name: row.original.name, description: row.original.description }}
            />
          </Can>
          <Can do="delete" on="repositories">
            <DeleteAzureDevOpsRepoModal repositoryID={row.original.id} />
          </Can>
        </div>
      );
    },
  },
];
