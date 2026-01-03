'use client';

import { ColumnDef } from '@tanstack/react-table';
import SimpleTable from '@/components/SimpleTable';
import { ListSettings } from '@/types/list';
import { PagePaginationInfo } from '@/lib/hooks/usePaginator';
import { Cluster } from '@/types/cluster';

interface PodListDataTableProps {
  columns: ColumnDef<Cluster>[];
  data: Cluster[];
  isFetching: boolean;
  listSettings: ListSettings;
  pageInfo: PagePaginationInfo;
}

const ClusterSelectionDataTable = ({ columns, data, isFetching, listSettings, pageInfo }: PodListDataTableProps) => {
  return (
    <SimpleTable
      compact
      rowKey="id"
      height={data.length ? 330 : undefined}
      enabledInfiniteScroll={true}
      // TODO: Revise this once we have a proper way to handle the total number of rows get from the API
      enabledFetchNextPage={!isFetching && data.length < pageInfo.total}
      data={data}
      columns={columns}
      fetchNextPage={() => {}}
      sortSettings={listSettings.sortSettings}
      rowHeight={48}
    />
  );
};

export default ClusterSelectionDataTable;
