import RFClusterVisualizationDiagram from './reactflow';
import { useMemo } from 'react';

export type ClusterVisualizationDiagramProps = {
  id: string;
  type: ClusterVisualizationDiagramTypeEnum;
  refreshKey?: number;
};

export const ClusterVisualizationDiagramTypes = {
  reactflow: 'reactflow',
  // D3 or any other libs
} as const;
export type ClusterVisualizationDiagramTypeEnum = keyof typeof ClusterVisualizationDiagramTypes;

const ClusterVisualizationDiagram = ({ type, id, refreshKey }: ClusterVisualizationDiagramProps) => {
  const visualizationDiagram = useMemo(() => {
    switch (type) {
      case ClusterVisualizationDiagramTypes.reactflow:
        return <RFClusterVisualizationDiagram id={id} refreshKey={refreshKey} />;
      default:
        return null;
    }
  }, [type, id, refreshKey]);

  return visualizationDiagram;
};

export default ClusterVisualizationDiagram;
