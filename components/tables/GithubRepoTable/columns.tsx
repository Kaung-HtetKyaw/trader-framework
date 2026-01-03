'use client';

import { ColumnDef } from '@tanstack/react-table';
import Can from '@/lib/authorization/casl/Can';
import DeleteGithubRepoModal from '@/components/modals/DeleteGithubRepoModal';
import EditGithubRepoModal from '@/components/modals/EditGithubRepo';
import { Repository } from '@/types/gitOps';
import TableContentTooltip from '@/components/TableContentTooltip';
import TableContentTooltipText from '@/components/TableContentTooltipText';
import { INDEX_COL_SIZE } from '@/components/SimpleTable';

export type GithubRepoWithIndex = Repository & {
  index: number;
};

export const columns: ColumnDef<GithubRepoWithIndex>[] = [
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
    maxSize: 300,
    header: 'Repository Name',
    cell: ({ row, table }) => {
      return (
        <div className="flex flex-row gap-1">
          <TableContentTooltip table={table} row={row} label={row.original.name}>
            <TableContentTooltipText>{row.original.name}</TableContentTooltipText>
          </TableContentTooltip>
        </div>
      );
    },
  },
  {
    id: 'description',
    header: 'Description',
    cell: ({ row }) => {
      return (
        <div className="flex flex-row gap-1 w-full">
          <div className="min-w-0">
            <span className="body-2 text-text-950 font-semibold line-clamp-2 md:line-clamp-3 xl:line-clamp-4 break-words ">
              {row.original.description}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    id: 'action',
    header: 'Actions',
    minSize: 200,
    cell: ({ row }) => {
      return (
        <div className="flex flex-row gap-4">
          <Can do="update" on="repositories">
            <EditGithubRepoModal
              repositoryID={row.original.id}
              defaultValues={{ name: row.original.name, description: row.original.description }}
            />
          </Can>
          <Can do="delete" on="repositories">
            <DeleteGithubRepoModal repositoryID={row.original.id} />
          </Can>
        </div>
      );
    },
  },
];
