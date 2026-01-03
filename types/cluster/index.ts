import { CLUSTER_STATUSES } from '@/lib/config';
import { PaginationParams } from '../list';

export type ClusterStatusEnum = keyof typeof CLUSTER_STATUSES;

export type Cluster = {
  id: string;
  /**
   * TODO: remove this once we have real data with pagination for infinite scroll
   * Since we dont have pagination for infinite scroll for now, we will stub the uniqueId for each cluster to have a unique identifier since
   * the id itself will not be unique across different pages.
   */
  uniqueId?: string;
  name: string;
  version: string;
  platform: string;
  organizationID: string;
  clusterGroupID: string;
  lastObserved: string;
  group?: string;
  type?: string;
  status?: string;
  provider?: string;
  stats?: ClusterStats;
};

export type ClusterStats = {
  health: number | string;
  status: ClusterStatusEnum;
  numberOfNodes: number;
  numberOfNamespaces: number;
  numberOfPods: number;
  numberOfUpgrades: number;
  numberOfContainers: number;
  averageCPUAcrossNodes: number;
  averageMemAcrossNodes: number;
  totalAvailableCPUAcrossNodes: number;
  sumCPULimit: number;
  sumCPURequest: number;
  totalAvailableMemAcrossNodes: number;
  sumMemLimit: number;
  sumMemRequest: number;
  totalCPUUsageAcrossNode: number;
  totalMemUsageAcrossNode: number;
};

export type ClusterGroup = {
  id: string;
  organizationID: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export type ClusterGroupWithStats = {
  id: string;
  name: string;
  total: number;
  healthy: number;
  unhealthy: number;
  atRisk: number;
  noOfClustersNeedsUpgrades: number;
  clusters: Cluster[];
};

export type ClusterKey = {
  value: string;
  name: string;
  organizationID: string;
  createdAt: string;
};

export type ClusterListParams = PaginationParams & {
  group?: string;
  status?: ClusterStatusEnum;
};

export type ClusterStatsDetails = {
  numberOfNodes: number;
  numberOfPods: number;
  numberOfNamespaces: number;
  numberOfContainers: number;
  organizationID: string;
  clusterID: string;
  averageCPUAcrossNodes: number;
  averageMemAcrossNodes: number;
};

export type CreateClusterGroupData = {
  name: string;
};

export type ClusterGroupData = {
  id: string;
  name: string;
};

export type ChangeClusterGroupPayload = {
  clusterID: string;
  clusterGroupID: string;
}[];
