import { EntityNode } from '@/types/visualization';
import {
  RFVisualizationCoordinateDimension,
  RFVisualizationNode,
  RFVisualizationNodeTypes,
  VisualizationDimensionConfig,
} from '@/types/visualization/react-flow';
import ClusterIcon from '@/components/svgs/ClusterNodeIcon';
import { getVisualizationClusterWideNodeList } from './clusterWideNode';
import { K8sObjectTypes } from '@/types/visualization/k8sObjects';
import { getHorizontalChunkedArray, Rectangle } from '../..';
import { getRFVisualizationClusterBaseStyle } from '../../nodeStyles';

export const getVisualizationClusterNodes = (
  nodes: EntityNode[],
  config: VisualizationDimensionConfig
): RFVisualizationNode[] => {
  const coordinateDimensionList: RFVisualizationCoordinateDimension[] = [];

  return nodes.map((cluster, index) => {
    const visualizationNode = getVisualizationClusterNode(cluster, index, coordinateDimensionList, config);

    // record the width and height of the cluster for the viewport to calculate the position of the next cluster
    coordinateDimensionList.push({
      width: visualizationNode?.style?.width || 0,
      height: visualizationNode?.style?.height || 0,
      x: visualizationNode?.position?.x || 0,
      y: visualizationNode?.position?.y || 0,
    });

    return visualizationNode;
  });
};

export const getVisualizationClusterNode = (
  node: EntityNode,
  index: number,
  coordinateDimensionList: RFVisualizationCoordinateDimension[] = [],
  config: VisualizationDimensionConfig
) => {
  const rowNumber = Math.floor(index / config.entityPerRow);
  const namespacesWithDimensions = getVisualizationClusterWideNodeList(node?.children || [], config);

  const width = getChildrenWidth(namespacesWithDimensions, config) + config.entityPerRow * config.entityGap;
  const height = getChildrenHeight(namespacesWithDimensions, config);

  const topRow = getHorizontalChunkedArray(coordinateDimensionList, config.entityPerRow)[rowNumber - 1];

  const topRowDimensions = topRow ? topRow.sort((a, b) => b.height - a.height)[0] : config.coordinateDimensions;

  const topAdjacentPod = coordinateDimensionList[index - config.entityPerRow] || config.coordinateDimensions;

  const leftAdjacentPod = coordinateDimensionList[index - 1] || config.coordinateDimensions;

  // the x position of the pod is the width of the left adjacent pod + the x position of the left adjacent pod + the gap between the pods
  const x = rowNumber > 0 ? topAdjacentPod.x : leftAdjacentPod.width + leftAdjacentPod.x + config.entityGap;

  const y = topRowDimensions.height + topRowDimensions.y + config.entityPadding;

  const sortedEntityNodes = node.children.sort((a, b) => b.children.length - a.children.length) || [];
  const children = getVisualizationClusterWideNodeList(sortedEntityNodes, config).sort((a, b) => {
    const areaA = Number(a.style?.width) * Number(a.style?.height);
    const areaB = Number(b.style?.width) * Number(b.style?.height);

    return areaA - areaB;
  });

  return {
    id: node.id,
    type: RFVisualizationNodeTypes.group,

    position: {
      x,
      y,
    },
    data: {
      label: node.name,
      type: K8sObjectTypes.Cluster,
      rect: new Rectangle(x, y, width, height),
      icon: ClusterIcon,
      healthStatus: node.healthStatus,
      apiVersions: [],
    },
    selectable: false,
    style: {
      width,
      height,
      ...getRFVisualizationClusterBaseStyle(),
      backgroundColor: 'red',
    },
    children,
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

// cluster wide objects are group into group of individual nodes and group nodes
// to get the height , just be the node with highest y + height
const getChildrenHeight = (nodes: RFVisualizationNode[], config: VisualizationDimensionConfig) => {
  if (!nodes.length) return 0;

  const nodeWithMaxBottom = nodes.sort((a, b) => {
    const bottomA = a.position.y + Number(a.style?.height || 0);
    const bottomB = b.position.y + Number(b.style?.height || 0);

    return bottomB - bottomA;
  })[0];

  return nodeWithMaxBottom.position.y + Number(nodeWithMaxBottom?.style?.height) + config.entityPadding;
};
