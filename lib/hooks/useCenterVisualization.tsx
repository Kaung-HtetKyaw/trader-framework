import { K8sObjectTypes } from '@/types/visualization/k8sObjects';
import { useReactFlow } from '@xyflow/react';
import { getVisualizationClusterGroupId } from '../visualization/getVisualizationEdges';
import { RFVisualizationNode } from '@/types/visualization/react-flow';
import { useCallback, useEffect, useState } from 'react';

export type UseCenterVisualizationProps = {
  canvasId: string;
  isInitialized: boolean;
};

const useCenterVisualization = (props: UseCenterVisualizationProps) => {
  const { canvasId, isInitialized } = props;
  const { fitView, setViewport, getViewport, getZoom, getNodes } = useReactFlow<RFVisualizationNode>();
  const [isCentered, setIsCentered] = useState(false);

  const getClusterWidth = useCallback(() => {
    const nodes = getNodes();

    const startX = nodes.sort((a, b) => a.position.x - b.position.x)[0].position.x;
    const endX = nodes.sort((a, b) => b.position.x - a.position.x)[0].position.x;

    return endX - startX;
  }, [getNodes]);

  const centerVisualization = useCallback(() => {
    const currentViewport = getViewport();
    const currentZoom = getZoom();
    const nodes = getNodes();

    const measuredWidth = nodes
      .filter(el => el.data.type === K8sObjectTypes.Cluster)
      .reduce((acc, el) => {
        const wrapper = document.getElementById(getVisualizationClusterGroupId(el.data));

        return Number(wrapper?.clientWidth || 0) + acc;
      }, 0);

    const element = document.getElementById(canvasId);

    // Fit view if the canvas is not loaded or the width is 0 or the zoom is greater than 1
    if (!element || measuredWidth === 0 || currentZoom > 1) {
      fitView({ duration: 600 });
      return;
    }

    const canvasWidth = element.clientWidth || 0;
    const widthDiff = canvasWidth - getClusterWidth() * currentZoom;
    const fillerWidth = widthDiff <= 0 ? 0 : widthDiff < 100 ? 400 : 0;
    const currentWidth = getClusterWidth() * currentZoom + fillerWidth;

    const isWithinCanvasFrame = currentWidth < canvasWidth;

    if (isWithinCanvasFrame) {
      fitView({ duration: 600 });
      return;
    }

    setViewport({ x: 30, y: 30, zoom: currentViewport.zoom }, { duration: 600 });
  }, [fitView, getViewport, getNodes, getZoom, setViewport, canvasId, getClusterWidth]);

  useEffect(() => {
    if (isInitialized) {
      centerVisualization();
      setIsCentered(true);
    }
  }, [isInitialized, centerVisualization]);

  return { fitView, setViewport, getViewport, getZoom, centerVisualization, isCentered };
};

export default useCenterVisualization;
