'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ClusterGroupWithStats } from '@/types/cluster';
import DeleteClusterGroupModal from '@/components/modals/DeleteClusterGroupModal';
import EditClusterGroupModal from '@/components/modals/EditClusterGroupModal';
import BulkMoveClustersToGroupModal from '@/components/modals/BulkMoveClustersToGroupModal';
import Can from '@/lib/authorization/casl/Can';
import { BaseButton } from '@/components/ui/base-button';
import { cn, isDefaultClusterGroup } from '@/lib/utils';
import { DeleteDataIcon } from '@/components/svgs/DeleteDataIcon';
import TableContentTooltip from '@/components/TableContentTooltip';
import TableContentTooltipText from '@/components/TableContentTooltipText';
import { INDEX_COL_SIZE } from '@/components/SimpleTable';

export type ClusterGroupWithIndex = ClusterGroupWithStats & { index: number };

export const columns: ColumnDef<ClusterGroupWithIndex>[] = [
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
    header: 'Group Name',
    minSize: 200,
    cell: ({ row, table }) => {
      return (
        <div className="flex flex-col row items-start justify-center truncate">
          <TableContentTooltip table={table} row={row} label={row.original.name}>
            <TableContentTooltipText>{row.original.name}</TableContentTooltipText>
          </TableContentTooltip>
        </div>
      );
    },
  },
  {
    id: 'total',
    header: 'Total Clusters',
    minSize: 100,
    cell: ({ row }) => {
      return (
        <div className="flex flex-col row items-start justify-center">
          <p className="body-2 text-text-950">{row.original.total}</p>
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
          {/* Even though we are adding modals for each row, there will only be one dialog component in the DOM */}
          <Can do="update" on="cluster_groups">
            <BulkMoveClustersToGroupModal group={row.original} />
          </Can>

          <Can do="update" on="cluster_groups">
            <EditClusterGroupModal group={row.original} />
          </Can>

          <Can do="delete" on="cluster_groups">
            <DeleteClusterGroupModal
              group={row.original}
              renderTrigger={() => (
                <BaseButton
                  disabled={isDefaultClusterGroup(row.original.name)}
                  className={cn(
                    'min-w-6 h-6 p-0',
                    isDefaultClusterGroup(row.original.name) && 'opacity-50 cursor-not-allowed'
                  )}
                  variant="text"
                >
                  <DeleteDataIcon className="!w-6 !h-6 text-red-600" />
                </BaseButton>
              )}
            />
          </Can>
        </div>
      );
    },
  },
];
