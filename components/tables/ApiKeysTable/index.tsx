'use client';

import { columns } from './columns';
import usePaginator from '@/lib/hooks/usePaginator';
import { createPaginationState } from '@/lib/hooks/usePaginator';
import useListSettings from '@/lib/hooks/useListSettings';
import { ListViews } from '@/types/list';
import useQueryParams from '@/lib/hooks/useQueryParams';
import { useMemo } from 'react';
import ApiKeysDataTable from './data-table';
import { ClusterKeyListParams } from '@/types/cluster/list';
import { useAbility } from '@/lib/authorization/casl/AbilityProvider';
import { useGetClusterKeysQuery } from '@/store/api/clusterApi';

const ApiKeysTable = () => {
  const ability = useAbility();
  const { params } = useQueryParams<ClusterKeyListParams>();

  const { settings } = useListSettings(ListViews.API_KEYS_LIST);

  const paginate = usePaginator();

  const paginationState = createPaginationState(settings.rowNumber, {
    page: parseInt(params.page as string) || 1,
    limit: settings.rowNumber,
  });

  const { pageInfo } = paginate({
    pageInfo: {
      total: 100,
      currentPage: parseInt(params.page as string) || 1,
      limit: settings.rowNumber,
    },
    paginationState,
    queryParams: {
      page: parseInt(params.page as string) || 1,
      search: params.search || '',
    },
    shouldResetPageOnSearch: true,
  });

  const {
    data: clusterKeys,
    isFetching,
    isLoading,
  } = useGetClusterKeysQuery(undefined, {
    skip: !ability.can('list', 'cluster_tokens'),
  });

  const indexedData = useMemo(() => {
    return clusterKeys?.map((key, index) => ({ ...key, index: index + 1 })) || [];
  }, [clusterKeys]);

  return (
    <>
      <div className="flex flex-col gap-3">
        <ApiKeysDataTable
          columns={columns}
          data={indexedData}
          isFetching={isFetching}
          listSettings={settings}
          pageInfo={pageInfo}
          fetchNextPage={() => {}}
          isLoading={isLoading}
        />
      </div>
    </>
  );
};

export default ApiKeysTable;
