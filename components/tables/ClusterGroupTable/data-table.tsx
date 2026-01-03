'use client';

import { ColumnDef } from '@tanstack/react-table';
import SimpleTable from '@/components/SimpleTable';
import { ClusterGroupWithIndex } from './columns';
import { ListSettings } from '@/types/list';
import { PagePaginationInfo } from '@/lib/hooks/usePaginator';

interface ClusterGroupDataTableProps {
  columns: ColumnDef<ClusterGroupWithIndex>[];
  data: ClusterGroupWithIndex[];
  isFetching: boolean;
  listSettings: ListSettings;
  pageInfo: PagePaginationInfo;
  fetchNextPage: () => void;
  isLoading?: boolean;
}

const ClusterGroupDataTable = ({
  columns,
  data,
  isFetching,
  fetchNextPage,
  listSettings,
  pageInfo,
  isLoading,
}: ClusterGroupDataTableProps) => {
  return (
    <SimpleTable
      compact
      rowKey="id"
      enabledInfiniteScroll={false}
      // TODO: Revise this once we have a proper way to handle the total number of rows get from the API
      enabledFetchNextPage={!isFetching && data.length < pageInfo.total}
      data={data}
      columns={columns}
      fetchNextPage={fetchNextPage}
      sortSettings={listSettings.sortSettings}
      rowHeight={48}
      isLoading={isLoading}
      tableClassName="min-w-fit md:min-w-0 overflow-x-auto"
      alignLastColumn
    />
  );
};

export default ClusterGroupDataTable;
