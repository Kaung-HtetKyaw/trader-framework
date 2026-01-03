'use client';

import { ColumnDef } from '@tanstack/react-table';
import SimpleTable from '@/components/SimpleTable';
import { SortingState } from '@tanstack/react-table';
import { ClusterWithIndex } from './columns';
import { ListSettings } from '@/types/list';
import { PagePaginationInfo } from '@/lib/hooks/usePaginator';
import { useCallback } from 'react';

interface ClusterListDataTableProps {
  columns: ColumnDef<ClusterWithIndex>[];
  data: ClusterWithIndex[];
  isFetching: boolean;
  listSettings: ListSettings;
  pageInfo: PagePaginationInfo;
  fetchNextPage: () => void;
  onSortChange: (sortSettings: SortingState) => void;
  onRowClick?: (id: string) => void;
}

const ClusterListDataTable = ({
  columns,
  data,
  isFetching,
  fetchNextPage,
  onSortChange,
  listSettings,
  pageInfo,
  onRowClick,
}: ClusterListDataTableProps) => {
  const handleRowClick = useCallback(
    (row: ClusterWithIndex) => {
      if (onRowClick) {
        onRowClick(row.id);
      }
    },
    [onRowClick]
  );

  return (
    <SimpleTable
      rowKey="id"
      enabledInfiniteScroll={true}
      // TODO: Revise this once we have a proper way to handle the total number of rows get from the API
      enabledFetchNextPage={!isFetching && data.length < pageInfo.total}
      data={data}
      columns={columns}
      fetchNextPage={fetchNextPage}
      sortSettings={listSettings.sortSettings}
      onSortChange={onSortChange}
      onRowClick={handleRowClick}
      alignLastColumn
      tableClassName="min-w-fit lg:min-w-0"
      rowClassName="h-[60px]"
      rowHeight={60}
    />
  );
};

export default ClusterListDataTable;
