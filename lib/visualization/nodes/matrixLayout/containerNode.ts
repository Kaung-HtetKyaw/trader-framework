import { EntityNode } from '@/types/visualization';
import {
  RFVisualizationCoordinateDimension,
  RFVisualizationNode,
  RFVisualizationNodeTypes,
  VisualizationDimensionConfig,
} from '@/types/visualization/react-flow';
import { getHorizontalChunkedArray, getTransposedChunkedArray, Rectangle } from '../..';
import K8sVisualizationIconMap, { K8sVisualizationIconEnum } from '@/components/visualization/iconMap';

export const getVisualizationContainerNodeList = (
  nodes: EntityNode[],
  config: VisualizationDimensionConfig
): RFVisualizationNode[] => {
  const coordinateDimensionList: RFVisualizationCoordinateDimension[] = [];

  return nodes.map((node, index) => {
    const visualizationNode = getVisualizationContainerNode(node, index, coordinateDimensionList, config);

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

export const getVisualizationContainerNode = (
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
