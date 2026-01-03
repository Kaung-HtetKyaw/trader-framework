import {
  useGetContainersQuery,
  useGetNamespacesQuery,
  useGetPodsQuery,
  useGetNodesQuery,
  clusterApi,
} from '@/store/api/clusterApi';
import { NamespaceListRequest } from '@/types/namespace/list';
import { NodeListRequest } from '@/types/node/list';
import { PodListRequest } from '@/types/pod/list';
import { ContainerListRequest } from '@/types/container/list';
import { K8sObjectTypes } from '@/types/visualization/k8sObjects';
import { Namespace } from '@/types/namespace';
import { ClusterNode } from '@/types/node';
import { Pod } from '@/types/pod';
import { ContainerDetails } from '@/types/container';

// helper type to replace the data property type
type ReplaceData<T, NewData> = Omit<T, 'data'> & { data: NewData | undefined };

type NamespaceData = typeof clusterApi.endpoints.getNamespaces.Types.ResultType;
type NodeData = typeof clusterApi.endpoints.getNodes.Types.ResultType;
type PodData = typeof clusterApi.endpoints.getPods.Types.ResultType;
type ContainerData = typeof clusterApi.endpoints.getContainers.Types.ResultType;

type NamespaceQueryResultRaw = ReturnType<typeof useGetNamespacesQuery>;
type NodeQueryResultRaw = ReturnType<typeof useGetNodesQuery>;
type PodQueryResultRaw = ReturnType<typeof useGetPodsQuery>;
type ContainerQueryResultRaw = ReturnType<typeof useGetContainersQuery>;

// NOTE: TS cannot infer the data type from the query result, so we need to replace it with the data type from the endpoint
export type NamespaceQueryResult = ReplaceData<NamespaceQueryResultRaw, NamespaceData>;
export type NodeQueryResult = ReplaceData<NodeQueryResultRaw, NodeData>;
export type PodQueryResult = ReplaceData<PodQueryResultRaw, PodData>;
export type ContainerQueryResult = ReplaceData<ContainerQueryResultRaw, ContainerData>;

export type QueryResultMap = {
  [K8sObjectTypes.Namespace]: NamespaceQueryResult;
  [K8sObjectTypes.Node]: NodeQueryResult;
  [K8sObjectTypes.Pod]: PodQueryResult;
  [K8sObjectTypes.Container]: ContainerQueryResult;
};

export type ObjectQueryProps =
  | { type: typeof K8sObjectTypes.Namespace; variables: NamespaceListRequest }
  | { type: typeof K8sObjectTypes.Node; variables: NodeListRequest }
  | { type: typeof K8sObjectTypes.Pod; variables: PodListRequest }
  | { type: typeof K8sObjectTypes.Container; variables: ContainerListRequest };

export type QueryDataMap = {
  [K8sObjectTypes.Namespace]: Namespace[];
  [K8sObjectTypes.Node]: ClusterNode[];
  [K8sObjectTypes.Pod]: Pod[];
  [K8sObjectTypes.Container]: ContainerDetails[];
};
