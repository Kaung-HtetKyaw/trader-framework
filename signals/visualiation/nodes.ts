import { computed, signal } from '@preact/signals-react';
import {
  RFVisualizationNode,
  RFVisualizationNodeBounds,
  RFVisualizationNodeData,
} from '@/types/visualization/react-flow';
import { BoundTypes } from '@/types/visualization';
import { K8sObjectTypeEnum, K8sObjectTypes } from '@/types/visualization/k8sObjects';
import { getBoundType, getGapPointsByHorizontalCenter } from '@/lib/visualization/edges/gapPoints';
import { XYPosition } from '@xyflow/react';
import { selectedNodesSet } from './misc';

const nodes = signal<RFVisualizationNode[]>([]);

const namespaces = computed(() => {
  return nodes.value.filter(
    node => node.data.type === K8sObjectTypes.Namespace || node.data.type === K8sObjectTypes.PlaceHolderNamespaceGroup
  );
});

const getNodes = () => {
  return nodes.value;
};

const getSelectedNodes = () => {
  return nodes.value
    .filter(node => selectedNodesSet.value.has(node.id))
    .map(el => {
      if (el.data.type === K8sObjectTypes.PlaceHolderNamespaceGroup) {
        return { ...el, data: { ...el.data, type: K8sObjectTypes.Namespace } };
      }
      return el;
    });
};

const getNamespaces = () => {
  return namespaces.value;
};

const getFilteredNodes = () => {
  const allNodes = getNodes();

  return allNodes;
};

const getVisibleNodes = () => {
  return nodes.value.filter(node => !node.hidden);
};

const getHiddenNodes = () => {
  return nodes.value.filter(node => node.hidden);
};

// Initialize nodes while preserving the original visibility state
const initNodes = (data: RFVisualizationNode[]) => {
  nodes.value = data;
};

const updateNodeData = (id: string, data: Partial<RFVisualizationNodeData>) => {
  nodes.value = nodes.value.map(node => (node.id === id ? { ...node, data: { ...node.data, ...data } } : node));
};

const getBoundMaps = () => {
  const map = new Map<string, RFVisualizationNodeBounds[]>();

  Object.values(BoundTypes).forEach(boundType => {
    const bounds = nodes.value
      .filter(node => getBoundType(node.data.type) === boundType)
      .map(node => node.data.bounds)
      .filter(el => !!el);
    map.set(boundType, bounds);
  });

  return map;
};

const getGapPointsMap = () => {
  const map = new Map<string, XYPosition[]>();
  const boundsMap = getBoundMaps();
  Object.values(BoundTypes).forEach(sourceType => {
    const gapPoints = getGapPointsByHorizontalCenter(boundsMap.get(sourceType) || []);
    map.set(sourceType, gapPoints);
  });
  return map;
};

const getBounds = (type: K8sObjectTypeEnum) => {
  const bounds = getBoundMaps();
  const boundType = getBoundType(type === 'Container' ? 'Pod' : type);
  return bounds.get(boundType) || [];
};

const getGapPoints = (type: K8sObjectTypeEnum) => {
  const boundType = getBoundType(type === 'Container' ? 'Pod' : type);
  const gapPoints = getGapPointsMap();
  return gapPoints.get(boundType) || [];
};

const resetNodesSignal = () => {
  nodes.value = [];
};

export {
  nodes,
  getNodes,
  getFilteredNodes,
  initNodes,
  getBounds,
  getGapPoints,
  updateNodeData,
  resetNodesSignal,
  getVisibleNodes,
  getHiddenNodes,
  getNamespaces,
  getSelectedNodes,
};
