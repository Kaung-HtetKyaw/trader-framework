import { EntityNode } from '@/types/visualization';
import {
  RFVisualizationCoordinateDimension,
  RFVisualizationEdge,
  RFVisualizationEdgeTypes,
  RFVisualizationNode,
  RFVisualizationNodeTypes,
  VisualizationDimensionConfig,
} from '@/types/visualization/react-flow';
import { getHorizontalChunkedArray, Rectangle } from '../..';
import { K8sObjectTypeEnum, K8sObjectTypes } from '@/types/visualization/k8sObjects';
import { getRFVisualizationHierarchyGroupBaseStyle } from '../../nodeStyles';
import K8sVisualizationIconMap, { K8sVisualizationIconEnum } from '@/components/visualization/iconMap';
import { XYPosition } from '@xyflow/react';
import { getVisualizationEdgeBaseStyle, getVisualizationEdgeId } from '../../getVisualizationEdges';

type HierarchyNodeContext = {
  hasParent?: boolean;
  startPosition?: XYPosition;
  children?: EntityNode[];
  parentId?: string;
  parentType?: K8sObjectTypeEnum;
};

export const getVisualizationHierarchyNodeList = (
  nodes: EntityNode[],
  config: VisualizationDimensionConfig,
  context?: HierarchyNodeContext
): RFVisualizationNode[] => {
  const coordinateDimensionList: RFVisualizationCoordinateDimension[] = [];

  return nodes.map((node, index) => {
    const visualizationNode = getVisualizationHierarchyNode(node, index, coordinateDimensionList, config, context);

    // record the width and height of the namespace for the viewport to calculate the position of the next namespace
    coordinateDimensionList.push({
      width: visualizationNode.style?.width || 0,
      height: visualizationNode.style?.height || 0,
      x: visualizationNode.position.x,
      y:
        visualizationNode.position.y +
        (context?.hasParent ? (index === 0 ? -4 : config.entityGap + config.container.height) : 0),
      type: node.kind,
    });

    return visualizationNode;
  });
};

export const getVisualizationHierarchyNode = (
  node: EntityNode,
  index: number,
  coordinateDimensionList: RFVisualizationCoordinateDimension[] = [],
  config: VisualizationDimensionConfig,
  context?: HierarchyNodeContext
) => {
  if (node.children.length) {
    return getVisualizationHierarchyGroupNode(node, index, coordinateDimensionList, config, context);
  }

  return getVisualizationHierarchyIndividualNode(node, index, coordinateDimensionList, config, context);
};

export const getVisualizationHierarchyIndividualNode = (
  node: EntityNode,
  index: number,
  coordinateDimensionList: RFVisualizationCoordinateDimension[] = [],
  config: VisualizationDimensionConfig,
  context?: HierarchyNodeContext
) => {
  const rowIndex = Math.floor(index / config.entityPerRow);
  const chunkedList = getHorizontalChunkedArray(coordinateDimensionList, config.entityPerRow);

  const topAdjacentRow = chunkedList[rowIndex - 1];
  const topAdjacentRowY = topAdjacentRow ? topAdjacentRow.map(el => el.y + el.height).sort((a, b) => b - a)[0] : 0;

  const x = index > 0 ? config.container.width + config.entityGap + 100 : 0;
  const y = getIndividualStartY(topAdjacentRowY, index, config);
  const width = config.container.width + config.entityGap;
  const height = config.container.height;

  const parentId = getNodeIdFromHierarchyGroupId(node.parent);
  const isCurrentNodeIndirectParent = parentId === context?.parentId;

  const connections: RFVisualizationEdge[] = context?.children
    // If node has hierarchy group as parent in visualization, that parent is the same underlying parent
    // If node and the children do not have the kind and do not have the same id
    ?.filter(el => (isCurrentNodeIndirectParent || el.parent === node.id) && el.kind !== node.kind && el.id !== node.id)
    ?.map(el => {
      return {
        id: getVisualizationEdgeId(node.id, el.id),
        data: {
          label: getVisualizationEdgeId(node.name, el.name),
          sourceType: node.kind,
          targetType: el.kind,
        },
        source: node.id,
        target: el.id,
        type: RFVisualizationEdgeTypes.default,
        ...getVisualizationEdgeBaseStyle(config),
      };
    }) as RFVisualizationEdge[];

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
      connections,
    },
    style: {
      width,
      height,
    },
  };
};

const getVisualizationHierarchyGroupNode = (
  node: EntityNode,
  index: number,
  coordinateDimensionList: RFVisualizationCoordinateDimension[] = [],
  config: VisualizationDimensionConfig,
  context?: HierarchyNodeContext
) => {
  const id = `${node.id}-${K8sObjectTypes.HierarchyGroup}`;
  const colIndex = index % config.entityPerRow;
  const rowNumber = Math.floor(index / config.entityPerRow);
  const currentNode: EntityNode = { ...node, parent: id, children: [] };

  const nodeChildren = node?.children?.map(el => ({ ...el, parent: id })) || [];

  const childrenNodesWithDimensions = getVisualizationHierarchyNodeList(
    [currentNode, ...nodeChildren],
    {
      ...config,
      coordinateDimensions: {
        ...config.coordinateDimensions,
        x: config.container.width + config.entityGap,
      },
    },
    {
      hasParent: true,
      children: node.children || [],
      parentId: node.id,
      parentType: K8sObjectTypes.HierarchyGroup,
    }
  );

  const childrenWithDimensions = childrenNodesWithDimensions;
  const width = getChildrenWidth(childrenWithDimensions);

  // NOTE: There is a 4px gap (caused by react flow) between the children and the group node, so we need to subtract it manually
  const height = getChildrenHeight(childrenWithDimensions, config) - config.entityGap - 4;

  const topRow = getHorizontalChunkedArray(coordinateDimensionList, config.entityPerRow)[rowNumber - 1];

  const topRowDimensions = topRow ? topRow.sort((a, b) => b.height - a.height)[0] : config.coordinateDimensions;

  const leftAdjacentNodeIndex = colIndex === 0 ? -1 : index - 1;
  const leftAdjacentNode = coordinateDimensionList[leftAdjacentNodeIndex];
  const leftAdjacentNodeDimensions = leftAdjacentNode
    ? { ...leftAdjacentNode, x: Number(leftAdjacentNode.x || 0) + 30 }
    : {
        ...config.coordinateDimensions,
        x: config.coordinateDimensions.x,
      };

  const x = leftAdjacentNodeDimensions.width + leftAdjacentNodeDimensions.x + (context?.hasParent ? 100 : 0);
  // only recalculate the y position if the type of the top row is the same as the node kind . If it is not the same, it means the top row is parent controller
  const y = getGroupStartY(!!topRow ? topRowDimensions : undefined, index, config) + (context?.startPosition?.y || 0);

  return {
    id: getHierarchyGroupFromNode(node),
    type: RFVisualizationNodeTypes.group,
    parentId: node.parent,
    extent: 'parent' as const,
    position: {
      x,
      y,
    },
    data: {
      label: node.name,
      type: K8sObjectTypes.HierarchyGroup,
      rect: new Rectangle(x, y, width, height),
      healthStatus: node.healthStatus,
      namespace: node.namespace,
      apiVersions: node.apiVersions,
    },
    style: {
      width,
      height,
      ...getRFVisualizationHierarchyGroupBaseStyle(),
    },
    connectable: false,
    children: childrenWithDimensions,
  };
};

const getChildrenWidth = (nodes: RFVisualizationNode[]) => {
  return nodes.reduce((acc, cur) => {
    const width = cur.position.x + Number(cur.style?.width || 0) + 100;
    return acc < width ? width : acc;
  }, 0);
};

const getChildrenHeight = (nodes: RFVisualizationNode[], config: VisualizationDimensionConfig) => {
  return (
    nodes.reduce((acc, cur) => acc + Number(cur?.style?.height || config.container.height) + config.entityGap, 0) -
    config.entityGap
  );
};

const getGroupStartY = (
  topRow: RFVisualizationCoordinateDimension | undefined,
  index: number,
  config: VisualizationDimensionConfig
) => {
  if (!topRow) return 0;

  if (index === 0) {
    return 0;
  }

  if (index === 2) {
    return topRow.height + topRow.y - config.container.height - 4;
  }

  return topRow.height + topRow.y + (index === 0 ? 2 * config.entityPadding : 0);
};

const getIndividualStartY = (topRowY: number, index: number, config: VisualizationDimensionConfig) => {
  if (index === 1) {
    return -4;
  }

  if (index === 2) {
    return topRowY - config.container.height;
  }

  return topRowY - config.container.height;
};

const getHierarchyGroupFromNode = (node: EntityNode) => {
  return `${node.id}-${K8sObjectTypes.HierarchyGroup}`;
};

const getNodeIdFromHierarchyGroupId = (id?: string) => {
  if (!id) return undefined;

  return id.split(`-${K8sObjectTypes.HierarchyGroup}`)[0];
};
