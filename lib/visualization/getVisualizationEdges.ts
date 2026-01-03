import { type Edge } from '@xyflow/react';
import {
  RFVisualizationConnectableEntity,
  RFVisualizationEdge,
  RFVisualizationEdgeData,
  RFVisualizationEdgeTypes,
  RFVisualizationNodeData,
  VisualizationDimensionConfig,
} from '@/types/visualization/react-flow';
import { getVisualizationEdgeBaseStyleForContainer } from './nodeStyles';

export const getVisualizationEdges = (
  data: RFVisualizationConnectableEntity[],
  config: VisualizationDimensionConfig
): RFVisualizationEdge[] => {
  return data
    .map(entity => {
      return (entity?.connections || []).map(connection => {
        const edgeData: RFVisualizationEdgeData = {
          label: entity.name,
          sourceType: entity.type,
          targetType: connection.type,
        };

        return {
          id: getVisualizationEdgeId(entity.id, connection.id),
          source: entity.id,
          target: connection.id,
          type: RFVisualizationEdgeTypes.default,
          data: edgeData,
        };
      });
    })
    .flat()
    .map(el => ({
      ...el,
      ...getVisualizationEdgeBaseStyle(config),
    })) as RFVisualizationEdge[];
};

export const getVisualizationEdgeId = (source: string, target: string) => {
  return `${source}-${target}`;
};

export const getVisualizationClusterGroupId = (data: RFVisualizationNodeData) => {
  return `${data.label}-${data.type}`;
};

export const getVisualizationEdgeBaseStyle = (config: VisualizationDimensionConfig): Partial<Edge> => {
  return getVisualizationEdgeBaseStyleForContainer(config);
};
