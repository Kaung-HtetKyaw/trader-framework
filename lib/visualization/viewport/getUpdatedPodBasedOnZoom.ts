import { RFVisualizationEdge, RFVisualizationNode } from '@/types/visualization/react-flow';
import { UpdateEdgeDataFn } from '@/lib/hooks/useOnRFViewportChange';
import { getRFVisualizationPodBaseStyle, getRFVisualizationPodHiddenStyle } from '../nodeStyles';

export const POD_ZOOM_THRESHOLDS = {
  END: 0.4,
  START: 0.6,
};

const getUpdatedPodBasedOnZoom = (
  node: RFVisualizationNode,
  edges: RFVisualizationEdge[],
  zoom: number,
  updateEdgeData: UpdateEdgeDataFn
) => {
  if (zoom <= POD_ZOOM_THRESHOLDS.END) {
    // Hide all edges connected to the container
    const edgesToHide = edges.filter(edge => edge.source === node.id || edge.target === node.id);
    edgesToHide.forEach(edge => {
      updateEdgeData(edge.id, {
        hidden: true,
      });
    });

    return {
      ...node,
      data: {
        ...node.data,
        hidden: true,
        showPlaceholder: true,
      },
      style: {
        ...node.style,
        ...getRFVisualizationPodHiddenStyle(),
      },
    };
  }

  if (zoom > POD_ZOOM_THRESHOLDS.END && zoom < POD_ZOOM_THRESHOLDS.START) {
    return {
      ...node,
      data: {
        ...node.data,
        hidden: false,
        showPlaceholder: true,
      },
      style: {
        ...node.style,
        ...getRFVisualizationPodHiddenStyle(),
      },
    };
  }

  if (zoom > POD_ZOOM_THRESHOLDS.START) {
    // Show all edges connected to the container
    const edgesToShow = edges.filter(edge => edge.source === node.id || edge.target === node.id);
    edgesToShow.forEach(edge => {
      updateEdgeData(edge.id, {
        hidden: false,
      });
    });

    return {
      ...node,
      data: {
        ...node.data,
        hidden: false,
        showPlaceholder: false,
      },
      style: {
        ...node.style,
        ...getRFVisualizationPodBaseStyle(),
      },
    };
  }

  return node;
};

export default getUpdatedPodBasedOnZoom;
