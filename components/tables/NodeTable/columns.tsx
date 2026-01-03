'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ClusterNode } from '@/types/node';
import SimpleSortableHeader from '@/components/SimpleTable/SimpleSortableHeader';
import ClusterInfoCheckboxCell from '@/components/ClusterInfoCheckboxCell';
import TableContentTooltip from '@/components/TableContentTooltip';
import TableContentTooltipText from '@/components/TableContentTooltipText';
import { INDEX_COL_SIZE } from '@/components/SimpleTable';

export type ClusterNodeWithIndex = ClusterNode & { index: number };

export const getColumns = ({
  onToggleSelection,
  isRowDisabled,
}: {
  isRowDisabled: (id: string) => boolean;
  onToggleSelection: (id: string) => void;
}): ColumnDef<ClusterNodeWithIndex>[] => [
  {
    id: 'select',
    maxSize: 40,
    header: () => null,
    cell: ({ row }) => (
      <ClusterInfoCheckboxCell
        id={row.original.id}
        onToggleSelection={onToggleSelection}
        isRowDisabled={isRowDisabled}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
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
    size: 200,
    header: ({ column }) => {
      return <SimpleSortableHeader column={column}>Name</SimpleSortableHeader>;
    },
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
    id: 'status',
    size: 250,
    header: ({ column }) => {
      return <SimpleSortableHeader column={column}>Status</SimpleSortableHeader>;
    },
    cell: ({ row, table }) => {
      return (
        <div className="flex flex-col row items-start justify-center truncate">
          <TableContentTooltip table={table} row={row} label={row.original.status}>
            <TableContentTooltipText className="font-normal">{row.original.status || '-'}</TableContentTooltipText>
          </TableContentTooltip>
        </div>
      );
    },
  },
  {
    id: 'kubeletVersion',
    size: 150,
    header: ({ column }) => {
      return <SimpleSortableHeader column={column}>Kubelet Version</SimpleSortableHeader>;
    },
    cell: ({ row }) => {
      return <p className="body-2 text-text-950 truncate"> {row.original.kubeletVersion || '-'} </p>;
    },
  },
  {
    id: 'age',
    size: 100,
    header: ({ column }) => {
      return <SimpleSortableHeader column={column}>Age</SimpleSortableHeader>;
    },
    cell: ({ row }) => {
      return <p className="body-2 text-text-950"> {row.original.age || '-'} </p>;
    },
  },
];
