import { useNodesState, ReactFlow, EdgeTypes } from '@xyflow/react';
import { nodeTypes, edgeTypes, defaultEdgeOptions } from './options';
import { ReactFlowMouseEvent, RFVisualizationEdge, RFVisualizationNode } from '@/types/visualization/react-flow';
import '@xyflow/react/dist/style.css';
import RFControls from './RFControls';
import { useCallback, useEffect, useState } from 'react';
import VisualizationLoader from '../VisualizationLoader';
import useEdgesStateFromProps from '@/lib/hooks/useEdgesStateFromProps';
import { cn } from '@/lib/utils';
import { initNodes } from '@/signals/visualiation/nodes';
import { useSignals } from '@preact/signals-react/runtime';
import {
  closeSearch,
  closeZoomOptions,
  initFitView,
  misc,
  resetOnDemandLoading,
  selectNode,
} from '@/signals/visualiation/misc';
import useCenterVisualization from '@/lib/hooks/useCenterVisualization';
import { initEdges } from '@/signals/visualiation/edges';
import { K8sContextObject } from '@/types/visualization';
import useOnVisualizationInteraction from '@/lib/hooks/useOnVisualizationInteraction';
import { CustomToast } from '@/components/CustomToast';
import config from '@/lib/config';
import { K8sObjectTypeEnum } from '@/types/visualization/k8sObjects';

export type RFDependencyGraphDiagramProps = {
  nodes: RFVisualizationNode[];
  edges: RFVisualizationEdge[];
  onZoomToLoad: (id: string, type: K8sObjectTypeEnum) => Promise<K8sContextObject[]>;
  isLoading: boolean;
};

const CANVAS_ID = 'rf-dependency-graph-diagram';

const RFDependencyGraphDiagram = (props: RFDependencyGraphDiagramProps) => {
  useSignals();
  const { nodes: initialNodes, edges: initialEdges, isLoading, onZoomToLoad } = props;
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesStateFromProps(initialEdges);
  const [isInitialized, setIsInitialized] = useState(false);
  const activeAction = misc.value.activeAction;

  // NOTE: When we use incremental rendering, the entrie visualization is not loaded when the component is mounted
  //       so we need to wait for the visualization complete loading before fitting the view
  //       this is a hack to fit the view when the visualization is loaded
  const { centerVisualization, isCentered } = useCenterVisualization({
    canvasId: CANVAS_ID,
    isInitialized: isInitialized,
  });

  // Load namespaced objects or CWO objects when a placeholder node is zoomed in
  useOnVisualizationInteraction({
    onZoomIn: onZoomToLoad,
    skipZoomToLoad: !isInitialized || !isCentered,
  });

  useEffect(() => {
    setNodes(initialNodes);
    initNodes(initialNodes);
    initEdges(initialEdges);
    initFitView(() => centerVisualization());
  }, [initialNodes, initialEdges, setNodes, centerVisualization]);

  const onClickCanvas = () => {
    if (misc.value.isSearchOpen) {
      closeSearch();
    }

    if (misc.value.isZoomOptionsOpen) {
      closeZoomOptions();
    }
  };

  const onInit = useCallback(() => {
    setIsInitialized(true);
    resetOnDemandLoading();
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  const onClickNode = useCallback((e: ReactFlowMouseEvent, node: RFVisualizationNode<{}>) => {
    selectNode(node.id, () => {
      CustomToast({
        type: 'error',
        message: `You can only select ${config.NEXT_PUBLIC_OBJECT_SELECTION_LIMIT} objects at a time`,
      });
    });
  }, []);

  return (
    <VisualizationLoader isLoading={isLoading} id={CANVAS_ID}>
      <ReactFlow
        onlyRenderVisibleElements={true}
        draggable={!isLoading}
        nodes={nodes}
        edges={edges}
        onInit={onInit}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onClickNode}
        nodeTypes={nodeTypes}
        fitView
        edgeTypes={edgeTypes as EdgeTypes}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        className={cn('bg-white')}
        defaultEdgeOptions={defaultEdgeOptions}
        minZoom={0.2}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
        panOnDrag={activeAction === 'pan' && !isLoading}
        elevateNodesOnSelect={false}
        elevateEdgesOnSelect={false}
        multiSelectionKeyCode="DISABLED"
        selectNodesOnDrag={false}
        nodesDraggable={false}
        onClick={onClickCanvas}
      ></ReactFlow>

      <RFControls />
    </VisualizationLoader>
  );
};

export default RFDependencyGraphDiagram;
