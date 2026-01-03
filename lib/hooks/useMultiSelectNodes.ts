import { ReactFlowMouseEvent, RFVisualizationEdge, RFVisualizationNode } from '@/types/visualization/react-flow';
import { useStoreApi } from '@xyflow/react';
import { useCallback } from 'react';

const useMultiSelectNodes = () => {
  const store = useStoreApi<RFVisualizationNode, RFVisualizationEdge>();

  const toggleNodeSelection = useCallback(
    (event: ReactFlowMouseEvent, node: RFVisualizationNode) => {
      event.preventDefault();
      event.stopPropagation();

      const currentNodes = store.getState().nodes;

      // Update all nodes to reflect new selection
      store.getState().setNodes(
        currentNodes.map(n => ({
          ...n,
          selected: n.id === node.id ? !n.selected : n.selected,
        }))
      );
    },
    [store]
  );

  const reset = useCallback(() => {
    const { resetSelectedElements } = store.getState();
    resetSelectedElements();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { reset, toggle: toggleNodeSelection };
};

export default useMultiSelectNodes;
