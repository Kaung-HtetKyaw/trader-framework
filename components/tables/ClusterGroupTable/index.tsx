'use client';

import { columns } from './columns';
import usePaginator from '@/lib/hooks/usePaginator';
import { createPaginationState } from '@/lib/hooks/usePaginator';
import useListSettings from '@/lib/hooks/useListSettings';
import { ListViews } from '@/types/list';
import useQueryParams from '@/lib/hooks/useQueryParams';
import { useMemo } from 'react';
import ClusterGroupDataTable from './data-table';
import { ClusterKeyListParams } from '@/types/cluster/list';
import { useEnrichedClusterGroups } from '@/lib/hooks/useEnrichedClusterGroups';
import { useGetClustersQuery } from '@/store/api/clusterApi';

const ClusterGroupTable = () => {
  const { params } = useQueryParams<ClusterKeyListParams>();

  const { settings } = useListSettings(ListViews.CLUSTER_GROUP_LIST);

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

  const { data: clusters, isLoading } = useGetClustersQuery({});
  const { clusterGroups, loading } = useEnrichedClusterGroups(clusters);

  const indexedData = useMemo(() => {
    return clusterGroups?.map((key, index) => ({ ...key, index: index + 1 })) || [];
  }, [clusterGroups]);

  return (
    <div className="flex flex-col gap-3">
      <ClusterGroupDataTable
        columns={columns}
        data={indexedData}
        isFetching={loading}
        listSettings={settings}
        pageInfo={pageInfo}
        fetchNextPage={() => {}}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ClusterGroupTable;
