import { RFVisualizationConnectableEntity, RFVisualizationNode } from '@/types/visualization/react-flow';
import { getVisualizationEdgeId } from '../getVisualizationEdges';
import { K8sObjectTypeEnum } from '@/types/visualization/k8sObjects';

export const getMockConnectionsFromNodes = (nodes: RFVisualizationNode[]) => {
  const existingEdges = new Set<string>();

  return [
    ...getMockNodeConnections({ nodes, existingEdges, type: 'Namespace' }),
    ...getMockNodeConnections({ nodes, existingEdges, type: 'Container' }),
    ...getMockNodeConnections({ nodes, existingEdges, type: 'Pod' }),
  ];
};

export const getMockNodeConnections = ({
  type,
  nodes,
  existingEdges,
}: {
  nodes: RFVisualizationNode[];
  existingEdges: Set<string>;
  type: K8sObjectTypeEnum;
}) => {
  const filteredNodes = nodes.filter(node => node.data.type === type);

  // Limit connections based on node count
  const maxConnections = getMaxConnectionsForType(type, filteredNodes.length);
  const connectionsToCreate = Math.min(maxConnections, filteredNodes.length - 1);

  return filteredNodes.slice(0, connectionsToCreate).reduce((acc, cur, index) => {
    // Calculate target index with more controlled spacing
    const targetIndex = (index + Math.ceil(filteredNodes.length / 3)) % filteredNodes.length;
    const targetNode = filteredNodes[targetIndex];

    if (!targetNode) return acc;

    if (targetNode.id === cur.id) return acc;

    if (existingEdges.has(getVisualizationEdgeId(cur.id, targetNode.id))) {
      return acc;
    }

    return [...acc, getConnectionsForNode(cur, targetNode, type)];
  }, [] as RFVisualizationConnectableEntity[]);
};

const getMaxConnectionsForType = (type: K8sObjectTypeEnum, nodeCount: number): number => {
  // Define maximum connections based on node type and count
  const limits: Record<string, number> = {
    Cluster: Math.min(3, Math.ceil(nodeCount * 0.2)), // Max 3 connections, or 20% of nodes
    Node: Math.min(10, Math.ceil(nodeCount * 0.25)), // Max 4 connections, or 25% of nodes
    Namespace: Math.min(5, Math.ceil(nodeCount * 0.3)), // Max 5 connections, or 30% of nodes
    Pod: Math.min(12, Math.ceil(nodeCount * 0.4)), // Max 8 connections, or 40% of nodes
    Container: Math.min(1, Math.ceil(nodeCount * 0.5)), // Max 12 connections, or 50% of nodes
  };

  return limits[type];
};

export const getConnectionsForNode = (
  source: RFVisualizationNode,
  target: RFVisualizationNode,
  type: K8sObjectTypeEnum
): RFVisualizationConnectableEntity => {
  return {
    id: source.id,
    name: source.data.label,
    type,
    connections: [
      {
        id: target.id,
        type,
      },
    ],
  };
};
