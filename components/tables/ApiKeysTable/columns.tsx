'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ClusterKey } from '@/types/cluster';
import ResponsiveEllipsis from '@/components/ResponsiveEllipsis';
import DeleteClusterTokenModal from '@/components/modals/DeleteClusterTokenModal';
import EditClusterTokenModal from '@/components/modals/EditClusterTokenModal';
import Can from '@/lib/authorization/casl/Can';
import TableContentTooltip from '@/components/TableContentTooltip';
import TableContentTooltipText from '@/components/TableContentTooltipText';
import { INDEX_COL_SIZE } from '@/components/SimpleTable';

export type ClusterKeyWithIndex = ClusterKey & { index: number };

export const columns: ColumnDef<ClusterKeyWithIndex>[] = [
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
    header: 'Key Name',
    minSize: 200,
    cell: ({ row, table }) => {
      return (
        <div className="flex flex-col row items-start justify-center">
          <TableContentTooltip table={table} row={row} label={row.original.name}>
            <TableContentTooltipText>{row.original.name}</TableContentTooltipText>
          </TableContentTooltip>
        </div>
      );
    },
  },
  {
    id: 'value',
    header: 'Key',
    minSize: 350,
    cell: ({ row }) => {
      return (
        <div className="flex flex-row gap-1">
          <ResponsiveEllipsis
            className=" body-2 bg-text-200 gap-1 flex w-fit rounded-xs px-2 h-6 items-center"
            text={row.original.value}
            visibleChars={{ start: 10, end: 10 }}
            enableCopy
          />
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
          <Can do="update" on="cluster_tokens">
            <EditClusterTokenModal token={row.original} />
          </Can>
          <Can do="delete" on="cluster_tokens">
            <DeleteClusterTokenModal token={row.original} />
          </Can>
        </div>
      );
    },
  },
];
