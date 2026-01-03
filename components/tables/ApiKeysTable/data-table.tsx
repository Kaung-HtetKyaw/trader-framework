'use client';

import { ColumnDef } from '@tanstack/react-table';
import SimpleTable from '@/components/SimpleTable';
import { ClusterKeyWithIndex } from './columns';
import { ListSettings } from '@/types/list';
import { PagePaginationInfo } from '@/lib/hooks/usePaginator';

interface PodListDataTableProps {
  columns: ColumnDef<ClusterKeyWithIndex>[];
  data: ClusterKeyWithIndex[];
  isFetching: boolean;
  listSettings: ListSettings;
  pageInfo: PagePaginationInfo;
  fetchNextPage: () => void;
  isLoading?: boolean;
}

const ApiKeysDataTable = ({
  columns,
  data,
  isFetching,
  fetchNextPage,
  listSettings,
  pageInfo,
  isLoading,
}: PodListDataTableProps) => {
  return (
    <SimpleTable
      rowKey="value"
      enabledInfiniteScroll={true}
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

export default ApiKeysDataTable;
