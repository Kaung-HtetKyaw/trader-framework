import { ContainerListRequest } from '@/types/container/list';
import { PodListRequest } from '@/types/pod/list';
import { K8sObjectTypes } from '@/types/visualization/k8sObjects';
import { NodeListRequest } from '@/types/node/list';
import { NamespaceListRequest } from '@/types/namespace/list';
import {
  useGetContainersQuery,
  useGetNamespacesQuery,
  useGetNodesQuery,
  useGetPodsQuery,
} from '@/store/api/clusterApi';
import { useMemo } from 'react';
import {
  ContainerQueryResult,
  NamespaceQueryResult,
  NodeQueryResult,
  ObjectQueryProps,
  PodQueryResult,
  QueryResultMap,
} from './types';

export type UseK8sObjectQueryProps = ObjectQueryProps;

function useK8sObjectQuery(props: {
  type: typeof K8sObjectTypes.Namespace;
  variables: NamespaceListRequest;
}): NamespaceQueryResult;
function useK8sObjectQuery(props: { type: typeof K8sObjectTypes.Node; variables: NodeListRequest }): NodeQueryResult;
function useK8sObjectQuery(props: { type: typeof K8sObjectTypes.Pod; variables: PodListRequest }): PodQueryResult;
function useK8sObjectQuery(props: {
  type: typeof K8sObjectTypes.Container;
  variables: ContainerListRequest;
}): ContainerQueryResult;
// Generic overload for internal/generic usage
function useK8sObjectQuery<T extends ObjectQueryProps>(props: T): QueryResultMap[T['type']];
function useK8sObjectQuery<T extends UseK8sObjectQueryProps>(props: T): QueryResultMap[T['type']] {
  const { type, variables } = props;

  const namespaceQueryResult = useGetNamespacesQuery(variables as NamespaceListRequest, {
    skip: type !== K8sObjectTypes.Namespace,
  });

  const nodeQueryResult = useGetNodesQuery(variables as NodeListRequest, {
    skip: type !== K8sObjectTypes.Node,
  });

  const podQueryResult = useGetPodsQuery(variables as PodListRequest, {
    skip: type !== K8sObjectTypes.Pod,
  });

  const containerQueryResult = useGetContainersQuery(variables as ContainerListRequest, {
    skip: type !== K8sObjectTypes.Container,
  });

  const queryResult = useMemo(() => {
    switch (type) {
      case K8sObjectTypes.Namespace:
        return namespaceQueryResult as QueryResultMap[typeof K8sObjectTypes.Namespace];
      case K8sObjectTypes.Node:
        return nodeQueryResult as QueryResultMap[typeof K8sObjectTypes.Node];
      case K8sObjectTypes.Pod:
        return podQueryResult as QueryResultMap[typeof K8sObjectTypes.Pod];
      case K8sObjectTypes.Container:
        return containerQueryResult as QueryResultMap[typeof K8sObjectTypes.Container];
      default:
        throw new Error(`Invalid query type: ${type}`);
    }
  }, [type, namespaceQueryResult, nodeQueryResult, podQueryResult, containerQueryResult]);

  return queryResult as QueryResultMap[T['type']];
}

export default useK8sObjectQuery;
