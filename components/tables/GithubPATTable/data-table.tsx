'use client';

import { ColumnDef } from '@tanstack/react-table';
import SimpleTable from '@/components/SimpleTable';
import { GithubPATWithIndex } from './columns';
import { ListSettings } from '@/types/list';
import { PagePaginationInfo } from '@/lib/hooks/usePaginator';

interface GithubPATDataTableProps {
  columns: ColumnDef<GithubPATWithIndex>[];
  data: GithubPATWithIndex[];
  isFetching: boolean;
  listSettings: ListSettings;
  pageInfo: PagePaginationInfo;
  fetchNextPage: () => void;
  rowKey: keyof GithubPATWithIndex;
  isLoading?: boolean;
}

const PersonalAccessTokensDataTable = ({
  columns,
  data,
  isFetching,
  fetchNextPage,
  listSettings,
  pageInfo,
  rowKey,
  isLoading,
}: GithubPATDataTableProps) => {
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
      isLoading={isLoading}
      rowHeight={48}
      alignLastColumn
      tableClassName="min-w-fit md:min-w-0 overflow-x-auto"
    />
  );
};

export default PersonalAccessTokensDataTable;
