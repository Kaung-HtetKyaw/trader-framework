import { Pod } from '@/types/pod';
import { ContainerDetails } from '@/types/container';
import { Namespace } from '@/types/namespace';
import { Cluster } from '@/types/cluster';
import { K8sObjectTypeEnum } from './k8sObjects';

export type ClusterWithChildren = WithChildrenDataset<Cluster, NamespaceWithChildren>;

export type NamespaceWithChildren = WithChildrenDataset<Namespace, PodWithChildren>;

export type PodWithChildren = WithChildrenDataset<Pod, ContainerObject>;

export type ContainerObject = ContainerDetails & {
  uniqueId: string;
  parentId?: string;
};

export type WithChildrenDataset<T, K> = T & {
  uniqueId: string;
  parentId?: string;
  children: K[];
};

export type ContextObject = {
  kind: K8sObjectTypeEnum;
  metadata: {
    uid: string;
    name: string;
    namespace?: string;
  };
};

export type K8sContextObject = {
  id: string;
  name: string;
  kind: K8sObjectTypeEnum;
  apiVersion?: string;
  namespace?: string;
  spec?: {
    containers?: { name: string; image: string }[];
  };
  healthStatus: HealthStatus;
};

export type EntityNode = {
  id: string;
  name: string;
  namespace?: string;
  parent?: string;
  kind: K8sObjectTypeEnum;
  apiVersions: string[];
  children: EntityNode[];
  healthStatus: HealthStatus;
  placeholder?: boolean;
};

export type EntityNodeConnection = {
  id: string;
  source: string;
  target: string;
  sourceType: K8sObjectTypeEnum;
  targetType: K8sObjectTypeEnum;
};

export const VisualizationK8NodeTypes = {
  cluster: 'cluster',
  node: 'node',
  namespace: 'namespace',
  pod: 'pod',
  container: 'container',
} as const;
export type VisualizationK8NodeTypeEnum = keyof typeof VisualizationK8NodeTypes;

export type SelectNodeOptions = {
  multiple: boolean;
  prevSelectedNodeId: string;
};

export const VisualizationActions = {
  default: 'default',
  pan: 'pan',
  search: 'search',
} as const;
export type VisualizationActionEnum = keyof typeof VisualizationActions;

export type ZoomValue = number | 'fit';
export type ZoomLevel = {
  label: string;
  selectedLabel: string;
  value: ZoomValue;
  default: boolean;
};

export enum HealthStatus {
  Healthy = 'healthy',
  Warning = 'warning',
  Broken = 'broken',
  Orphaned = 'orphaned',
  Stale = 'stale',
  Unknown = 'unknown',
}

export type HealthStatusColor = {
  background: string;
  color: string;
  border: string;
};

export const BoundTypes = {
  Cluster: 'Cluster',
  ClusterWide: 'ClusterWide',
  Namespaced: 'Namespaced',
  Container: 'Container',
} as const;
export type BoundTypeEnum = keyof typeof BoundTypes;
