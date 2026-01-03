export type Namespace = {
  id: string;
  name: string;
  labels: NamespaceLabel[];
  createdAt: string;
  clusterID: string;
  status: string;
  age: string;
};

export type NamespaceLabel = {
  type: string;
  value: string;
};

export type NamespaceDetailsRequest = { clusterID: string; namespaceID: string };
