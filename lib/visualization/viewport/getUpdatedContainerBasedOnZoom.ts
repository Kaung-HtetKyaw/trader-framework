import { RFVisualizationEdge, RFVisualizationNode } from '@/types/visualization/react-flow';
import { UpdateEdgeDataFn } from '@/lib/hooks/useOnRFViewportChange';

export const CONTAINER_ZOOM_THRESHOLDS = {
  END: 0.6,
  START: 0.8,
};

const getUpdatedContainerBasedOnZoom = (
  node: RFVisualizationNode,
  edges: RFVisualizationEdge[],
  zoom: number,
  updateEdgeData: UpdateEdgeDataFn
): RFVisualizationNode => {
  if (zoom <= CONTAINER_ZOOM_THRESHOLDS.END) {
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
    };
  }

  if (zoom > CONTAINER_ZOOM_THRESHOLDS.END && zoom <= CONTAINER_ZOOM_THRESHOLDS.START) {
    return {
      ...node,
      data: {
        ...node.data,
        hidden: false,
        showPlaceholder: true,
      },
    };
  }

  if (zoom > CONTAINER_ZOOM_THRESHOLDS.START) {
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
    };
  }

  return node;
};

export default getUpdatedContainerBasedOnZoom;
