'use client';

import { columns } from './columns';
import usePaginator from '@/lib/hooks/usePaginator';
import { createPaginationState } from '@/lib/hooks/usePaginator';
import useListSettings from '@/lib/hooks/useListSettings';
import { ListViews } from '@/types/list';
import { useMemo } from 'react';
import GithubRepoDataTable from './data-table';
import { Repository } from '@/types/gitOps';

export type GithubRepoTableProps = {
  repositories: Repository[];
  isLoading: boolean;
  isFetching: boolean;
};

const GithubRepoTable = (props: GithubRepoTableProps) => {
  const { repositories, isLoading, isFetching } = props;

  const { settings } = useListSettings(ListViews.GITHUB_REPOS_LIST);

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
    return repositories?.map((githubRepo, index) => ({ ...githubRepo, index: index + 1 })) || [];
  }, [repositories]);

  return (
    <>
      <div className="flex flex-col gap-3">
        <GithubRepoDataTable
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

export default GithubRepoTable;
