'use client';

import { getColumns } from './columns';
import { useParams } from 'next/navigation';
import usePaginator from '@/lib/hooks/usePaginator';
import { createPaginationState } from '@/lib/hooks/usePaginator';
import useListSettings from '@/lib/hooks/useListSettings';
import { ListViews } from '@/types/list';
import { PodListParams } from '@/types/pod/list';
import useQueryParams from '@/lib/hooks/useQueryParams';
import { SortingState } from '@tanstack/react-table';
import { useMemo, useCallback } from 'react';
import { getSortedData } from '@/lib/utils/list';
import NodeListFilterBar from './NodeListFilterBar';
import NodeListDataTable from './data-table';
import { useGetNodesQuery } from '@/store/api/clusterApi';
import { isRowSelected, getSelectedObjectsCount, toggleSelection } from '@/signals/tables/selection';
import { useSignals } from '@preact/signals-react/runtime';
import config from '@/lib/config';
import { CustomToast } from '@/components/CustomToast';
import { K8sObjectTypes } from '@/types/visualization/k8sObjects';
import useGetK8sObjectWithSelectionSync from '@/lib/hooks/useGetK8sObjectWithSelectionSync';

const NodeTable = () => {
  useSignals();
  const { id: clusterId } = useParams<{ id: string }>();

  const { params, changeParam } = useQueryParams<PodListParams>({
    listKeys: [],
  });

  const { settings, updateListSettings } = useListSettings(ListViews.NODE_LIST);

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

  const { data, isFetching, isLoading } = useGetNodesQuery(
    { clusterID: clusterId as string },
    {
      skip: !clusterId,
    }
  );

  const {
    result: { isFetching: isFetchingAllNodesData, isLoading: isLoadingAllNodesData },
    selection: rowSelection,
  } = useGetK8sObjectWithSelectionSync({
    objectQueryOptions: {
      type: K8sObjectTypes.Node,
      variables: { clusterID: clusterId as string },
    },
    transformData: data =>
      data.map(item => ({
        id: item.id,
        name: item.name,
        kind: K8sObjectTypes.Container,
        namespace: undefined,
        podID: undefined,
      })),
  });

  const onSortChange = (sortSettings: SortingState) => {
    updateListSettings('sortSettings', sortSettings);
  };

  const onSearchChange = (value: string) => {
    changeParam('search', value);
  };

  // * sorting here until we have a proper way to handle the sorting from the API
  // TODO: remove this when api provides sorting functionality
  const sortedData = useMemo(() => {
    return getSortedData(data?.map(item => ({ ...item })) || [], settings.sortSettings);
  }, [data, settings.sortSettings]);

  const filteredDataBySearch = useMemo(() => {
    if (!params.search) return sortedData;
    return sortedData?.filter(item => item.name.toLowerCase().includes(params.search?.toLowerCase() || '')) || [];
  }, [sortedData, params.search]);

  const indexedData = useMemo(() => {
    return filteredDataBySearch.map((node, index) => ({ ...node, index: index + 1 }));
  }, [filteredDataBySearch]);

  const isRowDisabled = useCallback((id: string) => {
    return getSelectedObjectsCount() >= config.NEXT_PUBLIC_OBJECT_SELECTION_LIMIT && !isRowSelected(id);
  }, []);

  const onToggleSelection = useCallback(
    (id: string) => {
      if (isRowDisabled(id)) {
        CustomToast({
          type: 'error',
          message: `You can only select ${config.NEXT_PUBLIC_OBJECT_SELECTION_LIMIT} objects at a time`,
        });
        return;
      }

      toggleSelection(id);
    },
    [isRowDisabled]
  );

  const columns = useMemo(() => getColumns({ onToggleSelection, isRowDisabled }), [isRowDisabled, onToggleSelection]);

  return (
    <div className="w-full flex flex-col gap-3">
      <NodeListFilterBar params={params} onSearchChange={onSearchChange} />
      <NodeListDataTable
        columns={columns}
        data={indexedData}
        isFetching={isFetchingAllNodesData || isFetching}
        listSettings={settings}
        pageInfo={pageInfo}
        fetchNextPage={() => {}}
        onSortChange={onSortChange}
        rowKey="id"
        isLoading={isLoading || isLoadingAllNodesData}
        rowSelection={rowSelection}
      />
    </div>
  );
};

export default NodeTable;
