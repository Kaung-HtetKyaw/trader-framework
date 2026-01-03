import RFNode from './RFNode';
import RFGroupNode from './RFGroup';
import { RFVisualizationEdgeTypes, RFVisualizationNodeTypes } from '@/types/visualization/react-flow';
import { DefaultEdgeOptions } from '@xyflow/react';
import { RFPathFinderEdge, RFSmoothStepEdge } from './RFEdge';

export const nodeTypes: RFVisualizationNodeTypes = {
  node: RFNode,
  group: RFGroupNode,
};

export const edgeTypes: RFVisualizationEdgeTypes = {
  default: RFPathFinderEdge,
  smoothstep: RFSmoothStepEdge,
};

export const defaultEdgeOptions: DefaultEdgeOptions = {
  type: RFVisualizationEdgeTypes.default,
  zIndex: 1000,
  interactionWidth: 100,
  style: {
    stroke: '#04A1F9',
  },
};
