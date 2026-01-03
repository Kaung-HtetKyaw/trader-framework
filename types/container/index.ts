export type ContainerDetails = {
  id: string;
  clusterID: string;
  createdAt: string;
  deletedAt: string;
  image: string;
  name: string;
  namespace: string;
  organizationID: string;
  podID: string;
  version: string;
  ready: boolean;
  podName: string;
};

export type Container = {
  id: string;
  createdAt: string;
  deletedAt: string;
  image: string;
  name: string;
  version: string;
  ready: boolean;
  podName: string;
};

export type ContainerDetailsRequest = {
  clusterID: string;
  namespace: string;
  podID: string;
  containerID: string;
  containerName: string;
};
