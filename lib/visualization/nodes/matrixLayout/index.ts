import { EntityNode } from '@/types/visualization';
import {
  RFVisualizationNode,
  VisualizationDimensionConfig,
  VisualizationLayoutTypes,
} from '@/types/visualization/react-flow';
import { getVisualizationClusterNodes } from './clusterNode';
import { getAbsoluteNodePosition } from '../../edges/position';
import { getRFVisualizationNodes } from '..';

export const DEFAULT_VISUALIZATION_MATRIX_DIMENSIONS: VisualizationDimensionConfig = {
  entityGap: 20,
  entityPadding: 30,
  entityPerRow: 20,
  layoutType: VisualizationLayoutTypes.matrix,
  container: {
    width: 200,
    height: 34,
  },
  group: {
    width: 200,
    height: 200,
  },
  placeholderGroup: {
    width: 300,
    height: 300,
  },
  coordinateDimensions: {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    whitespaceRect: undefined,
  },
  marker: {
    orient: '90',
  },
};

export const getVisualizationMatrixNodes = (
  nodes: EntityNode[],
  config: VisualizationDimensionConfig
): RFVisualizationNode[] => {
  const rfNodes = getVisualizationClusterNodes(nodes, config);
  const flatNodes = getRFVisualizationNodes(rfNodes);

  return getRFVisualizationNodes([getAbsoluteNodePosition(rfNodes[0], flatNodes)]);
};
