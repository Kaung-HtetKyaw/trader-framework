'use client';

import { getColumns } from './columns';
import usePaginator from '@/lib/hooks/usePaginator';
import { createPaginationState } from '@/lib/hooks/usePaginator';
import useListSettings from '@/lib/hooks/useListSettings';
import { ListViews } from '@/types/list';
import { useMemo } from 'react';
import AzureDevOpsPATDataTable from './data-table';
import { PersonalAccessToken, Repository } from '@/types/gitOps';

export type AzureDevOpsPATTableProps = {
  personalAccessTokens: PersonalAccessToken[];
  repositories: Repository[];
  isLoading: boolean;
  isFetching: boolean;
};

const AzureDevOpsPATTable = (props: AzureDevOpsPATTableProps) => {
  const { personalAccessTokens, repositories, isLoading, isFetching } = props;

  const { settings } = useListSettings(ListViews.AZURE_DEVOPS_PATS_LIST);

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
    return personalAccessTokens?.map((accessCredential, index) => ({ ...accessCredential, index: index + 1 })) || [];
  }, [personalAccessTokens]);

  const repositoryIDs = useMemo(() => repositories.map(repository => repository.id), [repositories]);

  const columns = useMemo(() => getColumns(repositoryIDs), [repositoryIDs]);

  return (
    <>
      <div className="flex flex-col gap-3">
        <AzureDevOpsPATDataTable
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

export default AzureDevOpsPATTable;
