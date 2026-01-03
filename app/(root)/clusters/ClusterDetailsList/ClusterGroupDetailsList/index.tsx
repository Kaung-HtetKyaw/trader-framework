'use client';

import { columns } from './columns';
import ClusterGroupDetailsDataTable from './data-table';
import { useCallback, useMemo } from 'react';
import usePaginator from '@/lib/hooks/usePaginator';
import { createPaginationState } from '@/lib/hooks/usePaginator';
import { getSortedData } from '@/lib/utils/list';
import { SortingState } from '@tanstack/react-table';
import useListSettings from '@/lib/hooks/useListSettings';
import { ListViews } from '@/types/list';
import useQueryParams from '@/lib/hooks/useQueryParams';
import { Cluster } from '@/types/cluster';
import { useRouter } from 'next/navigation';
import ClusterListFilterBar from '../ClusterListFilterBar';
import { ClusterListFilterParams, ClusterListParams } from '@/types/cluster/list';
import { countBy, isEmpty } from 'lodash/fp';

interface ClusterGroupDetailsListProps {
  clusters: Cluster[];
  isFetching: boolean;
  fetchNextPage: () => void;
}

const ClusterGroupDetailsList = (props: ClusterGroupDetailsListProps) => {
  const { clusters, isFetching, fetchNextPage } = props;
  const { params, changeParam, resetParams } = useQueryParams<ClusterListParams>({
    listKeys: ['group', 'status'],
  });
  const router = useRouter();
  const { settings, updateListSettings } = useListSettings(ListViews.CLUSTER_LIST);

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

  const tagOptions = useMemo(() => {
    return Object.entries(countBy('group', clusters)).map(([group, count]) => ({
      value: group,
      label: group.toLowerCase(),
      count,
    }));
  }, [clusters]);

  const statusOptions = useMemo(() => {
    return Object.entries(countBy('stats.status', clusters)).map(([status, count]) => ({
      value: status,
      label: status.toLowerCase().split('_').join(' '),
      count,
    }));
  }, [clusters]);

  // * sorting here until we have a proper way to handle the sorting from the API
  // TODO: remove this when api provides sorting functionality
  const sortedData = useMemo(() => {
    return getSortedData(clusters.map(item => ({ ...item })) || [], settings.sortSettings);
  }, [clusters, settings.sortSettings]);

  const onSortChange = (sortSettings: SortingState) => {
    updateListSettings('sortSettings', sortSettings);
  };

  // TODO: remove this when we have a proper way to handle the filtering from the API
  const filteredData = useMemo(() => {
    if (isEmpty(params)) {
      return sortedData.map((item, index) => ({ ...item, index: index + 1 }));
    }

    return sortedData
      ?.filter(item => {
        const tagMatch = !!params?.group?.length ? params?.group?.includes(item.group || '') : true;
        const statusMatch = !!params?.status?.length ? params?.status?.includes(item?.stats?.status || '') : true;

        return tagMatch && statusMatch;
      })
      .map((item, index) => ({ ...item, index: index + 1 }));
  }, [sortedData, params]);

  const onRowClick = useCallback(
    (clusterId: string) => {
      router.push(`/clusters/${clusterId}`);
    },
    [router]
  );

  if (!filteredData) return null;

  return (
    <div>
      <ClusterListFilterBar
        initialClusters={clusters}
        tagOptions={tagOptions}
        statusOptions={statusOptions}
        params={params as ClusterListFilterParams}
        changeParam={changeParam}
        resetParams={resetParams}
      />
      <div className="pb-3 px-4">
        <ClusterGroupDetailsDataTable
          isFetching={isFetching}
          fetchNextPage={() => fetchNextPage()}
          columns={columns}
          data={filteredData}
          onSortChange={onSortChange}
          listSettings={settings}
          pageInfo={pageInfo}
          onRowClick={onRowClick}
        />
      </div>
    </div>
  );
};

export default ClusterGroupDetailsList;
