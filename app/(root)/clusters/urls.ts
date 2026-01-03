import { stringifyQs } from '@/lib/utils';
import { VisualizationListFilterParams } from '@/types/visualization/list';

/**
 * The purpose of this path variable is to be used in the layout of cluster list to check if we should add `Connect Clusters` button or not
 */
export const CLUSTER_DETAILS_LIST_PATH = '/clusters';

export const getClusterDetailsPath = (clusterId: string) => {
  return `${CLUSTER_DETAILS_LIST_PATH}/${clusterId}`;
};

export const getClusterNamespacesPath = (clusterId: string) => {
  return `${CLUSTER_DETAILS_LIST_PATH}/${clusterId}/namespaces`;
};

export const getClusterPodsPath = (clusterId: string, namespace?: string) => {
  return `${CLUSTER_DETAILS_LIST_PATH}/${clusterId}/pods${namespace ? `?namespace=${namespace}` : ''}`;
};

export const getClusterContainersPath = (clusterId: string, namespaces?: string[], podId?: string) => {
  return `${CLUSTER_DETAILS_LIST_PATH}/${clusterId}/containers${
    namespaces ? `?namespace=${namespaces.join(',')}` : ''
  }${podId ? `${namespaces ? `&` : `?`}pod=${podId}` : ''}`;
};

export const getClusterNodesPath = (clusterId: string) => {
  return `${CLUSTER_DETAILS_LIST_PATH}/${clusterId}/nodes`;
};

export const getClusterEventsPath = (clusterId: string) => {
  return `${CLUSTER_DETAILS_LIST_PATH}/${clusterId}/events`;
};

export const getClusterManagePath = (clusterId: string) => {
  return `${CLUSTER_DETAILS_LIST_PATH}/${clusterId}/manage`;
};

export const getClusterUpgradePlanPath = (clusterId: string) => {
  return `${CLUSTER_DETAILS_LIST_PATH}/${clusterId}/upgrade-plan`;
};

export const getDefaultVisualizationPath = () => {
  return `/visualization`;
};

export const getClusterVisualizationPath = (clusterId: string, params?: VisualizationListFilterParams) => {
  const paramValue = Object.entries(params || {}).reduce((acc, [key, value]) => {
    return {
      ...acc,
      [key]: Array.isArray(value) ? value.join(',') : value,
    };
  }, {});

  const qString = stringifyQs(paramValue);

  return `${getDefaultVisualizationPath()}/${clusterId}${qString ? `?${qString}` : ''}`;
};

export const isUpgradePlanPath = (path: string) => {
  const pathParts = path.split('/');
  return pathParts.length === 4 && pathParts[3] === 'upgrade-plan';
};

export const isVisualizationPath = (path: string) => {
  const pathParts = path.split('/');
  return pathParts.length === 4 && pathParts[3] === 'visualization';
};

export const isClusterManagepath = (path: string) => {
  const pathParts = path.split('/');
  return pathParts.length === 4 && pathParts[3] === 'manage';
};

export const isEventsPath = (path: string) => {
  const pathParts = path.split('/');
  return pathParts.length === 4 && pathParts[3] === 'events';
};
