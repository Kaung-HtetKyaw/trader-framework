'use client';
import { ColumnDef } from '@tanstack/react-table';
import { Namespace } from '@/types/namespace';
import SimpleSortableHeader from '@/components/SimpleTable/SimpleSortableHeader';
import ClusterInfoCheckboxCell from '@/components/ClusterInfoCheckboxCell';
import TableContentTooltip from '@/components/TableContentTooltip';
import TableContentTooltipText from '@/components/TableContentTooltipText';
import { INDEX_COL_SIZE } from '@/components/SimpleTable';

export type NamespaceWithIndex = Namespace & { index: number };

export const getColumns = ({
  onToggleSelection,
  isRowDisabled,
}: {
  isRowDisabled: (id: string) => boolean;
  onToggleSelection: (id: string) => void;
}): ColumnDef<NamespaceWithIndex>[] => [
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
    header: ({ column }) => {
      return <SimpleSortableHeader column={column}>Name</SimpleSortableHeader>;
    },
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
    id: 'status',
    header: ({ column }) => {
      return <SimpleSortableHeader column={column}>Status</SimpleSortableHeader>;
    },
    cell: ({ row }) => {
      return <p className="body-2 text-text-950"> {row.original.status || '-'} </p>;
    },
  },
  {
    id: 'age',
    header: ({ column }) => {
      return <SimpleSortableHeader column={column}>Age</SimpleSortableHeader>;
    },
    cell: ({ row }) => {
      return <p className="body-2 text-text-950"> {row.original.age || '-'} </p>;
    },
  },
];
