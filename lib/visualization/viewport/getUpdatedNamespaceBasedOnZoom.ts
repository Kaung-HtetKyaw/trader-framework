import { RFVisualizationEdge, RFVisualizationNode } from '@/types/visualization/react-flow';
import { UpdateEdgeDataFn } from '@/lib/hooks/useOnRFViewportChange';

export const NAMESPACE_ZOOM_THRESHOLDS = {
  END: 0.4,
  START: 0.6,
};

const getUpdatedNamespaceBasedOnZoom = (
  node: RFVisualizationNode,
  edges: RFVisualizationEdge[],
  zoom: number,
  updateEdgeData: UpdateEdgeDataFn
) => {
  if (zoom <= NAMESPACE_ZOOM_THRESHOLDS.END) {
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
        showPlaceholder: true,
      },
      style: {
        ...node.style,
      },
    };
  }

  if (zoom > NAMESPACE_ZOOM_THRESHOLDS.END) {
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
        showPlaceholder: false,
      },
      style: {
        ...node.style,
      },
    };
  }

  return node;
};

export default getUpdatedNamespaceBasedOnZoom;
