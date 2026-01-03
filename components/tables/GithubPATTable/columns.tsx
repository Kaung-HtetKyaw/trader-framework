'use client';

import { ColumnDef } from '@tanstack/react-table';
import DeleteGithubPATModal from '@/components/modals/DeleteGithubPATModal';
import Can from '@/lib/authorization/casl/Can';
import { PersonalAccessToken } from '@/types/gitOps';
import EditGithubPATModal from '@/components/modals/EditGithubPATModal';
import TableContentTooltip from '@/components/TableContentTooltip';
import TableContentTooltipText from '@/components/TableContentTooltipText';
import { INDEX_COL_SIZE } from '@/components/SimpleTable';

export type GithubPATWithIndex = PersonalAccessToken & {
  index: number;
};

export const getColumns: (repositories: string[]) => ColumnDef<GithubPATWithIndex>[] = repositories => [
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
    cell: ({ row, table }) => {
      return (
        <div className="flex flex-row gap-1">
          <TableContentTooltip table={table} row={row} label={row.original.value}>
            <TableContentTooltipText>{row.original.value}</TableContentTooltipText>
          </TableContentTooltip>
        </div>
      );
    },
  },
  {
    id: 'action',
    header: 'Actions',
    cell: ({ row }) => {
      return (
        <div className="flex flex-row gap-4">
          <Can do="update" on="personal_access_tokens">
            <EditGithubPATModal tokenID={row.original.id} previousToken={row.original.value} />
          </Can>
          <Can do="delete" on="personal_access_tokens">
            <DeleteGithubPATModal tokenID={row.original.id} repositoryIDs={repositories} />
          </Can>
        </div>
      );
    },
  },
];
