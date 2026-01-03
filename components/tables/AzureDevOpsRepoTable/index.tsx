'use client';

import { columns } from './columns';
import usePaginator from '@/lib/hooks/usePaginator';
import { createPaginationState } from '@/lib/hooks/usePaginator';
import useListSettings from '@/lib/hooks/useListSettings';
import { ListViews } from '@/types/list';
import { useMemo } from 'react';
import AzureDevOpsRepoDataTable from './data-table';
import { Repository } from '@/types/gitOps';

export type AzureDevOpsRepoTableProps = {
  repositories: Repository[];
  isLoading: boolean;
  isFetching: boolean;
};

const AzureDevOpsRepoTable = (props: AzureDevOpsRepoTableProps) => {
  const { repositories, isLoading, isFetching } = props;

  const { settings } = useListSettings(ListViews.AZURE_DEVOPS_REPOS_LIST);

  const paginate = usePaginator();

  const paginationState = createPaginationState(settings.rowNumber, {
    page: 1,
    limit: settings.rowNumber,
  });

  const { pageInfo } = paginate({
    pageInfo: {
      total: 100,
      currentPage: 1,
      limit: settings.rowNumber,
    },
    paginationState,
    queryParams: {
      page: 1,
      search: '',
    },
    shouldResetPageOnSearch: true,
  });

  const indexedData = useMemo(() => {
    return repositories?.map((repo, index) => ({ ...repo, index: index + 1 })) || [];
  }, [repositories]);

  return (
    <>
      <div className="flex flex-col gap-3">
        <AzureDevOpsRepoDataTable
          columns={columns}
          data={indexedData}
          isFetching={isFetching}
          listSettings={settings}
          pageInfo={pageInfo}
          fetchNextPage={() => {}}
          rowKey="index"
          isLoading={isLoading}
        />
      </div>
    </>
  );
};

export default AzureDevOpsRepoTable;
