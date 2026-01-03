import { CoordinateExtent, type Node, type Edge, NodeProps, EdgeProps, XYPosition } from '@xyflow/react';
import { AbstractView, ComponentType, ModifierKey, SyntheticEvent } from 'react';
import { HealthStatus, VisualizationK8NodeTypeEnum } from '.';
import { K8sObjectTypeEnum } from './k8sObjects';
import { IconProps } from '../misc';
import { Rectangle } from '@/lib/visualization';

export type RFNativeNode = Node;

export type RFNativeEdge = Edge;

export type RFVisualizationNodeTypes = Record<
  RFVisualizationNodeTypeEnum,
  ComponentType<NodeProps<RFVisualizationNode>>
>;

export type RFVisualizationEdgeTypes = Record<
  RFVisualizationEdgeTypeEnum,
  ComponentType<EdgeProps<RFVisualizationEdge>>
>;

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface RFVisualizationNode<T = {}> extends RFNativeNode {
  id: string;
  type: RFVisualizationNodeTypeEnum;
  /**
   * The id of the parent node.
   * If the node is a group, this is the id of the parent group.
   * If the node is a node, this is the id of the parent group.
   */
  parentId?: string;
  extent?: 'parent' | CoordinateExtent;
  data: RFVisualizationNodeData<T>;
  children?: RFVisualizationNode<T>[];
  style?: Omit<React.CSSProperties, 'width' | 'height'> & { width?: number; height?: number };
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type RFVisualizationNodeData<T = {}> = {
  label: string;
  type: K8sObjectTypeEnum;
  rect: Rectangle;
  namespace?: string;
  apiVersions: string[];
  whitespaceRect?: {
    top?: { y: number; height: number };
    left?: { x: number; width: number };
  };
  description?: string;
  icon?: (props: IconProps) => React.ReactNode;
  hidden?: boolean;
  showPlaceholder?: boolean;
  absolutePosition?: XYPosition;
  bounds?: RFVisualizationNodeBounds;
  healthStatus: HealthStatus;
  connections?: RFVisualizationEdge[];
} & T;

export type RFVisualizationNodeBounds = {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
};

export type RFVisualizationNamespaceData = RFVisualizationNodeData<{
  healthy: boolean;
}>;

export interface RFVisualizationEdge extends RFNativeEdge {
  type: RFVisualizationEdgeTypeEnum;
  data: RFVisualizationEdgeData;
}

export type RFVisualizationEdgeData = {
  label: string;
  sourceType: K8sObjectTypeEnum;
  targetType: K8sObjectTypeEnum;
  hidden?: boolean;
};

export type RFVisualizationCoordinateDimension = {
  width: number;
  height: number;
  x: number;
  y: number;
  bottom?: number;
  whitespaceRect?: {
    top?: { y: number; height: number };
    left?: { x: number; width: number };
  };
  isParent?: boolean;
  type?: K8sObjectTypeEnum;
};

export type RFVisualizationConnectableEntity = {
  id: string;
  name: string;
  connections: { id: string; type: K8sObjectTypeEnum }[];
  type: K8sObjectTypeEnum;
};

export const RFVisualizationConnectableEntityTypes = {
  cluster: 'cluster',
  node: 'node',
  namespace: 'namespace',
  container: 'container',
  pod: 'pod',
} as const;
export type RFVisualizationConnectableEntityTypeEnum = keyof typeof RFVisualizationConnectableEntityTypes;

export type RFVisualizationColor = {
  background: Record<VisualizationK8NodeTypeEnum, string>;
  text: Record<VisualizationK8NodeTypeEnum, string>;
};

export const RFVisualizationNodeTypes = {
  group: 'group',
  node: 'node',
} as const;
export type RFVisualizationNodeTypeEnum = keyof typeof RFVisualizationNodeTypes;

export const RFVisualizationEdgeTypes = {
  default: 'default',
  smoothstep: 'smoothstep',
} as const;
export type RFVisualizationEdgeTypeEnum = keyof typeof RFVisualizationEdgeTypes;

// This is the mouse event interface reactflow uses internally
interface UIEvent<T = Element, E = Event> extends SyntheticEvent<T, E> {
  detail: number;
  view: AbstractView;
}
export interface ReactFlowMouseEvent<T = Element, E = Event> extends UIEvent<T, E> {
  altKey: boolean;
  button: number;
  buttons: number;
  clientX: number;
  clientY: number;
  ctrlKey: boolean;
  /**
   * See [DOM Level 3 Events spec](https://www.w3.org/TR/uievents-key/#keys-modifier). for a list of valid (case-sensitive) arguments to this method.
   */
  getModifierState(key: ModifierKey): boolean;
  metaKey: boolean;
  movementX: number;
  movementY: number;
  pageX: number;
  pageY: number;
  relatedTarget: EventTarget | null;
  screenX: number;
  screenY: number;
  shiftKey: boolean;
}

export const VisualizationLayoutTypes = {
  matrix: 'matrix',
  hierarchy: 'hierarchy',
} as const;
export type VisualizationLayoutTypeEnum = keyof typeof VisualizationLayoutTypes;

export type VisualizationDimensionConfig = {
  entityPerRow: number;
  entityGap: number;
  entityPadding: number;
  layoutType: VisualizationLayoutTypeEnum;
  container: {
    width: number;
    height: number;
  };
  group: {
    width: number;
    height: number;
  };
  placeholderGroup: {
    width: number;
    height: number;
  };
  coordinateDimensions: {
    x: number;
    y: number;
    width: number;
    height: number;
    whitespaceRect?: {
      top?: { y: number; height: number };
      left?: { x: number; width: number };
    };
    type?: K8sObjectTypeEnum;
  };
  marker: {
    orient: string;
  };
};
