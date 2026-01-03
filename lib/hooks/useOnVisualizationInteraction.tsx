import { addToZoomedInNodes, changeInteractionState, isZoomedInNode } from '@/signals/visualiation/misc';
import { getNodes } from '@/signals/visualiation/nodes';
import { K8sObjectTypeEnum, K8sObjectTypes } from '@/types/visualization/k8sObjects';
import { RFVisualizationNode } from '@/types/visualization/react-flow';
import { useSignals } from '@preact/signals-react/runtime';
import { useOnViewportChange, Viewport } from '@xyflow/react';
import { useCallback, useEffect, useState } from 'react';
import { useDebounceCallback } from './useDebounceCallback';

export type UseOnVisualizationInteractionProps = {
  onZoomIn: (id: string, type: K8sObjectTypeEnum) => void;
  zoomToLoadThreshold?: number;
  skipZoomToLoad?: boolean;
};

const DEFAULT_ZOOM_LEVEL_THRESHOLD = 0.6;
const TRACK_INTERACTION_DEBOUNCE_TIME = 1000;

const useOnVisualizationInteraction = (props: UseOnVisualizationInteractionProps) => {
  useSignals();
  const { onZoomIn, skipZoomToLoad = false, zoomToLoadThreshold = DEFAULT_ZOOM_LEVEL_THRESHOLD } = props;
  const [isReady, setIsReady] = useState(false);

  const debouncedEndInteraction = useDebounceCallback(() => {
    changeInteractionState({
      isDragging: false,
      isPanning: false,
      isZooming: false,
    });
  }, TRACK_INTERACTION_DEBOUNCE_TIME);

  const getVisiblePlaceHolderNodes = (nodes: RFVisualizationNode[], viewport: Viewport) => {
    const { x, y, zoom } = viewport;
    const VISIBILITY_THRESHOLD = 0.5;

    const viewRect = {
      left: -x / zoom,
      top: -y / zoom,
      right: (-x + window.innerWidth) / zoom,
      bottom: (-y + window.innerHeight) / zoom,
    };

    return nodes
      .filter(node => {
        const nodeWidth = Number(node.style?.width) || 0;
        const nodeHeight = Number(node.style?.height) || 0;
        const horizontalOffset = nodeWidth * VISIBILITY_THRESHOLD;
        const verticalOffset = nodeHeight * VISIBILITY_THRESHOLD;
        const nodeLeft = node.position.x;
        const nodeRight = node.position.x + nodeWidth;
        const nodeTop = node.position.y;
        const nodeBottom = node.position.y + nodeHeight;
        const adjustedNodeLeft = nodeLeft + horizontalOffset;
        const adjustedNodeRight = nodeRight - horizontalOffset;
        const adjustedNodeTop = nodeTop + verticalOffset;
        const adjustedNodeBottom = nodeBottom - verticalOffset;

        const isWithinFrame =
          adjustedNodeRight > viewRect.left &&
          adjustedNodeLeft < viewRect.right &&
          adjustedNodeBottom > viewRect.top &&
          adjustedNodeTop < viewRect.bottom;

        const isPlaceholderNode =
          node.data.type === K8sObjectTypes.PlaceHolderNamespaceGroup ||
          node.data.type === K8sObjectTypes.PlaceHolderCWOGroup;

        return isPlaceholderNode && isWithinFrame;
      })
      .map(el => {
        if (el.data.type === K8sObjectTypes.PlaceHolderNamespaceGroup) {
          return {
            type: K8sObjectTypes.Namespace,
            value: el.data.label,
          };
        }

        if (el.data.type === K8sObjectTypes.PlaceHolderCWOGroup) {
          return {
            type: K8sObjectTypes.CWOGroup,
            value: el.data.label,
          };
        }

        return {
          type: el.data.type,
          value: undefined,
        };
      });
  };

  const onZoomInNode = useCallback(
    (viewport: Viewport) => {
      if (!isReady) return;

      const nodes = getNodes();
      const visibleNodes = getVisiblePlaceHolderNodes(nodes, viewport);

      if (skipZoomToLoad || viewport.zoom < zoomToLoadThreshold) {
        return;
      }

      visibleNodes.forEach(el => {
        if (!el.value) {
          return;
        }

        if (!isZoomedInNode(el.value, el.type)) {
          addToZoomedInNodes(el.value, el.type);
          onZoomIn(el.value, el.type);
        }
      });
    },
    [onZoomIn, zoomToLoadThreshold, skipZoomToLoad, isReady]
  );

  useEffect(() => {
    setTimeout(() => setIsReady(true), 1000);
  }, []);

  const onStartInteraction = () => {
    debouncedEndInteraction.cancel();
    changeInteractionState({
      isDragging: true,
      isPanning: true,
      isZooming: true,
    });
  };

  useOnViewportChange({
    // Using onChange instead of onStart since selecting a node does not trigger onEnd
    onChange: () => {
      onStartInteraction();
    },
    // using onEnd instead of onChange for performance reasons here
    // TODO: use onChange when we have better/more optimized way to do this
    onEnd: viewport => {
      onZoomInNode(viewport);
      // Reset the interaction state
      debouncedEndInteraction();
    },
  });
};

export default useOnVisualizationInteraction;
