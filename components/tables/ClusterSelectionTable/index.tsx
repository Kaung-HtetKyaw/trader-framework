'use client';

import { getColumns } from './columns';
import usePaginator from '@/lib/hooks/usePaginator';
import { createPaginationState } from '@/lib/hooks/usePaginator';
import useListSettings from '@/lib/hooks/useListSettings';
import { ListViews } from '@/types/list';
import useQueryParams from '@/lib/hooks/useQueryParams';
import { ClusterKeyListParams } from '@/types/cluster/list';
import ClusterSelectionDataTable from './data-table';
import { useMemo } from 'react';
import { Cluster } from '@/types/cluster';

export type ClusterSelectionTableProps = {
  clusters: Cluster[];
  isLoading: boolean;
  selectedClusterIDs: string[];
  onToggleSelectCluster: (clusterID: string) => void;
  onToggleSelectAllClusters: () => void;
};

const ClusterSelectionTable = (props: ClusterSelectionTableProps) => {
  const { clusters, isLoading, selectedClusterIDs, onToggleSelectCluster, onToggleSelectAllClusters } = props;

  const { params } = useQueryParams<ClusterKeyListParams>();

  const { settings } = useListSettings(ListViews.ENTITY_WITH_NAME_LIST);

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

  const isAllSelected = useMemo(
    () => !!selectedClusterIDs.length && !!clusters?.length && selectedClusterIDs.length === clusters?.length,
    [selectedClusterIDs, clusters]
  );

  return (
    <div className="flex flex-col gap-3">
      <ClusterSelectionDataTable
        columns={getColumns({
          onToggle: onToggleSelectCluster,
          onToggleAll: onToggleSelectAllClusters,
          selectedClusterIDs,
          isAllSelected,
        })}
        data={clusters || []}
        isFetching={isLoading}
        listSettings={settings}
        pageInfo={pageInfo}
      />
    </div>
  );
};

export default ClusterSelectionTable;
