'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Pod } from '@/types/pod';
import SimpleSortableHeader from '@/components/SimpleTable/SimpleSortableHeader';
import ClusterInfoCheckboxCell from '@/components/ClusterInfoCheckboxCell';
import TableContentTooltip from '@/components/TableContentTooltip';
import TableContentTooltipText from '@/components/TableContentTooltipText';
import { INDEX_COL_SIZE } from '@/components/SimpleTable';

export type PodWithIndex = Pod & { index: number };

export const getColumns = ({
  isRowDisabled,
  onToggleSelection,
}: {
  isRowDisabled: (id: string) => boolean;
  onToggleSelection: (id: string) => void;
}): ColumnDef<PodWithIndex>[] => [
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
    maxSize: 300,
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
    id: 'containerCount',
    maxSize: 150,
    header: ({ column }) => {
      return (
        <SimpleSortableHeader className="text-nowrap" column={column}>
          Container Count
        </SimpleSortableHeader>
      );
    },
    cell: ({ row }) => {
      return <p className="body-2 text-text-950">{row.original.containerCount}</p>;
    },
  },
  {
    id: 'status',
    header: ({ column }) => {
      return <SimpleSortableHeader column={column}>Status</SimpleSortableHeader>;
    },
    cell: ({ row }) => {
      return <p className="body-2 text-text-950">{row.original.status || '-'}</p>;
    },
  },
  {
    id: 'restartCount',
    header: ({ column }) => {
      return <SimpleSortableHeader column={column}>Restart Count</SimpleSortableHeader>;
    },
    cell: ({ row }) => {
      return <p className="body-2 text-text-950">{row.original.restartCount}</p>;
    },
  },

  {
    id: 'age',
    header: ({ column }) => {
      return <SimpleSortableHeader column={column}>Age</SimpleSortableHeader>;
    },
    cell: ({ row }) => {
      return <p className="body-2 text-text-950">{row.original.age || '-'}</p>;
    },
  },
];
