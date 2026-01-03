import getUpdatedNodeBasedOnZoom from '@/lib/visualization/viewport/getUpdatedNodeBasedOnZoom';
import { RFVisualizationEdge, RFVisualizationEdgeData, RFVisualizationNode } from '@/types/visualization/react-flow';
import { useOnViewportChange, useReactFlow } from '@xyflow/react';

export type UseOnRFViewportChangeProps = {
  edges: RFVisualizationEdge[];
  enable: boolean;
};

export type UpdateEdgeDataFn = (edgeId: string, data: Partial<RFVisualizationEdgeData>) => void;

const useOnRFViewportChange = (props: UseOnRFViewportChangeProps) => {
  const { edges, enable } = props;
  const { setNodes, updateEdgeData } = useReactFlow<RFVisualizationNode, RFVisualizationEdge>();

  useOnViewportChange({
    // using onEnd instead of onChange for performance reasons here
    // TODO: use onChange when we have better/more optimized way to do this
    onEnd: viewport => {
      if (!enable) {
        return;
      }
      setNodes(nodes => nodes.map(node => getUpdatedNodeBasedOnZoom(node, edges, viewport.zoom, updateEdgeData)));
    },
  });
};

export default useOnRFViewportChange;
