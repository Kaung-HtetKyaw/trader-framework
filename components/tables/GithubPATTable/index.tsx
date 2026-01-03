'use client';

import { getColumns } from './columns';
import usePaginator from '@/lib/hooks/usePaginator';
import { createPaginationState } from '@/lib/hooks/usePaginator';
import useListSettings from '@/lib/hooks/useListSettings';
import { ListViews } from '@/types/list';
import { useMemo } from 'react';
import GithubPATDataTable from './data-table';
import { PersonalAccessToken, Repository } from '@/types/gitOps';

export type GithubPATTableProps = {
  personalAccessTokens: PersonalAccessToken[];
  repositories: Repository[];
  isLoading: boolean;
  isFetching: boolean;
};

const GithubPATTable = (props: GithubPATTableProps) => {
  const { personalAccessTokens, repositories, isLoading, isFetching } = props;

  const { settings } = useListSettings(ListViews.PERSONAL_ACCESS_TOKENS_LIST);

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

  const repositoryIDs = useMemo(() => repositories.map(repository => repository.id), [repositories]);

  const columns = useMemo(() => getColumns(repositoryIDs), [repositoryIDs]);

  const indexedData = useMemo(() => {
    return personalAccessTokens?.map((accessCredential, index) => ({ ...accessCredential, index: index + 1 })) || [];
  }, [personalAccessTokens]);

  return (
    <GithubPATDataTable
      columns={columns}
      data={indexedData}
      isFetching={isFetching}
      listSettings={settings}
      pageInfo={pageInfo}
      fetchNextPage={() => {}}
      rowKey="index"
      isLoading={isLoading}
    />
  );
};

export default GithubPATTable;
