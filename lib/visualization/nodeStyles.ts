import tailwindConfig from '@/tailwind.config';
import { RFVisualizationEdgeTypes, VisualizationDimensionConfig } from '@/types/visualization/react-flow';
import { Edge, MarkerType } from '@xyflow/react';
import { DEFAULT_VISUALIZATION_DIMENSIONS } from '.';
import { getVisualizationEdgeType } from './edges';

export type RFVisualizationNodeBaseStyle = Omit<React.CSSProperties, 'width' | 'height'> & {
  width?: number;
  height?: number;
};

export const getRFVisualizationClusterBaseStyle = (): RFVisualizationNodeBaseStyle => {
  return {
    backgroundColor: '#FFF',
    color: '#878AA9',
    padding: 0,
    border: 'none',
  };
};

export const getRFVisualizationNamespaceBaseStyle = (): RFVisualizationNodeBaseStyle => {
  return {
    backgroundColor: 'white',
    color: tailwindConfig.theme.extend.colors.text[400],
    padding: 0,
    border: 'none',
  };
};

export const getRFVisualizationPodBaseStyle = (): RFVisualizationNodeBaseStyle => {
  return {
    backgroundColor: 'white',
    color: tailwindConfig.theme.extend.colors.text[400],
    padding: 0,
    border: 'none',
  };
};

export const getRFVisualizationPodHiddenStyle = (): RFVisualizationNodeBaseStyle => {
  return {
    borderStyle: 'hidden',
    backgroundColor: tailwindConfig.theme.extend.colors.text[100],
  };
};

export const getRFVisualizationHierarchyGroupBaseStyle = (): RFVisualizationNodeBaseStyle => {
  return {
    backgroundColor: 'transparent',
    color: tailwindConfig.theme.extend.colors.text[400],
    padding: 0,
    border: 'none',
  };
};

export const getVisualizationEdgeBaseStyleForContainer = (config: VisualizationDimensionConfig): Partial<Edge> => {
  return {
    style: {
      stroke: '#04A1F9',
    },
    interactionWidth: 20,
    zIndex: 1000,
    type: getVisualizationEdgeType(config.layoutType),
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: '#04A1F9',
      orient: config.marker.orient,
    },
  };
};

export const getVisualizationEdgeBaseStyleForNamespace = (): Partial<Edge> => {
  return {
    style: {
      stroke: '#25BCC0',
    },
    interactionWidth: 20,
    zIndex: 1000,
    type: RFVisualizationEdgeTypes.default,
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: '#25BCC0',
      orient: DEFAULT_VISUALIZATION_DIMENSIONS.marker.orient,
    },
  };
};

export const getVisualizationEdgeBaseStyleForCluster = (): Partial<Edge> => {
  return {
    style: {
      stroke: '#FC1706',
    },
    interactionWidth: 20,
    zIndex: 1000,
    type: RFVisualizationEdgeTypes.default,
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: '#FC1706',
      orient: DEFAULT_VISUALIZATION_DIMENSIONS.marker.orient,
    },
  };
};

export const getVisualizationEdgeBaseStyleForPod = (): Partial<Edge> => {
  return {
    style: {
      stroke: '#04A1F9',
    },
    interactionWidth: 20,
    zIndex: 1000,
    type: RFVisualizationEdgeTypes.default,
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: '#04A1F9',
      orient: DEFAULT_VISUALIZATION_DIMENSIONS.marker.orient,
    },
  };
};
