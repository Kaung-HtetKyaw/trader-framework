'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Cluster } from '@/types/cluster';
import { Checkbox } from '@/components/ui/checkbox';
import TableContentTooltip from '@/components/TableContentTooltip';
import TableContentTooltipText from '@/components/TableContentTooltipText';

export const getColumns = ({
  onToggle,
  onToggleAll,
  selectedClusterIDs,
  isAllSelected,
}: {
  onToggle: (clusterID: string) => void;
  onToggleAll: () => void;
  selectedClusterIDs: string[];
  isAllSelected: boolean;
}): ColumnDef<Cluster>[] => [
  {
    id: 'selection',
    maxSize: 20,
    header: () => (
      <Checkbox
        id="remember-me"
        className="w-5 h-5 border border-text-200 rounded-md  data-[state=checked]:bg-primary-950 data-[state=checked]:text-text-50"
        checked={isAllSelected}
        onCheckedChange={onToggleAll}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        id="remember-me"
        className="w-5 h-5 border border-text-200 rounded-md  data-[state=checked]:bg-primary-950 data-[state=checked]:text-text-50"
        checked={selectedClusterIDs.includes(row.original.id)}
        onCheckedChange={() => onToggle(row.original.id)}
      />
    ),
  },
  {
    id: 'name',
    header: 'Cluster',
    cell: ({ row, table }) => {
      return (
        <div className="flex flex-col row items-start justify-center">
          <TableContentTooltip table={table} row={row} label={row.original.name}>
            <TableContentTooltipText className='"body-2 text-text-950 font-bold'>
              {row.original.name}
            </TableContentTooltipText>
          </TableContentTooltip>
        </div>
      );
    },
  },
];
