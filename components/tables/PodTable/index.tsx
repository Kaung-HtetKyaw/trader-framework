'use client';

import { getColumns, PodWithIndex } from './columns';
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
import PodListFilterBar from './PodListFilterBar';
import PodListDataTable from './data-table';
import { useRouter } from 'next/navigation';
import { getClusterContainersPath } from '@/app/(root)/clusters/urls';
import { useGetNamespacesQuery, useGetPodsQuery } from '@/store/api/clusterApi';
import { isRowSelected, getSelectedObjectsCount, toggleSelection } from '@/signals/tables/selection';
import { useSignals } from '@preact/signals-react/runtime';
import config from '@/lib/config';
import { CustomToast } from '@/components/CustomToast';
import { K8sObjectTypes } from '@/types/visualization/k8sObjects';
import useGetK8sObjectWithSelectionSync from '@/lib/hooks/useGetK8sObjectWithSelectionSync';

const PodTable = () => {
  useSignals();
  const { id: clusterId } = useParams<{ id: string }>();
  const router = useRouter();

  const { params, changeParam, resetParams } = useQueryParams<PodListParams>({
    listKeys: ['namespace'],
  });

  const { settings, updateListSettings } = useListSettings(ListViews.POD_LIST);

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

  const { data: namespaces } = useGetNamespacesQuery(
    {
      clusterID: clusterId as string,
    },
    {
      skip: !clusterId,
    }
  );

  const {
    result: { data: allPodsData, isFetching: isFetchingAllPodsData, isLoading: isLoadingAllPodsData },
    selection: rowSelection,
  } = useGetK8sObjectWithSelectionSync({
    objectQueryOptions: { type: K8sObjectTypes.Pod, variables: { clusterID: clusterId as string, namespaces: [] } },
    transformData: data =>
      data.map(item => ({
        id: item.id,
        name: item.name,
        kind: K8sObjectTypes.Pod,
        namespace: item.namespace,
      })),
  });

  const {
    data: pods,
    isFetching,
    isLoading,
  } = useGetPodsQuery(
    { clusterID: clusterId as string, namespaces: params.namespace || [] },
    {
      skip: !clusterId,
    }
  );

  const namespaceOptions = useMemo(() => {
    return namespaces?.map(item => ({ label: item.name, value: item.name })) || [];
  }, [namespaces]);

  const onSortChange = (sortSettings: SortingState) => {
    updateListSettings('sortSettings', sortSettings);
  };

  const onSearchChange = (value: string) => {
    changeParam('search', value);
  };

  // * sorting here until we have a proper way to handle the sorting from the API
  // TODO: remove this when api provides sorting functionality
  const sortedData = useMemo(() => {
    return getSortedData(pods?.map(item => ({ ...item })) || [], settings.sortSettings);
  }, [pods, settings.sortSettings]);

  const filteredDataBySearch = useMemo(() => {
    if (!params.search) return sortedData;
    return sortedData?.filter(item => item.name.toLowerCase().includes(params.search?.toLowerCase() || '')) || [];
  }, [sortedData, params.search]);

  const indexedData = useMemo(() => {
    return filteredDataBySearch.map((namespace, index) => ({ ...namespace, index: index + 1 }));
  }, [filteredDataBySearch]);

  const onRowClick = (row: PodWithIndex) => {
    router.push(getClusterContainersPath(clusterId as string, params.namespace as string[], row.id));
  };

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

  const columns = useMemo(() => getColumns({ isRowDisabled, onToggleSelection }), [isRowDisabled, onToggleSelection]);

  return (
    <div className="w-full flex flex-col gap-3">
      <PodListFilterBar
        initialData={allPodsData || []}
        namespaceOptions={namespaceOptions}
        params={params}
        changeParam={changeParam}
        onSearchChange={onSearchChange}
        resetParams={resetParams}
      />
      <PodListDataTable
        columns={columns}
        data={indexedData}
        isFetching={isFetchingAllPodsData || isFetching}
        listSettings={settings}
        pageInfo={pageInfo}
        fetchNextPage={() => {}}
        onSortChange={onSortChange}
        onRowClick={onRowClick}
        rowKey="id"
        isLoading={isLoading || isLoadingAllPodsData}
        rowSelection={rowSelection}
      />
    </div>
  );
};

export default PodTable;
