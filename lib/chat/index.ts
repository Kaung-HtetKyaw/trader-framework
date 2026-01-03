import { PromptNodeContext } from '@/types/chat';
import { RFVisualizationNode } from '@/types/visualization/react-flow';

type NodeInfo = {
  id: string;
  type: string;
  namespace: string;
  name: string;
};

export const findNodeNamespace = (nodeId: string, nodeMap: Map<string, RFVisualizationNode>): string | null => {
  let currentNode = nodeMap.get(nodeId);

  // Traverse up the parent hierarchy until we find a namespace node or hit root
  while (currentNode) {
    if (currentNode.data?.type === 'Namespace') {
      return currentNode.data.label || currentNode.id;
    }

    if (!currentNode.parentId) break;
    currentNode = nodeMap.get(currentNode.parentId);
  }

  return null;
};

export const getSelectedNodesInfo = (selectedNodes: string[], allNodes: RFVisualizationNode[]): NodeInfo[] => {
  const nodeMap = new Map(allNodes.map(node => [node.id, node]));

  return selectedNodes.reduce((acc, nodeId) => {
    const node = nodeMap.get(nodeId);
    if (node) {
      const namespace = findNodeNamespace(nodeId, nodeMap);
      acc.push({
        id: node.id,
        type: node.data?.type || 'unknown',
        namespace: namespace || '',
        name: node.data?.label || '',
      });
    }
    return acc;
  }, [] as NodeInfo[]);
};

export const formatNodesContext = (nodesInfo: NodeInfo[]): string => {
  if (nodesInfo.length === 0) return 'No valid nodes found';

  return nodesInfo
    .map(({ id, type, namespace }) => `- Type: ${type}, ID: ${id}${namespace ? `, Namespace: ${namespace}` : ''}`)
    .join('\n');
};

export type ChatContext = {
  input: string;
  selectedObjects: PromptNodeContext[];
};

export const buildChatContext = (
  clusterID: string,
  userText: string,
  selectedNodes: string[],
  allNodes: RFVisualizationNode[]
): ChatContext => {
  const nodesInfo = getSelectedNodesInfo(selectedNodes, allNodes);

  return {
    input: userText,
    selectedObjects: nodesInfo.map(nodeInfo => ({
      clusterID,
      id: nodeInfo.id,
      namesapce: nodeInfo.namespace,
      name: nodeInfo.name,
      kind: nodeInfo.type,
    })),
  };
};

export const extractOriginalUserText = (formattedPrompt: string): string => {
  const parts = formattedPrompt.split('\n\n');
  if (parts.length >= 2) {
    return parts[1];
  }
  return formattedPrompt;
};

export * from '../../types/chat/sse-types';
export * from './sse-client';
export * from './sse-parser';
export * from './tableChatContext';
export * from './restoreTableSelections';
export * from './upgradePlanChatContext';
export { postSSE } from './streamWithFetchEventSource';
