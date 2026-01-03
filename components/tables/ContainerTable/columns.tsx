'use client';
import { ColumnDef } from '@tanstack/react-table';
import { ContainerDetails } from '@/types/container';
import SimpleSortableHeader from '@/components/SimpleTable/SimpleSortableHeader';
import ClusterInfoCheckboxCell from '@/components/ClusterInfoCheckboxCell';
import TableContentTooltipText from '@/components/TableContentTooltipText';
import TableContentTooltip from '@/components/TableContentTooltip';
import { INDEX_COL_SIZE } from '@/components/SimpleTable';

export type ContainerWithIndex = ContainerDetails & { index: number };

export const getColumns = ({
  onToggleSelection,
  isRowDisabled,
}: {
  isRowDisabled: (id: string) => boolean;
  onToggleSelection: (id: string) => void;
}): ColumnDef<ContainerWithIndex>[] => [
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
    minSize: 100,
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
    id: 'ready',
    maxSize: 100,
    header: ({ column }) => {
      return <SimpleSortableHeader column={column}>Ready</SimpleSortableHeader>;
    },
    cell: ({ row }) => {
      return <p className="body-2 text-text-950">{row.original.ready ? 'Yes' : 'No'}</p>;
    },
  },
  {
    id: 'image',
    minSize: 100,
    header: ({ column }) => {
      return <SimpleSortableHeader column={column}>Image</SimpleSortableHeader>;
    },
    cell: ({ row }) => {
      return <p className="body-2 text-text-950">{row.original.image}</p>;
    },
  },

  {
    id: 'version',
    minSize: 100,
    header: ({ column }) => {
      return <SimpleSortableHeader column={column}>Version</SimpleSortableHeader>;
    },
    cell: ({ row, table }) => {
      return (
        <TableContentTooltip table={table} row={row} label={row.original.version}>
          <TableContentTooltipText className="font-normal">{row.original.version}</TableContentTooltipText>
        </TableContentTooltip>
      );
    },
  },

  {
    id: 'podName',
    minSize: 200,
    header: ({ column }) => {
      return <SimpleSortableHeader column={column}>Pod Name</SimpleSortableHeader>;
    },
    cell: ({ row, table }) => {
      return (
        <TableContentTooltip table={table} row={row} label={row.original.podName}>
          <TableContentTooltipText className="font-normal">{row.original.podName}</TableContentTooltipText>{' '}
        </TableContentTooltip>
      );
    },
  },
];
