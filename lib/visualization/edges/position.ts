import { RFVisualizationNode } from '@/types/visualization/react-flow';
import { XYPosition } from '@xyflow/react';

export const getAbsoluteNodePosition = (
  node: RFVisualizationNode,
  allNodes: RFVisualizationNode[]
): RFVisualizationNode<{ absolutePosition: XYPosition }> => {
  if (!node.parentId) {
    return {
      ...node,
      data: {
        ...node.data,
        absolutePosition: node.position,
        bounds: {
          minX: node.position.x,
          maxX: node.position.x + (node.style?.width || 0),
          minY: node.position.y,
          maxY: node.position.y + (node.style?.height || 0),
        },
      },
      children: node.children?.map(child => getAbsoluteNodePosition(child, allNodes)),
    };
  }

  const parentNode = allNodes.find(n => n.id === node.parentId);
  if (!parentNode) {
    return {
      ...node,
      data: {
        ...node.data,
        absolutePosition: node.position,
        bounds: {
          minX: node.position.x,
          maxX: node.position.x + (node.style?.width || 0),
          minY: node.position.y,
          maxY: node.position.y + (node.style?.height || 0),
        },
      },
      children: node.children?.map(child => getAbsoluteNodePosition(child, allNodes)),
    };
  }

  const parentNodeWithAbsolutePosition = getAbsoluteNodePosition(parentNode, allNodes);

  const minX = parentNodeWithAbsolutePosition?.data?.absolutePosition?.x + node.position.x;
  const maxX = minX + (node.style?.width || 0);
  const minY = parentNodeWithAbsolutePosition?.data?.absolutePosition?.y + node.position.y;
  const maxY = minY + (node.style?.height || 0);

  return {
    ...node,
    data: {
      ...node.data,
      absolutePosition: {
        x: minX,
        y: minY,
      },
      bounds: {
        minX,
        maxX,
        minY,
        maxY,
      },
    },
    children: node.children?.map(child => getAbsoluteNodePosition(child, allNodes)),
  };
};
