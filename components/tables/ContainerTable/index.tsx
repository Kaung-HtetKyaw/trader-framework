'use client';

import { getColumns } from './columns';
import { useParams } from 'next/navigation';
import usePaginator from '@/lib/hooks/usePaginator';
import { createPaginationState } from '@/lib/hooks/usePaginator';
import useListSettings from '@/lib/hooks/useListSettings';
import { ListViews } from '@/types/list';
import useQueryParams from '@/lib/hooks/useQueryParams';
import { SortingState } from '@tanstack/react-table';
import { useMemo, useCallback } from 'react';
import { getSortedData } from '@/lib/utils/list';
import ContainerListFilterBar from './ContainerListFilterBar';
import ContainerListDataTable from './data-table';
import { ContainerListParams } from '@/types/container/list';
import { useGetContainersQuery, useGetNamespacesQuery, useGetPodsQuery } from '@/store/api/clusterApi';
import { getSelectedObjectsCount, isRowSelected, toggleSelection } from '@/signals/tables/selection';
import { useSignals } from '@preact/signals-react/runtime';
import config from '@/lib/config';
import { CustomToast } from '@/components/CustomToast';
import { K8sObjectTypes } from '@/types/visualization/k8sObjects';
import useGetK8sObjectWithSelectionSync from '@/lib/hooks/useGetK8sObjectWithSelectionSync';

const ContainerTable = () => {
  useSignals();
  const { id: clusterId } = useParams<{ id: string }>();

  const { params, changeParam, resetParams } = useQueryParams<ContainerListParams>({
    listKeys: ['namespace', 'pod'],
  });

  const { settings, updateListSettings } = useListSettings(ListViews.CONTAINER_LIST);

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

  const { data: namespaces, isFetching: isFetchingNamespaces } = useGetNamespacesQuery(
    { clusterID: clusterId as string },
    {
      skip: !clusterId,
    }
  );

  const { data: pods, isFetching: isFetchingPods } = useGetPodsQuery(
    { clusterID: clusterId as string, namespaces: [] },
    {
      skip: !clusterId,
    }
  );

  const {
    result: { data: allContainersData, isFetching: isFetchingAllContainersData, isLoading: isLoadingAllContainersData },
    selection: rowSelection,
  } = useGetK8sObjectWithSelectionSync({
    objectQueryOptions: {
      type: K8sObjectTypes.Container,
      variables: { clusterID: clusterId as string, namespaces: [], podIDs: [] },
    },
    transformData: data =>
      data.map(item => ({
        id: item.id,
        name: item.name,
        kind: K8sObjectTypes.Container,
        namespace: item.namespace,
        podID: item.podID,
      })),
  });

  const {
    data: containers,
    isFetching: isFetchingContainers,
    isLoading: isLoadingContainers,
  } = useGetContainersQuery(
    { clusterID: clusterId as string, namespaces: params.namespace || [], podIDs: params.pod || [] },
    {
      skip: !clusterId,
    }
  );

  const namespaceOptions = useMemo(() => {
    return namespaces?.map(item => ({ label: item.name, value: item.name })) || [];
  }, [namespaces]);

  const podOptions = useMemo(() => {
    return pods?.map(item => ({ label: item.name, value: item.id })) || [];
  }, [pods]);

  const onSortChange = (sortSettings: SortingState) => {
    updateListSettings('sortSettings', sortSettings);
  };

  const onSearchChange = (value: string) => {
    changeParam('search', value);
  };

  // * sorting here until we have a proper way to handle the sorting from the API
  // TODO: remove this when api provides sorting functionality
  const sortedData = useMemo(() => {
    return getSortedData(containers?.map(item => ({ ...item })) || [], settings.sortSettings);
  }, [containers, settings.sortSettings]);

  const filteredDataBySearch = useMemo(() => {
    if (!params.search) return sortedData;

    return sortedData?.filter(item => item.name.toLowerCase().includes(params.search?.toLowerCase() || '')) || [];
  }, [sortedData, params.search]);

  const indexedData = useMemo(() => {
    const result = filteredDataBySearch.map((container, index) => ({
      ...container,
      index: index + 1,
      // Containers don't have an id field from API, create a unique one using podID + name
      id: container.id,
    }));

    return result;
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

  const columns = useMemo(() => getColumns({ onToggleSelection, isRowDisabled }), [onToggleSelection, isRowDisabled]);

  return (
    <div className="w-full flex flex-col gap-3">
      <ContainerListFilterBar
        initialData={allContainersData || []}
        resetParams={resetParams}
        namespaceOptions={namespaceOptions}
        podOptions={podOptions}
        params={params}
        changeParam={changeParam}
        onSearchChange={onSearchChange}
        isFetching={isFetchingNamespaces || isFetchingPods || isFetchingContainers || isFetchingAllContainersData}
      />
      <ContainerListDataTable
        columns={columns}
        data={indexedData}
        isFetching={isFetchingNamespaces || isFetchingPods || isFetchingContainers || isFetchingAllContainersData}
        listSettings={settings}
        pageInfo={pageInfo}
        fetchNextPage={() => {}}
        onSortChange={onSortChange}
        rowKey="id"
        isLoading={isLoadingContainers || isLoadingAllContainersData}
        rowSelection={rowSelection}
      />
    </div>
  );
};

export default ContainerTable;
