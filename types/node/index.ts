export type ClusterNode = {
  clusterID: string;
  id: string;
  name: string;
  organizationID: string;
  status: string;
  age: string;
  kubeletVersion: string;
};

export type NodeDetailsRequest = { clusterID: string; nodeID: string };
