import { EntityNode } from '@/types/visualization';
import { K8sObjectTypes } from '@/types/visualization/k8sObjects';
import {
  RFVisualizationNode,
  RFVisualizationNodeTypes,
  VisualizationDimensionConfig,
} from '@/types/visualization/react-flow';
import { getHorizontalChunkedArray, Rectangle } from '../..';
import { getVisualizationNamespacedNodeList as getVisualizationMatrixNamespacedNodeList } from '../matrixLayout/namespacedNode';
import { getRFVisualizationNamespaceBaseStyle } from '../../nodeStyles';
import { getVisualizationHierarchyNodeList } from './hierarchyGroupNode';

export const getVisualizationClusterWideNodeList = (
  nodes: EntityNode[],
  config: VisualizationDimensionConfig
): RFVisualizationNode[] => {
  const cwoGroupNodesWithContent = nodes.filter(
    el =>
      !el.namespace &&
      el.kind !== K8sObjectTypes.Namespace &&
      el.kind !== K8sObjectTypes.PlaceHolderNamespaceGroup &&
      el.kind !== K8sObjectTypes.PlaceHolderCWOGroup &&
      el.kind === K8sObjectTypes.CWOGroup
  );
  const cwoPlaceholderGroupNodes = nodes.filter(el => el.kind === K8sObjectTypes.PlaceHolderCWOGroup);
  const hasCWOPlaceholderNodes = cwoPlaceholderGroupNodes.length > 0;
  const hasCWOContentNodes = cwoGroupNodesWithContent.length > 0;

  const cwoPlaceholderGroupNodesRF = getVisualizationClusterWideGroupNodeList(
    cwoPlaceholderGroupNodes,
    {
      minX: 0,
      minY: 0,
      maxX: 0,
      maxY: 2000,
    },
    {
      ...config,
      entityPerRow: 1,
    }
  );
  const cwoPlaceholderGroupNodesBound = getNodesBound(cwoPlaceholderGroupNodesRF, config);

  const cwoContentGroupNodesRF = getVisualizationClusterWideGroupNodeList(
    cwoGroupNodesWithContent,
    hasCWOPlaceholderNodes
      ? cwoPlaceholderGroupNodesBound
      : {
          minX: 0,
          minY: 0,
          maxX: 0,
          maxY: 2000,
        },
    {
      ...config,
      entityPerRow: 1,
    }
  );
  const cwoContentNodesBound = hasCWOContentNodes
    ? getNodesBound(cwoContentGroupNodesRF, config)
    : cwoPlaceholderGroupNodesBound;
  const cwoGroupNodesRF = cwoContentGroupNodesRF.concat(cwoPlaceholderGroupNodesRF);

  const cwoGroupNodesWithMaxWidth = cwoGroupNodesRF.map(node => ({
    ...node,
    style: {
      ...node.style,
    },
  }));

  const namespaceGroupNodesWithContent = nodes.filter(el => el.kind === K8sObjectTypes.Namespace);
  const namespacePlaceholderGroupNodes = nodes.filter(el => el.kind === K8sObjectTypes.PlaceHolderNamespaceGroup);

  const namespaceContentGroupNodesRF = getVisualizationClusterWideGroupNodeList(
    namespaceGroupNodesWithContent,
    cwoContentNodesBound,
    {
      ...config,
      entityPerRow: 1,
    }
  );

  const namespaceContentNodesBound = getNodesBound(namespaceContentGroupNodesRF, config);
  const hasNamespaceContentNodes = namespaceGroupNodesWithContent.length > 0;

  const namespacePlaceholderGroupNodesRF = getVisualizationClusterWideGroupNodeList(
    namespacePlaceholderGroupNodes,
    hasNamespaceContentNodes ? namespaceContentNodesBound : cwoContentNodesBound,
    config
  );

  const namespaceGroupNodesRF = namespaceContentGroupNodesRF.concat(namespacePlaceholderGroupNodesRF);

  const namespaceGroupNodesWithMaxWidth = namespaceGroupNodesRF.map(node => ({
    ...node,
    style: {
      ...node.style,
    },
  }));

  return cwoGroupNodesWithMaxWidth.concat(namespaceGroupNodesWithMaxWidth);
};

const BOTTOM_THRESHOLD_OFFSET = 500;
const getVisualizationClusterWideGroupNodeList = (
  nodes: EntityNode[],
  boundLimit: { minX: number; minY: number; maxX: number; maxY: number },
  config: VisualizationDimensionConfig
): RFVisualizationNode[] => {
  let currentCoord = {
    x: boundLimit.maxX,
    y: boundLimit.minY,
    col: 0,
    right: 0,
  };

  const maxWidthByCol: number[] = [];

  const baseWidth = config.entityPerRow * config.container.width;
  const gapWidth = config.entityGap * (config.entityPerRow - 1);
  const paddingWidth = config.entityPadding * 2;
  const standardWidth = baseWidth + gapWidth + paddingWidth;
  const widthsByCol: { id: string; width: number; name: string; x: number }[][] = [];

  const visualizationNodes = nodes.map(node => {
    const visualizationNode = getVisualizationClusterWideGroupNode(
      node,
      currentCoord,
      maxWidthByCol[currentCoord.col - 1] || 0,
      config
    );
    const nodeWidth = visualizationNode?.style?.width || 0;
    const nodeRight = visualizationNode.position.x + config.entityGap;
    const nodeBottom = visualizationNode.position.y + (visualizationNode?.style?.height || 0) + config.entityGap;
    const isPastBottomThreshold = nodeBottom + BOTTOM_THRESHOLD_OFFSET > boundLimit.maxY + standardWidth;
    const nextCol = isPastBottomThreshold ? currentCoord.col + 1 : currentCoord.col;
    const maxRight = nodeRight > currentCoord.x ? nodeRight : currentCoord.right;

    const currentColWidths = widthsByCol[currentCoord.col];
    if (currentColWidths) {
      currentColWidths.push({ id: node.id, width: nodeWidth, name: node.name, x: visualizationNode.position.x });
    } else {
      widthsByCol[currentCoord.col] = [
        { id: node.id, width: nodeWidth, name: node.name, x: visualizationNode.position.x },
      ];
    }

    // update the max width by column
    if (currentCoord.col !== nextCol) {
      maxWidthByCol.push(nodeWidth);
    } else {
      const previousWidth = maxWidthByCol[currentCoord.col] || 0;
      if (nodeWidth > previousWidth) {
        maxWidthByCol[currentCoord.col] = nodeWidth;
      }
    }

    // prepare for the next node
    currentCoord = {
      x: currentCoord.col === nextCol ? currentCoord.x : maxRight + config.entityGap,
      y: isPastBottomThreshold ? boundLimit.minY : nodeBottom + config.entityGap,
      right: currentCoord.col === nextCol ? maxRight : currentCoord.right,
      col: nextCol,
    };

    return visualizationNode;
  });

  return getVisualizationClusterWideGroupNodeByPrevColPosition(visualizationNodes, widthsByCol, boundLimit, config);
};

const getVisualizationClusterWideGroupNode = (
  node: EntityNode,
  currentCoord: { x: number; y: number; col: number; right: number },
  maxWidth: number,
  config: VisualizationDimensionConfig
) => {
  const x = currentCoord.x + maxWidth + config.entityPadding;
  const y = currentCoord.y;
  const groupChildrenWithDimensions = getVisualizationHierarchyNodeList(
    node?.children?.filter(el => el.children.length),
    config,
    {
      hasParent: false,
      startPosition: { x: 0, y: 2 * config.entityGap },
    }
  );

  const groupChildrenBottom = getChildrenColHeight(groupChildrenWithDimensions, config);

  const individualChildrenWithDimensions = getVisualizationMatrixNamespacedNodeList(
    node?.children?.filter(el => !el.children.length),
    {
      ...config,
      entityPerRow: 3,
      coordinateDimensions: { x: 0, y: groupChildrenBottom + config.entityGap, width: 0, height: 0 },
    }
  );

  const childrenWithDimensions = node.placeholder
    ? []
    : [...groupChildrenWithDimensions, ...individualChildrenWithDimensions];
  const actualWidth = getChildrenWidth(groupChildrenWithDimensions, individualChildrenWithDimensions, config);
  const groupWidth = actualWidth > maxWidth ? actualWidth : maxWidth;

  const width = node.placeholder ? config.placeholderGroup.width : groupWidth;
  const groupHeight = getChildrenHeight(childrenWithDimensions, config);
  const height = node.placeholder ? config.placeholderGroup.height : groupHeight;

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
      type: node.kind,
      rect: new Rectangle(x, y, width, height),
      healthStatus: node.healthStatus,
      apiVersions: node.apiVersions,
      connections: [],
    },
    connectable: false,
    style: {
      width,
      height,
      ...getRFVisualizationNamespaceBaseStyle(),
    },
    children: childrenWithDimensions,
  };
};

const getNodesBound = (elements: RFVisualizationNode[], config: VisualizationDimensionConfig) => {
  const MIN_HEIGHT = 3000;
  const MIN_WIDTH = 300;

  if (!elements.length) {
    return {
      minX: config.entityPadding,
      maxX: MIN_WIDTH,
      minY: config.entityPadding,
      maxY: MIN_HEIGHT,
    };
  }

  let minX = Infinity,
    minY = Infinity;
  let maxX = -Infinity,
    maxY = -Infinity;

  for (const { position, style } of elements) {
    const x = position.x;
    const y = position.y;
    const width = style?.width || 0;
    const height = style?.height || 0;
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x + width);
    maxY = Math.max(maxY, y + height);
  }

  return {
    minX,
    minY,
    maxX: maxX > MIN_WIDTH ? maxX : MIN_WIDTH,
    maxY: maxY > MIN_HEIGHT ? maxY : MIN_HEIGHT,
  };
};

// Set width for each node to the biggest width in the column
const getVisualizationClusterWideGroupNodeByPrevColPosition = (
  nodes: RFVisualizationNode[],
  widthsByCol: { id: string; width: number; x: number; name: string }[][],
  startingBound: { minX: number; minY: number; maxX: number; maxY: number },
  config: VisualizationDimensionConfig
) => {
  const maxWidthsByCol = widthsByCol.map(col => col.reduce((acc, cur) => (acc > cur.width ? acc : cur.width), 0));

  const flattenedWidthsByCol = widthsByCol
    .map((col, index) =>
      col.map(el => {
        const currentWidth = maxWidthsByCol[index];

        const prevCols = maxWidthsByCol.slice(0, index);
        const prevColsTotalWidth = prevCols.reduce((acc, cur) => acc + cur, 0);
        const prevTotalGaps = prevCols.length * 30;
        const positionX = startingBound.maxX + config.entityGap + prevColsTotalWidth + prevTotalGaps;

        return { ...el, width: currentWidth, x: positionX };
      })
    )
    .flat();

  return nodes.map(node => {
    const currentNode = flattenedWidthsByCol.find(el => el.id === node.id);

    const width = currentNode?.width as number;
    const x = currentNode?.x as number;
    if (node.data.type === K8sObjectTypes.PlaceHolderNamespaceGroup) {
      return { ...node, position: { ...node.position, x } };
    }

    return { ...node, style: { ...node.style, width }, position: { ...node.position, x } };
  });
};

const getChildrenWidth = (
  groupChildren: RFVisualizationNode[],
  individualChildren: RFVisualizationNode[],
  config: VisualizationDimensionConfig
) => {
  const groupChildrenWidth = getGroupChildrenWidth(groupChildren) + config.entityGap;
  const individualChildrenWidth = getIndividualChildrenWidth(individualChildren, config) + config.entityGap;
  return groupChildrenWidth > individualChildrenWidth ? groupChildrenWidth : individualChildrenWidth;
};

const getGroupChildrenWidth = (nodes: RFVisualizationNode[]) => {
  return nodes.reduce((acc, cur) => {
    const width = cur.position.x + Number(cur.style?.width || 0);
    return acc < width ? width : acc;
  }, 0);
};

const getIndividualChildrenWidth = (nodes: RFVisualizationNode[], config: VisualizationDimensionConfig) => {
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

const getChildrenHeight = (children: RFVisualizationNode[], config: VisualizationDimensionConfig): number => {
  return children.reduce((acc, child) => {
    const bottom = child.position.y + (child.style?.height || 0) + config.entityGap;
    return bottom > acc ? bottom : acc;
  }, 0);
};

const getChildrenColHeight = (children: RFVisualizationNode[], config: VisualizationDimensionConfig): number => {
  return children.reduce((acc, cur) => {
    const nodeBottom = cur.position.y + (cur.style?.height || 0);
    const childrenBottom = getChildrenHeight(cur.children || [], config);
    return nodeBottom > childrenBottom ? nodeBottom : childrenBottom;
  }, 0);
};
