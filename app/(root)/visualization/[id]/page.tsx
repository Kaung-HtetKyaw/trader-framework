'use client';
import { useParams } from 'next/navigation';
import { useRefresh } from '@/context/VisualizationRefreshContext';
import ClusterVisualizationDiagram, {
  ClusterVisualizationDiagramTypes,
} from '@/components/visualization/ClusterVisualizationDiagram';
import { useEffect } from 'react';
import { resetSelectedNodes } from '@/signals/visualiation/misc';
import { resetNodesSignal } from '@/signals/visualiation/nodes';
import VisualizationPageContainer from '@/components/VisualizationPageContainer';

const VisualizationPage = () => {
  const { id } = useParams();
  const { refreshKey } = useRefresh();

  useEffect(() => {
    return () => {
      resetSelectedNodes();
      resetNodesSignal();
    };
  }, []);

  if (!id) {
    return null;
  }

  return (
    <VisualizationPageContainer visualizationClassName="py-4">
      <ClusterVisualizationDiagram
        id={id as string}
        type={ClusterVisualizationDiagramTypes.reactflow}
        refreshKey={refreshKey}
      />
    </VisualizationPageContainer>
  );
};

export default VisualizationPage;
