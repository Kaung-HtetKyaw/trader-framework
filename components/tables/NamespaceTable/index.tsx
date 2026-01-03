'use client';

import NamespaceListDataTable from './data-table';
import { getColumns, NamespaceWithIndex } from './columns';
import { useParams, useRouter } from 'next/navigation';
import usePaginator from '@/lib/hooks/usePaginator';
import { createPaginationState } from '@/lib/hooks/usePaginator';
import useListSettings from '@/lib/hooks/useListSettings';
import { ListViews } from '@/types/list';
import { NamespaceListFilterParams, NamespaceListParams } from '@/types/namespace/list';
import useQueryParams from '@/lib/hooks/useQueryParams';
import { SortingState } from '@tanstack/react-table';
import { useMemo, useCallback } from 'react';
import { getSortedData, getUniqueValues } from '@/lib/utils/list';
import NamespaceListFilterBar from './NamespaceListFilterBar';
import { getClusterPodsPath } from '@/app/(root)/clusters/urls';
import { useGetNamespacesQuery } from '@/store/api/clusterApi';
import { isRowSelected, getSelectedObjectsCount, toggleSelection } from '@/signals/tables/selection';
import { useSignals } from '@preact/signals-react/runtime';
import config from '@/lib/config';
import { CustomToast } from '@/components/CustomToast';
import { K8sObjectTypes } from '@/types/visualization/k8sObjects';
import useGetK8sObjectWithSelectionSync from '@/lib/hooks/useGetK8sObjectWithSelectionSync';

const ClusterNamespaceTable = () => {
  useSignals();
  const { id: clusterId } = useParams<{ id: string }>();
  const router = useRouter();

  const { params, changeParam, resetParams } = useQueryParams<NamespaceListParams>({
    listKeys: ['label'],
  });

  const { settings, updateListSettings } = useListSettings(ListViews.NAMESPACE_LIST);

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

  const { data, isFetching, isLoading } = useGetNamespacesQuery(
    { clusterID: clusterId as string },
    {
      skip: !clusterId,
    }
  );

  const {
    result: { data: allNamespacesData, isFetching: isFetchingAllNamespacesData, isLoading: isLoadingAllNamespacesData },
    selection: rowSelection,
  } = useGetK8sObjectWithSelectionSync({
    objectQueryOptions: { type: K8sObjectTypes.Namespace, variables: { clusterID: clusterId as string } },
    transformData: data =>
      data.map(item => ({
        id: item.id,
        name: item.name,
        kind: K8sObjectTypes.Namespace,
        namespace: undefined,
      })),
  });

  const onSortChange = (sortSettings: SortingState) => {
    updateListSettings('sortSettings', sortSettings);
  };

  const labelOptions = useMemo(() => {
    if (!data) return [];

    const items = data
      .map(item => item.labels)
      .flat()
      .map(label => label.value);

    return getUniqueValues(items).map(label => ({
      label,
      value: label,
    }));
  }, [data]);

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

  const filteredData = useMemo(() => {
    if (!params.label || !params.label.length) return filteredDataBySearch;

    return filteredDataBySearch.filter(item => item.labels.some(label => params.label?.includes(label.value)));
  }, [filteredDataBySearch, params.label]);

  const indexedData = useMemo(() => {
    return filteredData.map((namespace, index) => ({ ...namespace, index: index + 1 }));
  }, [filteredData]);

  const onRowClick = (row: NamespaceWithIndex) => {
    router.push(getClusterPodsPath(clusterId as string, row.name));
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

  const columns = useMemo(() => getColumns({ onToggleSelection, isRowDisabled }), [onToggleSelection, isRowDisabled]);

  return (
    <div className="w-full flex flex-col gap-3">
      <NamespaceListFilterBar
        initialData={allNamespacesData || []}
        labelOptions={labelOptions}
        params={params as NamespaceListFilterParams}
        changeParam={changeParam}
        resetParams={resetParams}
        onSearchChange={onSearchChange}
      />
      <NamespaceListDataTable
        columns={columns}
        data={indexedData}
        isFetching={isFetchingAllNamespacesData || isFetching}
        listSettings={settings}
        pageInfo={pageInfo}
        fetchNextPage={() => {}}
        onSortChange={onSortChange}
        onRowClick={onRowClick}
        rowKey="name"
        isLoading={isLoading || isLoadingAllNamespacesData}
        rowSelection={rowSelection}
      />
    </div>
  );
};

export default ClusterNamespaceTable;
