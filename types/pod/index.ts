export type Pod = {
  clusterID: string;
  createdAt: string;
  deletedAt: string;
  id: string;
  name: string;
  namespace: string;
  organizationID: string;
  status: string;
  restartCount: number;
  containerCount: number;
  age: string;
};

export type PodDetailsRequest = { clusterID: string; namespace: string; podID: string };
