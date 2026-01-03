import { RFVisualizationEdge, RFVisualizationNode } from '@/types/visualization/react-flow';
import getUpdatedContainerBasedOnZoom from './getUpdatedContainerBasedOnZoom';
import { UpdateEdgeDataFn } from '@/lib/hooks/useOnRFViewportChange';
import getUpdatedPodBasedOnZoom from './getUpdatedPodBasedOnZoom';
import getUpdatedNamespaceBasedOnZoom from './getUpdatedNamespaceBasedOnZoom';
import { K8sObjectTypes } from '@/types/visualization/k8sObjects';

const getUpdatedNodeBasedOnZoom = (
  node: RFVisualizationNode,
  edges: RFVisualizationEdge[],
  zoom: number,
  onUpdateEdgeData: UpdateEdgeDataFn
) => {
  switch (node.data.type) {
    case K8sObjectTypes.Container:
      return getUpdatedContainerBasedOnZoom(node, edges, zoom, onUpdateEdgeData);
    case K8sObjectTypes.Pod:
      return getUpdatedPodBasedOnZoom(node, edges, zoom, onUpdateEdgeData);
    case K8sObjectTypes.Namespace:
      return getUpdatedNamespaceBasedOnZoom(node, edges, zoom, onUpdateEdgeData);
    default:
      return node;
  }
};

export default getUpdatedNodeBasedOnZoom;
