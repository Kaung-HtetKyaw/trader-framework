import { EntityNode } from '@/types/visualization';
import {
  RFVisualizationNode,
  VisualizationLayoutTypeEnum,
  VisualizationLayoutTypes,
} from '@/types/visualization/react-flow';
import { DEFAULT_VISUALIZATION_MATRIX_DIMENSIONS, getVisualizationMatrixNodes } from './matrixLayout';
import { DEFAULT_VISUALIZATION_HIERARCHY_DIMENSIONS, getVisualizationHierarchyNodes } from './hierarchyLayout';
import config from '@/lib/config';
import { omit } from 'lodash/fp';

type GetVisualizationObjectNodes = (args: {
  nodes: EntityNode[];
  layoutType: VisualizationLayoutTypeEnum;
}) => RFVisualizationNode[];

export const getVisualizationNodes: GetVisualizationObjectNodes = ({ nodes, layoutType }) => {
  switch (layoutType) {
    case VisualizationLayoutTypes.matrix:
      return getVisualizationMatrixNodes(nodes, DEFAULT_VISUALIZATION_MATRIX_DIMENSIONS);
    case VisualizationLayoutTypes.hierarchy:
      return getVisualizationHierarchyNodes(nodes, DEFAULT_VISUALIZATION_HIERARCHY_DIMENSIONS);
  }
};

export const getRFVisualizationNodes = (nodes: RFVisualizationNode[]) => {
  const result: RFVisualizationNode[] = [];

  nodes.forEach(node => {
    result.push(omit(['children'], node) as RFVisualizationNode);
    if (node.children) {
      result.push(...getRFVisualizationNodes(node.children));
    }
  });

  return result.map(el => ({
    ...el,
    draggable: config.NEXT_PUBLIC_CLUSTER_VISUALIZATION_NODE_DRAGGABLE,
    connectable: config.NEXT_PUBLIC_CLUSTER_VISUALIZATION_NODE_CONNECTABLE,
    selected: false,
    style: {
      ...(el.style || {}),
      borderRadius: '9px',
    },
  }));
};
