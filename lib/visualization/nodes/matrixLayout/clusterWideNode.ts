import { EntityNode } from '@/types/visualization';
import {
  RFVisualizationCoordinateDimension,
  RFVisualizationNode,
  RFVisualizationNodeTypes,
  VisualizationDimensionConfig,
} from '@/types/visualization/react-flow';
import { getHorizontalChunkedArray, getTransposedChunkedArray, Rectangle } from '../..';
import K8sVisualizationIconMap, { K8sVisualizationIconEnum } from '@/components/visualization/iconMap';
import { K8sObjectTypes } from '@/types/visualization/k8sObjects';
import { getRFVisualizationNamespaceBaseStyle } from '../../nodeStyles';
import { getVisualizationNamespacedNodeList } from './namespacedNode';
import { XYPosition } from '@xyflow/react';
import { isEmpty } from 'lodash/fp';

export const getVisualizationClusterWideNodeList = (
  nodes: EntityNode[],
  config: VisualizationDimensionConfig
): RFVisualizationNode[] => {
  const individualNodeList = getVisualizationClusterWideIndividualNodeList(
    nodes.filter(el => el.kind !== K8sObjectTypes.Namespace),
    config
  );

  const maxBottomNode = individualNodeList.sort((a, b) => b.position.y - a.position.y)[0];
  const bottomY = maxBottomNode
    ? maxBottomNode.position.y + Number(maxBottomNode.style?.height) + 3 * config.entityGap
    : config.entityPadding;

  const groupNodeList = getVisualizationClusterWideGroupNodeList(
    nodes.filter(el => el.kind === K8sObjectTypes.Namespace),
    { x: config.coordinateDimensions.x, y: bottomY },
    config
  );
  return individualNodeList.concat(groupNodeList);
};

const getVisualizationClusterWideIndividualNodeList = (
  nodes: EntityNode[],
  config: VisualizationDimensionConfig
): RFVisualizationNode[] => {
  const coordinateDimensionList: RFVisualizationCoordinateDimension[] = [];

  return nodes.map((node, index) => {
    const visualizationNode = getVisualizationClusterWideNode(node, index, coordinateDimensionList, config);

    // record the width and height of the namespace for the viewport to calculate the position of the next namespace
    coordinateDimensionList.push({
      width: visualizationNode.style?.width || 0,
      height: visualizationNode.style?.height || 0,
      x: visualizationNode.position.x,
      y: visualizationNode.position.y,
      whitespaceRect: visualizationNode.data.whitespaceRect,
    });

    return visualizationNode;
  });
};

const getVisualizationClusterWideGroupNodeList = (
  nodes: EntityNode[],
  defaultCoord: { x: number; y: number },
  config: VisualizationDimensionConfig
): RFVisualizationNode[] => {
  let currentCoord = {
    x: defaultCoord.x,
    y: defaultCoord.y,
    row: 0,
    bottom: 0,
  };

  const baseWidth = config.entityPerRow * config.container.width;
  const gapWidth = config.entityGap * (config.entityPerRow - 1);
  const paddingWidth = config.entityPadding * 2;
  const standardWidth = baseWidth + gapWidth + paddingWidth;

  return nodes.map((node, index) => {
    const visualizationNode = getVisualizationClusterWideGroupNode(node, index, currentCoord, config);

    const nodeWidth = visualizationNode?.style?.width || 0;
    const nodeRight = visualizationNode.position.x + nodeWidth + config.entityGap;
    const nodeBottom = visualizationNode.position.y + (visualizationNode?.style?.height || 0) + config.entityGap;
    const isPastRightThreshold = nodeRight > defaultCoord.x + standardWidth;
    const nextRow = isPastRightThreshold ? currentCoord.row + 1 : currentCoord.row;
    const maxBottom = nodeBottom > currentCoord.bottom ? nodeBottom : currentCoord.bottom;

    // prepare for the next node
    currentCoord = {
      x: isPastRightThreshold ? config.coordinateDimensions.x : nodeRight,
      y: currentCoord.row === nextRow ? currentCoord.y : maxBottom + config.entityGap,
      bottom: currentCoord.row === nextRow ? maxBottom : currentCoord.bottom,
      row: nextRow,
    };

    return visualizationNode;
  });
};

export const getVisualizationClusterWideNode = (
  node: EntityNode,
  index: number,
  coordinateDimensionList: RFVisualizationCoordinateDimension[] = [],
  config: VisualizationDimensionConfig
): RFVisualizationNode => {
  switch (node.kind) {
    case K8sObjectTypes.Namespace:
      return getVisualizationClusterWideNamespaceNode(node, index, coordinateDimensionList, config);
    default:
      return getVisualizationClusterWideIndividualNode(node, index, coordinateDimensionList, config);
  }
};

const getVisualizationClusterWideGroupNode = (
  node: EntityNode,
  index: number,
  currentCoord: { x: number; y: number; row: number; bottom: number },
  config: VisualizationDimensionConfig
) => {
  const numberOfChildren = node?.children?.length || 0;
  const numberOfRows = Math.ceil(numberOfChildren / config.entityPerRow);
  const childrenWithDimensions = getVisualizationNamespacedNodeList(node?.children || [], config);

  const width = getChildrenWidth(childrenWithDimensions, config) + config.entityGap;

  const height = getChildrenHeight(childrenWithDimensions, numberOfRows, config) + 2 * config.entityPadding;

  const x = currentCoord.x + config.entityPadding;

  const y = currentCoord.y;

  return {
    id: node.id,
    type: RFVisualizationNodeTypes.group,
    parentId: node.parent,
    extent: 'parent' as const,
    position: {
      x,
      y,
    },
    data: {
      label: node.name,
      type: K8sObjectTypes.Namespace,
      rect: new Rectangle(x, y, width, height),
      healthStatus: node.healthStatus,
      apiVersions: [],
    },
    style: {
      width,
      height,
      ...getRFVisualizationNamespaceBaseStyle(),
    },
    children: getVisualizationNamespacedNodeList(node.children || [], config),
  };
};

export const getVisualizationClusterWideIndividualNode = (
  node: EntityNode,
  index: number,
  coordinateDimensionList: RFVisualizationCoordinateDimension[] = [],
  config: VisualizationDimensionConfig
) => {
  const colIndex = index % config.entityPerRow;
  const rowIndex = Math.floor(index / config.entityPerRow);

  const leftAdjacentNodeIndex = colIndex === 0 ? -1 : index - 1;
  const leftAdjacentNode = coordinateDimensionList[leftAdjacentNodeIndex] || config.coordinateDimensions;

  const chunkedList = getHorizontalChunkedArray(coordinateDimensionList, config.entityPerRow);

  const topAdjacentRow = chunkedList[rowIndex - 1];
  const topAdjacentRowY = topAdjacentRow
    ? topAdjacentRow.map(el => el.y + el.height + config.entityGap).sort((a, b) => b - a)[0]
    : 0;

  const leftAdjacentCol = getTransposedChunkedArray(chunkedList)[colIndex - 1];
  const leftAdjacentColX = leftAdjacentCol ? leftAdjacentCol.map(el => el.x + el.width).sort((a, b) => b - a)[0] : 0;

  const isFirstRow = rowIndex === 0;
  const isFirstNode = index === 0;

  // if the node is in the first row, the x position is the width of the left adjacent node + the x position of the left adjacent node + the gap between the nodes
  // if the node is not in the first row, just take the x position of the top adjacent node
  const x = isFirstRow
    ? leftAdjacentNode.width + leftAdjacentNode.x + config.entityGap
    : leftAdjacentColX + config.entityGap;

  // if the node is in the first row, the y position is the y position of the left adjacent node
  // if the node is not in the first row, the y position is the height of the top adjacent node + the gap between the nodes + the gap between the nodes
  const y = isFirstRow ? leftAdjacentNode.y + (isFirstNode ? config.entityPadding : 0) : topAdjacentRowY;

  const width = config.container.width;
  const height = config.container.height;

  const whitespaceRect = {
    ...getTopWhitespaceRect(node, { x, y }, index, coordinateDimensionList, config),
    ...getLeftWhitespaceRect(node, { x, y }, index, coordinateDimensionList, config),
  };

  return {
    id: node.id,
    type: RFVisualizationNodeTypes.node,
    parentId: node.parent,
    position: {
      x,
      y,
    },
    extent: 'parent' as const,
    data: {
      label: node.name,
      type: node.kind,
      rect: new Rectangle(x, y, width, height),
      whitespaceRect: isEmpty(whitespaceRect) ? undefined : whitespaceRect,
      icon: K8sVisualizationIconMap[node.kind as K8sVisualizationIconEnum],
      healthStatus: node.healthStatus,
      apiVersions: node.apiVersions,
    },
    style: {
      width,
      height,
      maxHeight: height,
      maxWidth: width,
    },
  };
};

export const getVisualizationClusterWideNamespaceNode = (
  node: EntityNode,
  index: number,
  coordinateDimensionList: RFVisualizationCoordinateDimension[] = [],
  config: VisualizationDimensionConfig
) => {
  const colIndex = index % config.entityPerRow;
  const numberOfChildren = node?.children?.length || 0;
  const numberOfRows = Math.ceil(numberOfChildren / config.entityPerRow);
  const rowNumber = Math.floor(index / config.entityPerRow);
  const childrenWithDimensions = getVisualizationNamespacedNodeList(node?.children || [], config);

  const width = getChildrenWidth(childrenWithDimensions, config) + config.entityGap;

  const height = getChildrenHeight(childrenWithDimensions, numberOfRows, config) + 2 * config.entityPadding;

  const topRow = getHorizontalChunkedArray(coordinateDimensionList, config.entityPerRow)[rowNumber - 1];

  const topRowDimensions = topRow ? topRow.sort((a, b) => b.height - a.height)[0] : config.coordinateDimensions;

  const leftAdjacentNodeIndex = colIndex === 0 ? -1 : index - 1;
  const leftAdjacentPod = coordinateDimensionList[leftAdjacentNodeIndex] || config.coordinateDimensions;

  // the x position of the pod is the width of the left adjacent pod + the x position of the left adjacent pod + the gap between the pods
  const x =
    leftAdjacentPod.width +
    leftAdjacentPod.x +
    (colIndex === 0 ? config.entityPadding : config.entityGap + config.entityPadding);
  const y = topRowDimensions.height + topRowDimensions.y + config.entityGap;

  return {
    id: node.id,
    type: RFVisualizationNodeTypes.group,
    parentId: node.parent,
    extent: 'parent' as const,
    position: {
      x,
      y,
    },
    data: {
      label: node.name,
      type: K8sObjectTypes.Namespace,
      rect: new Rectangle(x, y, width, height),
      healthStatus: node.healthStatus,
      apiVersions: node.apiVersions,
    },
    style: {
      width,
      height,
      ...getRFVisualizationNamespaceBaseStyle(),
    },
    children: getVisualizationNamespacedNodeList(node.children || [], config),
  };
};

const getChildrenWidth = (nodes: RFVisualizationNode[], config: VisualizationDimensionConfig) => {
  // From [a,b,c,d,e,f] to [[a,b],[c,d],[e,f]] for 2 entity per row
  // and get sum of each row and get the biggest one as the width
  const chunkedNodes = getHorizontalChunkedArray(nodes, config.entityPerRow);

  const childrenWidth =
    chunkedNodes
      .map(row =>
        row.reduce((acc, cur) => {
          const right = cur.position.x + Number(cur.style?.width || 0);
          return right > acc ? right : acc;
        }, 0)
      )
      .sort((a, b) => b - a)[0] || config.group.width;

  // apply padding and gap
  return childrenWidth + config.entityPadding;
};

const getChildrenHeight = (
  nodes: RFVisualizationNode[],
  numberOfRows: number,
  config: VisualizationDimensionConfig
) => {
  // From [a,b,c,d,e,f] to [[a,b],[c,d],[e,f]] for 2 entity per row
  // and get sum of each row and get the biggest one as the width
  const chunkedNodes = getHorizontalChunkedArray(nodes, config.entityPerRow);

  const childrenHeight = chunkedNodes
    .map(row => row.map(el => Number(el?.style?.height || config.container.height)).sort((a, b) => b - a)[0])
    .reduce((acc, cur) => acc + cur, 0);

  // children height + gap between children
  const heightWithChildren = childrenHeight + (chunkedNodes.length - 2) * config.entityGap + 2 * config.entityPadding;

  return numberOfRows > 0 ? heightWithChildren : config.group.height;
};

const getTopWhitespaceRect = (
  node: EntityNode,
  coord: XYPosition,
  index: number,
  coordinateDimensionList: RFVisualizationCoordinateDimension[],
  config: VisualizationDimensionConfig
) => {
  const colIndex = index % config.entityPerRow;
  const rowIndex = Math.floor(index / config.entityPerRow);
  const chunkedList = getHorizontalChunkedArray(coordinateDimensionList, config.entityPerRow);
  const topAdjacentRow = chunkedList[rowIndex - 1];

  const topAdjacentNode = topAdjacentRow ? topAdjacentRow[colIndex] : undefined;

  if (topAdjacentNode && topAdjacentNode.whitespaceRect?.top) {
    return { top: { ...(topAdjacentNode?.whitespaceRect?.top || {}) } };
  }

  const topAdjacentNodeBottom = topAdjacentNode ? topAdjacentNode.y + topAdjacentNode.height : undefined;

  const hasBiggerGapThanNormal = topAdjacentNodeBottom && coord.y - topAdjacentNodeBottom > config.entityGap;

  if (hasBiggerGapThanNormal) {
    return {
      top: {
        y: topAdjacentNodeBottom + config.entityGap,
        height: coord.y - topAdjacentNodeBottom,
      },
    };
  }

  return {};
};

const getLeftWhitespaceRect = (
  node: EntityNode,
  coord: XYPosition,
  index: number,
  coordinateDimensionList: RFVisualizationCoordinateDimension[],
  config: VisualizationDimensionConfig
) => {
  const colIndex = index % config.entityPerRow;
  const leftAdjacentNodeIndex = colIndex === 0 ? -1 : index - 1;
  const leftAdjacentNode = coordinateDimensionList[leftAdjacentNodeIndex] || config.coordinateDimensions;

  if (leftAdjacentNode && leftAdjacentNode?.whitespaceRect?.left) {
    return {
      left: { ...(leftAdjacentNode?.whitespaceRect?.left || {}) },
    };
  }

  const leftAdjacentNodeRight = leftAdjacentNode.x + leftAdjacentNode.width;

  const hasBiggerGapThanNormal = coord.x - leftAdjacentNodeRight > config.entityPadding;

  if (hasBiggerGapThanNormal) {
    return {
      left: {
        x: leftAdjacentNodeRight + config.entityPadding,
        width: coord.x - leftAdjacentNodeRight,
      },
    };
  }

  return {};
};
