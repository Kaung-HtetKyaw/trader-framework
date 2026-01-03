import { VisualizationActionEnum, VisualizationActions, ZoomLevel } from '@/types/visualization';
import { computed, signal } from '@preact/signals-react';
import { nodes } from './nodes';
import { K8sObjectTypeEnum, K8sObjectTypes } from '@/types/visualization/k8sObjects';
import { deepSignal } from '@preact-signals/utils';
import { RFVisualizationEdge, RFVisualizationNode } from '@/types/visualization/react-flow';
import { LoadNamespacedObjectsFn } from '@/lib/hooks/useGetDeferredVisualizationObjects/useGetNamespacedObjects';
import config from '@/lib/config';
import { LoadCWOObjectsFn } from '@/lib/hooks/useGetDeferredVisualizationObjects/useGetCWO';

type MiscSignal = {
  focusedNode: string | undefined;
  isSearchOpen: boolean;
  isZoomOptionsOpen: boolean;
  isLoading: boolean;
  zoomLevel: ZoomLevel;
  activeAction: VisualizationActionEnum;
  fitView: () => void;
};

type InteractionStates = {
  isDragging: boolean;
  isZooming: boolean;
  isPanning: boolean;
  isSelecting: boolean;
  isConnecting: boolean;
  isNodeDragging: boolean;
  isEdgeReconnecting: boolean;
  isRepositioning: boolean;
};

export const zoomLevelOptions: ZoomLevel[] = [
  {
    label: '5x',
    selectedLabel: '5x',
    value: 2,
    default: false,
  },
  {
    label: '3x',
    selectedLabel: '3x',
    value: 1.5,
    default: false,
  },
  {
    label: '1x',
    selectedLabel: '1x',
    value: 1,
    default: false,
  },
  {
    label: 'Fit Screen',
    selectedLabel: 'Fit',
    value: 'fit',
    default: true,
  },
];

const defaultMiscValue: MiscSignal = {
  focusedNode: undefined,
  isSearchOpen: false,
  isZoomOptionsOpen: false,
  isLoading: false,
  zoomLevel: {
    label: 'Fit Screen',
    selectedLabel: 'Fit',
    value: 'fit',
    default: true,
  } as ZoomLevel,
  activeAction: VisualizationActions.pan,
  fitView: () => {},
};

const misc = signal<MiscSignal>({
  ...defaultMiscValue,
});

// NOTE: creating a separate signal to avoid re-rendering all nodes when misc states or selected nodes change
const selectedNodesSet = deepSignal(new Set<string>());
const selectedNodesArray = computed(() => Array.from(selectedNodesSet.value));
const hasSelectedNodes = computed(() => selectedNodesArray.value.length > 0);
const selectedNodesCount = computed(() => selectedNodesArray.value.length);

export type ChangeVisualizationNodesFn = (
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  payload: RFVisualizationNode<{}>[] | ((nodes: RFVisualizationNode<{}>[]) => RFVisualizationNode<{}>[])
) => void;

export type ChangeVisualizationEdgesFn = (
  payload: RFVisualizationEdge[] | ((edges: RFVisualizationEdge[]) => RFVisualizationEdge[])
) => void;

const changeVisualizationNodesSignal = signal<ChangeVisualizationNodesFn>(() => {});

const changeVisualizationEdgesSignal = signal<ChangeVisualizationEdgesFn>(() => {});

const loadNamespacedObjectsSignal = signal<LoadNamespacedObjectsFn>(() => Promise.resolve([]));

const zoomedInNamespaces = deepSignal(new Set<string>());

const namespaceLoadingSet = deepSignal<Set<string>>(new Set<string>());

const cwoLoadingSet = deepSignal<Set<K8sObjectTypeEnum>>(new Set<K8sObjectTypeEnum>());

const loadCWOsSignal = signal<LoadCWOObjectsFn>(() => Promise.resolve([]));

const zoomedInCWOs = deepSignal<Set<K8sObjectTypeEnum>>(new Set<K8sObjectTypeEnum>());

const visualizationInteractionSignal = signal<InteractionStates>({
  isDragging: false,
  isZooming: false,
  isPanning: false,
  isSelecting: false,
  isConnecting: false,
  isNodeDragging: false,
  isEdgeReconnecting: false,
  isRepositioning: false,
});

const changeVisualizationNodes = (
  payload: RFVisualizationNode[] | ((nodes: RFVisualizationNode[]) => RFVisualizationNode[])
) => {
  return changeVisualizationNodesSignal.value(payload);
};

const changeVisualizationEdges = (
  payload: RFVisualizationEdge[] | ((edges: RFVisualizationEdge[]) => RFVisualizationEdge[])
) => {
  return changeVisualizationEdgesSignal.value(payload);
};

const isNamespaceLoading = (namespace: string) => {
  return namespaceLoadingSet.value.has(namespace);
};

const changeNamespaceLoading = (namespace: string) => {
  if (namespaceLoadingSet.value.has(namespace)) {
    namespaceLoadingSet.value.delete(namespace);
  }

  namespaceLoadingSet.value.add(namespace);
};

const initLoadNamespacedObjects = (loadNamespacedObjectsFn: LoadNamespacedObjectsFn) => {
  loadNamespacedObjectsSignal.value = loadNamespacedObjectsFn;
};

const loadNamespacedObjects = (namespace: string) => {
  return loadNamespacedObjectsSignal.value(namespace);
};

const isZoomedInNamespace = (namespace: string) => {
  return zoomedInNamespaces.value.has(namespace);
};

const addToZoomedInNamespaces = (namespace: string) => {
  zoomedInNamespaces.value.add(namespace);
};

const resetZoomedInNamespaces = () => {
  zoomedInNamespaces.value = new Set();
};

const resetLoadingNamespaces = () => {
  namespaceLoadingSet.value = new Set();
};

const isZoomedInCWO = (kind: K8sObjectTypeEnum) => {
  return zoomedInCWOs.value.has(kind);
};

const addToZoomedInCWO = (kind: K8sObjectTypeEnum) => {
  zoomedInCWOs.value.add(kind);
};

const resetZoomedInCWO = () => {
  zoomedInCWOs.value = new Set();
};

const resetLoadingCWO = () => {
  cwoLoadingSet.value = new Set();
};

const isCWOLoading = (kind: K8sObjectTypeEnum) => {
  return cwoLoadingSet.value.has(kind);
};

const changeCWOLoading = (kind: K8sObjectTypeEnum) => {
  if (cwoLoadingSet.value.has(kind)) {
    cwoLoadingSet.value.delete(kind);
  }

  cwoLoadingSet.value.add(kind);
};

const initLoadCWOs = (loadCWOsFn: LoadCWOObjectsFn) => {
  loadCWOsSignal.value = loadCWOsFn;
};

const loadCWOs = (kind: K8sObjectTypeEnum) => {
  return loadCWOsSignal.value(kind);
};

const isZoomedInNode = (id: string, type: K8sObjectTypeEnum) => {
  if (type === K8sObjectTypes.Namespace) {
    return isZoomedInNamespace(id);
  }
  if (type === K8sObjectTypes.CWOGroup) {
    return isZoomedInCWO(id as K8sObjectTypeEnum);
  }
  return false;
};

const addToZoomedInNodes = (id: string, type: K8sObjectTypeEnum) => {
  if (type === K8sObjectTypes.Namespace && !isZoomedInNamespace(id)) {
    zoomedInNamespaces.value.add(id);
    return;
  }

  if (type === K8sObjectTypes.CWOGroup || !isZoomedInCWO(id as K8sObjectTypeEnum)) {
    zoomedInCWOs.value.add(id as K8sObjectTypeEnum);
    return;
  }
};

const openSearch = (onSuccess?: () => void) => {
  misc.value = {
    ...misc.value,
    isSearchOpen: true,
    isZoomOptionsOpen: false,
  };
  if (onSuccess) {
    onSuccess();
  }
};

const closeSearch = (onSuccess?: () => void) => {
  misc.value = {
    ...misc.value,
    isSearchOpen: false,
  };
  if (onSuccess) {
    onSuccess();
  }
};

const openZoomOptions = (onSuccess?: () => void) => {
  misc.value = {
    ...misc.value,
    isZoomOptionsOpen: true,
    isSearchOpen: false,
  };
  if (onSuccess) {
    onSuccess();
  }
};

const closeZoomOptions = (onSuccess?: () => void) => {
  misc.value = {
    ...misc.value,
    isZoomOptionsOpen: false,
  };
  if (onSuccess) {
    onSuccess();
  }
};

const changeZoomLevel = (zoomLevel: ZoomLevel) => {
  misc.value = {
    ...misc.value,
    zoomLevel,
  };
};

const changeLoading = (isLoading: boolean) => {
  misc.value = {
    ...misc.value,
    isLoading,
  };
};

const changeActiveAction = (action: VisualizationActionEnum) => {
  if (misc.value.isLoading) return;
  misc.value = {
    ...misc.value,
    activeAction: action,
  };
};

const changeFocusedNode = (nodeId: string | undefined) => {
  misc.value = {
    ...misc.value,
    focusedNode: nodeId,
  };
};

const isSelectedNode = (nodeId: string) => {
  return selectedNodesSet.value.has(nodeId);
};

const isFocusedNode = (nodeId: string) => {
  return misc.value.focusedNode === nodeId;
};

const selectNode = (nodeId: string, onLimitReached?: () => void) => {
  if (misc.value.isLoading) return;

  const isSelected = selectedNodesSet.value.has(nodeId);
  const node = nodes.value.find(node => node.id === nodeId);

  if (
    node?.data.type === K8sObjectTypes.Cluster ||
    node?.data.type === K8sObjectTypes.CWOGroup ||
    node?.data.type === K8sObjectTypes.PlaceHolderCWOGroup
  )
    return;

  if (node?.data.type === K8sObjectTypes.HierarchyGroup) {
    const namespaceNode = nodes.value.find(
      n =>
        n.data.label === node.data.namespace &&
        (n.data.type === K8sObjectTypes.Namespace || n.data.type === K8sObjectTypes.PlaceHolderNamespaceGroup)
    );

    if (!namespaceNode) {
      return;
    }

    const isNamespaceNodeSelected = selectedNodesSet.value.has(namespaceNode.id);

    if (isNamespaceNodeSelected) {
      selectedNodesSet.value.delete(namespaceNode.id);
      return;
    }

    if (onLimitReached && selectedNodesCount.value >= config.NEXT_PUBLIC_OBJECT_SELECTION_LIMIT) {
      onLimitReached();
      return;
    }

    selectedNodesSet.value.add(namespaceNode.id);

    return;
  }

  if (isSelected) {
    selectedNodesSet.value.delete(nodeId);
    return;
  }

  if (onLimitReached && selectedNodesCount.value >= config.NEXT_PUBLIC_OBJECT_SELECTION_LIMIT) {
    onLimitReached();
    return;
  }

  selectedNodesSet.value.add(nodeId);
};

const changeSelectedNodes = (nodes: string[]) => {
  selectedNodesSet.value = new Set(nodes);
};

const resetSelectedNodes = () => {
  selectedNodesSet.value = new Set();
};

const resetOnDemandLoading = () => {
  resetZoomedInNamespaces();
  resetLoadingNamespaces();
  resetZoomedInCWO();
  resetLoadingCWO();
};

const initFitView = (fitView: () => void) => {
  misc.value = {
    ...misc.value,
    fitView,
  };
};

const changeInteractionState = (state: Partial<InteractionStates>) => {
  visualizationInteractionSignal.value = {
    ...visualizationInteractionSignal.value,
    ...state,
  };
};

const getInteractionState = () => {
  return visualizationInteractionSignal.value;
};

const getIsInteractionIdle = () => {
  const { isDragging, isZooming, isPanning, isConnecting, isEdgeReconnecting, isNodeDragging, isSelecting } =
    visualizationInteractionSignal.value;
  return (
    !isDragging && !isZooming && !isPanning && !isConnecting && !isEdgeReconnecting && !isNodeDragging && !isSelecting
  );
};

const getIsRepositioning = () => {
  return visualizationInteractionSignal.value.isRepositioning;
};

// This is a simulation to show the repositioning of the nodes when the filters are applied to ensure a smooth UX
const applyRepositionSimulation = (cb?: () => void) => {
  visualizationInteractionSignal.value = {
    ...visualizationInteractionSignal.value,
    isRepositioning: true,
  };

  setTimeout(() => {
    visualizationInteractionSignal.value = {
      ...visualizationInteractionSignal.value,
      isRepositioning: false,
    };

    if (cb) {
      cb();
    }
  }, 1000);
};

export {
  misc,
  isSelectedNode,
  isFocusedNode,
  selectedNodesArray,
  selectedNodesSet,
  selectedNodesCount,
  hasSelectedNodes,
  openSearch,
  changeZoomLevel,
  openZoomOptions,
  closeSearch,
  closeZoomOptions,
  changeLoading,
  changeFocusedNode,
  selectNode,
  changeActiveAction,
  changeSelectedNodes,
  resetSelectedNodes,
  initFitView,
  changeVisualizationNodes,
  changeVisualizationEdges,
  loadNamespacedObjects,
  initLoadNamespacedObjects,
  isNamespaceLoading,
  changeNamespaceLoading,
  zoomedInNamespaces,
  isZoomedInNamespace,
  addToZoomedInNamespaces,
  changeInteractionState,
  getInteractionState,
  getIsInteractionIdle,
  resetZoomedInNamespaces,
  resetLoadingNamespaces,
  applyRepositionSimulation,
  getIsRepositioning,
  isZoomedInCWO,
  addToZoomedInCWO,
  resetZoomedInCWO,
  resetLoadingCWO,
  isCWOLoading,
  changeCWOLoading,
  initLoadCWOs,
  loadCWOs,
  zoomedInCWOs,
  resetOnDemandLoading,
  addToZoomedInNodes,
  isZoomedInNode,
};
