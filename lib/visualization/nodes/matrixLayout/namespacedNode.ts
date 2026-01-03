import { EntityNode } from '@/types/visualization';
import {
  RFVisualizationCoordinateDimension,
  RFVisualizationNode,
  RFVisualizationNodeTypes,
  VisualizationDimensionConfig,
} from '@/types/visualization/react-flow';
import { getHorizontalChunkedArray, getTransposedChunkedArray, Rectangle } from '../..';
import K8sVisualizationIconMap, { K8sVisualizationIconEnum } from '@/components/visualization/iconMap';
import { getRFVisualizationPodBaseStyle } from '../../nodeStyles';
import { K8sObjectTypes } from '@/types/visualization/k8sObjects';
import { getVisualizationContainerNodeList } from './containerNode';

export const getVisualizationNamespacedNodeList = (
  nodes: EntityNode[],
  config: VisualizationDimensionConfig
): RFVisualizationNode[] => {
  const coordinateDimensionList: RFVisualizationCoordinateDimension[] = [];

  return nodes.map((node, index) => {
    const visualizationNode = getVisualizationNamespacedNode(node, index, coordinateDimensionList, config);

    // record the width and height of the namespace for the viewport to calculate the position of the next namespace
    coordinateDimensionList.push({
      width: visualizationNode.style?.width || 0,
      height: visualizationNode.style?.height || 0,
      x: visualizationNode.position.x,
      y: visualizationNode.position.y,
    });

    return visualizationNode;
  });
};

export const getVisualizationNamespacedNode = (
  node: EntityNode,
  index: number,
  coordinateDimensionList: RFVisualizationCoordinateDimension[] = [],
  config: VisualizationDimensionConfig
) => {
  switch (node.kind) {
    case K8sObjectTypes.Pod:
      return getVisualizationNamespacedGroupNode(node, index, coordinateDimensionList, config);
    default:
      return getVisualizationNamespacedIndividualNode(node, index, coordinateDimensionList, config);
  }
};

export const getVisualizationNamespacedIndividualNode = (
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
  const leftAdjacentColX = leftAdjacentCol
    ? leftAdjacentCol.map(el => el.x + el.width + config.entityGap).sort((a, b) => b - a)[0]
    : 0;

  const isFirstRow = rowIndex === 0;
  const isFirstNode = index === 0;

  // if the node is in the first row, the x position is the width of the left adjacent node + the x position of the left adjacent node + the gap between the nodes
  // if the node is not in the first row, just take the x position of the top adjacent node
  const x = isFirstRow
    ? leftAdjacentNode.width + leftAdjacentNode.x + (isFirstNode ? 0 : config.entityGap)
    : leftAdjacentColX;

  // if the node is in the first row, the y position is the y position of the left adjacent node
  // if the node is not in the first row, the y position is the height of the top adjacent node + the gap between the nodes + the gap between the nodes
  const y = isFirstRow ? leftAdjacentNode.y + (isFirstNode ? config.entityPadding : 0) : topAdjacentRowY;

  const width = config.container.width;
  const height = config.container.height;

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
      icon: K8sVisualizationIconMap[node.kind as K8sVisualizationIconEnum],
      healthStatus: node.healthStatus,
      namespace: node.namespace,
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

export const getVisualizationNamespacedGroupNode = (
  node: EntityNode,
  index: number,
  coordinateDimensionList: RFVisualizationCoordinateDimension[] = [],
  config: VisualizationDimensionConfig
) => {
  const colIndex = index % config.entityPerRow;
  const numberOfChildren = node?.children?.length || 0;
  const numberOfRows = Math.ceil(numberOfChildren / config.entityPerRow);
  const rowNumber = Math.floor(index / config.entityPerRow);
  const childrenWithDimensions = getVisualizationContainerNodeList(node?.children || [], config);

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
    (colIndex === 0 ? config.entityGap : config.entityGap + config.entityPadding);

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
      type: K8sObjectTypes.Pod,
      rect: new Rectangle(x, y, width, height),
      healthStatus: node.healthStatus,
      namespace: node.namespace,
      apiVersions: node.apiVersions,
    },
    style: {
      width,
      height,
      ...getRFVisualizationPodBaseStyle(),
    },
    children: getVisualizationContainerNodeList(node.children || [], config),
  };
};

const getChildrenWidth = (nodes: RFVisualizationNode[], config: VisualizationDimensionConfig) => {
  // From [a,b,c,d,e,f] to [[a,b],[c,d],[e,f]] for 2 entity per row
  // and get sum of each row and get the biggest one as the width
  const chunkedNodes = getHorizontalChunkedArray(nodes, config.entityPerRow);
  const childrenWidth =
    chunkedNodes
      .map(row =>
        row.reduce((acc, cur, index) => {
          return acc + Number(cur?.style?.width || config.container.width) + (index > 0 ? config.entityGap : 5);
        }, 0)
      )
      .sort((a, b) => b - a)[0] || config.group.width;

  // apply padding and gap
  return childrenWidth;
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
  const heightWithChildren = childrenHeight + (chunkedNodes.length - 2) * config.entityGap + config.entityGap;

  return numberOfRows > 0 ? heightWithChildren : config.group.height;
};
