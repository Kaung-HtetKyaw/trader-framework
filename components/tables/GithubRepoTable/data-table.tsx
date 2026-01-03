'use client';

import { ColumnDef } from '@tanstack/react-table';
import SimpleTable from '@/components/SimpleTable';
import { GithubRepoWithIndex } from './columns';
import { ListSettings } from '@/types/list';
import { PagePaginationInfo } from '@/lib/hooks/usePaginator';

interface GithubRepoDataTableProps {
  columns: ColumnDef<GithubRepoWithIndex>[];
  data: GithubRepoWithIndex[];
  isFetching: boolean;
  listSettings: ListSettings;
  pageInfo: PagePaginationInfo;
  fetchNextPage: () => void;
  rowKey: keyof GithubRepoWithIndex;
  isLoading?: boolean;
}

const GithubRepoDataTable = ({
  columns,
  data,
  isFetching,
  fetchNextPage,
  listSettings,
  pageInfo,
  rowKey,
  isLoading,
}: GithubRepoDataTableProps) => {
  return (
    <SimpleTable
      rowKey={rowKey}
      enabledInfiniteScroll={true}
      // TODO: Revise this once we have a proper way to handle the total number of rows get from the API
      enabledFetchNextPage={!isFetching && data.length < pageInfo.total}
      data={data}
      columns={columns}
      fetchNextPage={fetchNextPage}
      sortSettings={listSettings.sortSettings}
      rowHeight={48}
      isLoading={isLoading}
      alignLastColumn
      tableClassName="min-w-fit md:min-w-0 overflow-x-auto"
      rowClassName="h-[48px] md:h-[60px] xl:h-[72px]"
    />
  );
};

export default GithubRepoDataTable;
