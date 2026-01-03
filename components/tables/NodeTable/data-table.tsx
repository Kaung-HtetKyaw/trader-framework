'use client';

import { ColumnDef } from '@tanstack/react-table';
import SimpleTable from '@/components/SimpleTable';
import { SortingState } from '@tanstack/react-table';
import { ClusterNodeWithIndex } from './columns';
import { ListSettings } from '@/types/list';
import { PagePaginationInfo } from '@/lib/hooks/usePaginator';
import useGetClusterInfoTableHeight from '@/lib/hooks/useGetClusterInfoTableHeight';

interface NodeListDataTableProps {
  columns: ColumnDef<ClusterNodeWithIndex>[];
  data: ClusterNodeWithIndex[];
  isFetching: boolean;
  listSettings: ListSettings;
  pageInfo: PagePaginationInfo;
  fetchNextPage: () => void;
  onSortChange: (sortSettings: SortingState) => void;
  isLoading?: boolean;
  rowKey?: keyof ClusterNodeWithIndex;
  rowSelection?: Record<string, boolean>;
  onRowSelectionChange?: (rowSelection: Record<string, boolean>) => void;
}

const id = 'cluster-info-node-table';

const NodeListDataTable = ({
  columns,
  data,
  isFetching,
  fetchNextPage,
  onSortChange,
  listSettings,
  pageInfo,
  isLoading,
  rowKey = 'id',
  rowSelection,
  onRowSelectionChange,
}: NodeListDataTableProps) => {
  const height = useGetClusterInfoTableHeight({ id, rowCount: data.length });

  return (
    <div id={id}>
      <SimpleTable
        rowKey={rowKey}
        enabledInfiniteScroll={true}
        // TODO: Revise this once we have a proper way to handle the total number of rows get from the API
        enabledFetchNextPage={!isFetching && data.length < pageInfo.total}
        data={data}
        columns={columns}
        fetchNextPage={fetchNextPage}
        sortSettings={listSettings.sortSettings}
        onSortChange={onSortChange}
        rowHeight={48}
        height={height}
        isLoading={isLoading}
        rowSelection={rowSelection}
        onRowSelectionChange={onRowSelectionChange}
        selectedRowClassName="bg-secondary-50"
        tableClassName="min-w-fit md:min-w-0 overflow-x-auto"
      />
    </div>
  );
};

export default NodeListDataTable;
