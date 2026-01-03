import { createApi, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import {
  Cluster,
  ClusterKey,
  CreateClusterGroupData,
  ClusterGroup,
  ChangeClusterGroupPayload,
} from '@/types/cluster';
import type {
  ClusterDeprecatedAPIResponse,
  DeprecatedAPIDetail,
  ResolverResponse,
} from '@/types/upgradePlan';
import { getRandomNumber } from '@/lib/utils';
import { getClusterHealthPercentageByNumberOfUpgrades, getClusterStatusByNumberOfUpgrades } from '@/lib/status';
import { Namespace, NamespaceDetailsRequest } from '@/types/namespace';
import { Pod, PodDetailsRequest } from '@/types/pod';
import { ClusterNode, NodeDetailsRequest } from '@/types/node';
import { ContainerDetails, ContainerDetailsRequest } from '@/types/container';
import { BaseApiResponse } from '@/types';
import { transformApiErrorResponse } from '@/lib/utils/error';
import { getReduxBaseQueryWithErrorHandling } from '@/lib/redux/baseQuery';
import { K8sContextObject } from '@/types/visualization';
import { ListObjectFilterContext } from '@/types/visualization/list';
import { ListResponse } from '@/types/list';
import { K8sEventListResponse, K8sEventListRequest } from '@/types/event';
import { getContainerID } from '@/lib/utils/objects';
import { ContainerListRequest } from '@/types/container/list';
import { PodListRequest } from '@/types/pod/list';
import { NamespaceListRequest } from '@/types/namespace/list';
import { NodeListRequest } from '@/types/node/list';

// ✅ Create RTK Query API Slice
export const clusterApi = createApi({
  reducerPath: 'clusterApi',
  baseQuery: getReduxBaseQueryWithErrorHandling(),
  tagTypes: ['clusterKeys', 'clusterGroups', 'clusters'],

  endpoints: builder => {
    return {
      getClusters: builder.query<Cluster[], { clusterGroupID?: string }>({
        query: ({ clusterGroupID }) => ({
          url: '/cluster.list',
          method: 'POST',
          body: { clusterGroupID },
          notifyOnError: true,
        }),
        providesTags: ['clusterGroups', 'clusters'],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        transformResponse: (response: { clusters: any[] }) => {
          const clusters = response.clusters.map(cluster => {
            return {
              id: cluster.id,
              organizationID: cluster.organizationID,
              clusterGroupID: cluster.clusterGroupID,
              name: cluster.name,
              version: cluster.version,
              platform: cluster.platform,
              lastObserved: cluster.lastObserved,
            };
          });

          return [...clusters];
        },
      }),

      getClustersWithStats: builder.infiniteQuery<Cluster[], { clusterGroupID?: string }, number>({
        infiniteQueryOptions: {
          initialPageParam: 1,
          getNextPageParam: (lastPage, allPages, lastPageParam) => lastPageParam + 1,
          getPreviousPageParam: (firstPage, allPages, firstPageParam) => {
            return firstPageParam > 0 ? firstPageParam - 1 : undefined;
          },
        },
        query: arg => ({
          url: '/cluster.list',
          method: 'POST',
          body: { clusterGroupID: arg.queryArg.clusterGroupID, includeStats: true },
          notifyOnError: true,
        }),
        providesTags: ['clusterGroups', 'clusters'],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        transformResponse: async (response: any) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const clusters = response.clusters?.map((cluster: any) => {
            return {
              id: cluster.id,
              uniqueId: `${cluster.id}-${getRandomNumber(1, 10000)}`,
              organizationID: cluster.organizationID,
              name: cluster.name,
              clusterGroupID: cluster.clusterGroupID,
              version: cluster.version,
              platform: cluster.platform,
              lastObserved: cluster.lastObserved,
              provider: cluster.provider,
              stats: {
                ...cluster.stats,
                numberOfNodes: cluster.stats.numberOfNode,
                numberOfPods: cluster.stats.numberOfPod,
                numberOfNamespaces: cluster.stats.numberOfNamespace,
                numberOfContainers: cluster.stats.numberOfContainer,
                numberOfUpgrades: cluster.stats.numberOfUpgrade,
                health: getClusterHealthPercentageByNumberOfUpgrades(cluster.stats.numberOfUpgrade),
                status: getClusterStatusByNumberOfUpgrades(cluster.stats.numberOfUpgrade),
              },
            };
          }) as Cluster[];
          return clusters;
        },
      }),

      getClusterById: builder.query<Cluster, { id: string; includeStats: boolean }>({
        query: ({ id, includeStats }) => ({
          url: '/cluster.find',
          method: 'POST',
          body: {
            clusterID: id,
            includeStats: includeStats,
          },
          notifyOnError: true,
        }),
        providesTags: ['clusterGroups', 'clusters'],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        transformResponse: (cluster: any) => {
          return {
            id: cluster.id,
            organizationID: cluster.organizationID,
            clusterGroupID: cluster.clusterGroupID,
            name: cluster.name,
            version: cluster.version,
            platform: cluster.platform,
            lastObserved: cluster.lastObserved,
            provider: cluster.provider,
            stats: {
              ...cluster.stats,
              numberOfUpgrades: cluster.stats?.numberOfUpgrade || 0,
              numberOfContainers: cluster.stats?.numberOfContainer || 0,
              numberOfPods: cluster.stats?.numberOfPod || 0,
              numberOfNamespaces: cluster.stats?.numberOfNamespace || 0,
              numberOfNodes: cluster.stats?.numberOfNode || 0,
              health: getClusterHealthPercentageByNumberOfUpgrades(cluster.stats?.numberOfUpgrade || 0),
              status: getClusterStatusByNumberOfUpgrades(cluster.stats?.numberOfUpgrade || 0),
            },
          };
        },
      }),

      getNamespaces: builder.query<Namespace[], NamespaceListRequest>({
        query: ({ clusterID }) => ({
          url: '/cluster.namespace.list',
          method: 'POST',
          body: {
            clusterID,
          },
          notifyOnError: true,
        }),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        transformResponse: (response: { namespaces: any[] }) =>
          response.namespaces.map(namespace => ({
            id: namespace.id,
            clusterID: namespace.clusterID,
            name: namespace.name,
            createdAt: namespace.createdAt,
            labels: namespace.labels || [],
            pods: namespace.pods || [],
            age: namespace.age || '',
            status: namespace.status || '',
          })),
      }),

      getNodes: builder.query<ClusterNode[], NodeListRequest>({
        query: ({ clusterID }) => ({
          url: '/cluster.node.list',
          method: 'POST',
          body: { clusterID },
          notifyOnError: true,
        }),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        transformResponse: (response: { nodes: any[] }) =>
          response.nodes.map(el => ({
            clusterID: el.clusterID,
            id: el.id,
            name: el.name,
            organizationID: el.organizationID,
            status: el?.currentCondition?.reason || '',
            age: el.age,
            kubeletVersion: el.kubeletVersion,
          })),
      }),

      getNamespaceById: builder.query<Namespace, NamespaceDetailsRequest>({
        query: ({ clusterID, namespaceID }) => ({
          url: '/cluster.namespace.find',
          method: 'POST',
          body: {
            clusterID,
            namespaceID,
          },
          notifyOnError: true,
        }),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        transformResponse: (namespace: any) => ({
          id: namespace.id,
          clusterID: namespace.clusterID,
          name: namespace.name,
          createdAt: namespace.createdAt,
          labels: namespace.labels,
          pods: namespace.pods,
          age: namespace.age || '',
          status: namespace.status || '',
        }),
      }),

      getPods: builder.query<Pod[], PodListRequest>({
        query: ({ clusterID, namespaces }) => ({
          url: '/cluster.pod.list',
          method: 'POST',
          body: {
            clusterID,
            namespaces,
          },
          notifyOnError: true,
        }),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        transformResponse: (response: { pods: any[] }) => {
          return response.pods.map(pod => ({
            id: pod.id,
            clusterID: pod.clusterID,
            namespace: pod.namespace,
            name: pod.name,
            createdAt: pod.createdAt,
            deletedAt: pod.deletedAt,
            organizationID: pod.organizationID,
            containers: pod.containers,
            status: pod.status || '',
            containerCount: pod.containerCount || 0,
            restartCount: pod.restartCount || 0,
            age: pod.age || '',
          }));
        },
      }),

      getPodById: builder.query<Pod, PodDetailsRequest>({
        query: ({ clusterID, namespace, podID }) => ({
          url: '/cluster.pod.find',
          method: 'POST',
          body: {
            clusterID,
            namespace,
            podID,
          },
          notifyOnError: true,
        }),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        transformResponse: (pod: any) => {
          return {
            id: pod.id,
            clusterID: pod.clusterID,
            namespace: pod.namespace,
            name: pod.name,
            createdAt: pod.createdAt,
            deletedAt: pod.deletedAt,
            organizationID: pod.organizationID,
            containers: pod.containers,
            status: pod.status || '',
            containerCount: pod.containerCount || 0,
            restartCount: pod.restartCount || 0,
            age: pod.age || '',
          };
        },
      }),

      getContainers: builder.query<ContainerDetails[], ContainerListRequest>({
        query: ({ clusterID, namespaces, podIDs }) => ({
          url: '/cluster.container.list',
          method: 'POST',
          body: {
            clusterID,
            namespaces,
            podIDs,
          },
          notifyOnError: true,
        }),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        transformResponse: (response: { containers: any[] }) => {
          return response.containers.map(container => ({
            id: getContainerID(container.podID, container.name),
            podID: container.podID,
            name: container.name,
            image: container.imageName,
            clusterID: container.clusterID,
            createdAt: container.createdAt,
            deletedAt: container.deletedAt,
            namespace: container.namespace,
            organizationID: container.organizationID,
            version: container.imageVersion,
            ready: container.ready || false,
            podName: container.podName || '',
          }));
        },
      }),

      getContainerById: builder.query<ContainerDetails, ContainerDetailsRequest>({
        query: ({ clusterID, namespace, podID, containerID, containerName }) => ({
          url: '/cluster.container.find',
          method: 'POST',
          body: {
            clusterID,
            namespace,
            podID,
            containerID,
            containerName,
          },
          notifyOnError: true,
        }),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        transformResponse: (container: any) => ({
          id: getContainerID(container.podID, container.name),
          podID: container.podID,
          name: container.name,
          image: container.imageName,
          clusterID: container.clusterID,
          createdAt: container.createdAt,
          deletedAt: container.deletedAt,
          namespace: container.namespace,
          organizationID: container.organizationID,
          version: container.imageVersion,
          ready: container.ready || false,
          podName: container.podName || '',
        }),
      }),

      getNodeById: builder.query<ClusterNode, NodeDetailsRequest>({
        query: ({ clusterID, nodeID }) => ({
          url: '/cluster.node.find',
          method: 'POST',
          body: { clusterID, nodeID },
          notifyOnError: true,
        }),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        transformResponse: (node: any) => ({
          id: node.id,
          clusterID: node.clusterID,
          name: node.name,
          organizationID: node.organizationID,
          status: node?.currentCondition?.reason || '',
          age: node.age,
          kubeletVersion: node.kubeletVersion,
        }),
      }),

      getClusterDeprecatedAPI: builder.query<DeprecatedAPIDetail[], { clusterID: string }>({
        query: ({ clusterID }) => ({
          url: '/cluster.deprecatedAPIGroup.find',
          method: 'POST',
          body: { clusterID },
          notifyOnError: true,
        }),

        transformResponse: (response: ClusterDeprecatedAPIResponse) => {
          const deprecatedList = response?.deprecatedAPIs ?? [];
          return deprecatedList.map(item => ({
            kind: item.kind,
            name: item.name,
            removedIn: item.removedIn,
            deprecated: item.deprecated,
            deprecatedIn: item.deprecatedIn,
            clusterK8SVersion: item.clusterK8SVersion,
            replacementVersion: item.replacementVersion,
            currentGroupVersion: item.currentGroupVersion,
          }));
        },
      }),

      deleteCluster: builder.mutation<BaseApiResponse<null>, { clusterID: string }>({
        query: ({ clusterID }) => ({
          url: '/cluster.delete',
          method: 'POST',
          body: { clusterID },
        }),
        invalidatesTags: ['clusterGroups', 'clusters'],
        transformErrorResponse: (response: FetchBaseQueryError) =>
          transformApiErrorResponse(response, 'Failed to remove cluster'),
      }),

      getClusterGroups: builder.query<ClusterGroup[], void>({
        query: () => ({
          url: '/cluster.group.list',
          method: 'POST',
          body: {},
          notifyOnError: true,
        }),
        transformResponse: (response: { clusterGroups: ClusterGroup[] }) => response.clusterGroups,
        providesTags: ['clusterGroups'],
      }),

      findClusterGroup: builder.query<ClusterGroup, { name: string }>({
        query: ({ name }) => ({
          url: '/cluster.group.find',
          method: 'POST',
          body: { name },
          notifyOnError: true,
        }),
        providesTags: ['clusterGroups'],
      }),

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      createClusterGroup: builder.mutation<BaseApiResponse<any>, CreateClusterGroupData>({
        query: ({ name }) => ({
          url: '/cluster.group.create',
          method: 'POST',
          body: { name },
          notifyOnError: true,
        }),
        invalidatesTags: ['clusterGroups'],
        transformErrorResponse: (response: FetchBaseQueryError) =>
          transformApiErrorResponse(response, 'Failed to create cluster group'),
      }),

      changeClusterGroup: builder.mutation<BaseApiResponse<null>, ChangeClusterGroupPayload>({
        query: payload => ({
          url: '/cluster.group.change',
          method: 'POST',
          body: payload,
        }),
        invalidatesTags: ['clusterGroups'],
        transformErrorResponse: (response: FetchBaseQueryError) =>
          transformApiErrorResponse(response, 'Failed to change cluster group'),
      }),

      changeClusterGroupName: builder.mutation<BaseApiResponse<null>, { clusterGroupID: string; name: string }>({
        query: ({ clusterGroupID, name }) => ({
          url: '/cluster.group.update',
          method: 'POST',
          body: { clusterGroupID, name },
        }),

        transformResponse: (response: null) => ({
          success: true,
          message: 'Cluster group name updated successfully',
          data: response,
        }),

        transformErrorResponse: (response: FetchBaseQueryError) =>
          transformApiErrorResponse(response, 'Failed to change cluster group name'),

        invalidatesTags: ['clusterGroups'],
      }),

      deleteClusterGroup: builder.mutation<BaseApiResponse<null>, { clusterGroupID: string }>({
        query: ({ clusterGroupID }) => ({
          url: '/cluster.group.delete',
          method: 'POST',
          body: { clusterGroupID },
        }),

        transformResponse: (response: null) => ({
          success: true,
          message: 'Cluster group deleted successfully',
          data: response,
        }),

        transformErrorResponse: (response: FetchBaseQueryError) =>
          transformApiErrorResponse(response, 'Failed to delete cluster group'),

        invalidatesTags: ['clusterGroups'],
      }),

      getClusterKeys: builder.query<ClusterKey[], undefined>({
        query: () => ({
          url: '/cluster.token.list',
          method: 'POST',
          body: {},
          notifyOnError: true,
        }),
        transformResponse: (response: { clusterTokens: ClusterKey[] }) => response.clusterTokens,
        providesTags: ['clusterKeys'],
      }),

      createClusterKey: builder.mutation<ClusterKey, { name: string }>({
        query: ({ name }) => ({
          url: '/cluster.token.create',
          method: 'POST',
          body: { name },
        }),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        transformResponse: (response: any) => {
          return {
            value: response.Value,
            name: response.Name,
            organizationID: response.OrganizationID,
            createdAt: response.CreatedAt,
          };
        },

        transformErrorResponse: (response: FetchBaseQueryError) =>
          transformApiErrorResponse(response, 'Failed to create cluster key'),

        invalidatesTags: ['clusterKeys'],
      }),

      deleteClusterKey: builder.mutation<void, { tokenValue: string }>({
        query: ({ tokenValue }) => ({
          url: '/cluster.token.delete',
          method: 'POST',
          body: { tokenValue },
        }),
        transformErrorResponse: (response: FetchBaseQueryError) =>
          transformApiErrorResponse(response, 'Failed to delete cluster key'),
        invalidatesTags: ['clusterKeys'],
      }),

      updateClusterKey: builder.mutation<void, { tokenValue: string; name: string }>({
        query: ({ tokenValue, name }) => ({
          url: '/cluster.token.update',
          method: 'POST',
          body: { tokenValue, name },
        }),
        transformErrorResponse: (response: FetchBaseQueryError) =>
          transformApiErrorResponse(response, 'Failed to update cluster key'),
        invalidatesTags: ['clusterKeys'],
      }),

      getInCompatibilities: builder.query<ResolverResponse, { clusterID: string }>({
        query: ({ clusterID }) => ({
          url: '/cluster.nextUpgrade.find',
          method: 'POST',
          body: { clusterID },
          notifyOnError: true,
        }),
      }),

      getK8sObjects: builder.query<ListResponse<K8sContextObject>, ListObjectFilterContext>({
        query: ({ filter, fields, pagination }) => ({
          url: '/cluster.object.list',
          method: 'POST',
          body: {
            filter,
            fields,
            pagination,
          },
          notifyOnError: true,
        }),
        transformResponse: (response: ListResponse<K8sContextObject>) => response,
      }),

      getK8sEvents: builder.query<K8sEventListResponse, K8sEventListRequest>({
        query: ({ filter, sort, pagination }) => ({
          url: '/cluster.k8sEvent.list',
          method: 'POST',
          body: {
            filter,
            sort,
            pagination,
          },
          notifyOnError: true,
        }),
      }),
    };
  },
});

export const {
  useGetClusterByIdQuery,
  useGetNamespacesQuery,
  useGetNamespaceByIdQuery,
  useGetPodsQuery,
  useGetPodByIdQuery,
  useGetContainersQuery,
  useGetContainerByIdQuery,
  useGetClustersWithStatsInfiniteQuery,
  useGetClustersQuery,
  useGetClusterKeysQuery,
  useGetNodesQuery,
  useGetClusterDeprecatedAPIQuery,
  useCreateClusterGroupMutation,
  useGetClusterGroupsQuery,
  useCreateClusterKeyMutation,
  useDeleteClusterKeyMutation,
  useUpdateClusterKeyMutation,
  useGetInCompatibilitiesQuery,
  useChangeClusterGroupMutation,
  useFindClusterGroupQuery,
  useDeleteClusterGroupMutation,
  useChangeClusterGroupNameMutation,
  useGetK8sObjectsQuery,
  useLazyGetK8sObjectsQuery,
  useDeleteClusterMutation,
  useGetK8sEventsQuery,
  useLazyGetK8sEventsQuery,
} = clusterApi;
