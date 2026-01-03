'use client';

import ViewportContainer from '@/components/ViewportContainer';
import NoVisualizationConnected from './NoVisualizationConnected';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import useQueryParams from '@/lib/hooks/useQueryParams';
import { VisualizationListFilterParams } from '@/types/visualization/list';
import { useMemo } from 'react';
import usePersistSelectedCluster from '@/lib/hooks/usePersistSelectedCluster';
import VisualizationPageContainer from '@/components/VisualizationPageContainer';

const DefaultVisualizationPage = () => {
  usePersistSelectedCluster({
    autoLoadSelectedCluster: true,
  });
  const allClusters = useSelector((state: RootState) => state.cluster.allClusters);
  const hasClusters = useMemo(() => allClusters && allClusters.length > 0, [allClusters]);

  const { params } = useQueryParams<VisualizationListFilterParams>({
    listKeys: ['group', 'cluster'],
  });

  const selectedGroupId = Array.isArray(params.group) ? params.group[0] : params.group;
  const selectedClusterId = Array.isArray(params.cluster) ? params.cluster[0] : params.cluster;
  const showNoVisualization = !hasClusters || !selectedGroupId || (selectedGroupId && !selectedClusterId);

  return (
    <VisualizationPageContainer visualizationClassName="py-4 pr-4">
      <ViewportContainer
        className="w-full py-4  flex justify-center items-center relative bg-gray-50 rounded-[12px]"
        offset={12}
      >
        <div className="flex-1 py-4 flex items-center justify-center h-full">
          {showNoVisualization && <NoVisualizationConnected hasClusters={hasClusters} />}
        </div>
      </ViewportContainer>
    </VisualizationPageContainer>
  );
};

export default DefaultVisualizationPage;
